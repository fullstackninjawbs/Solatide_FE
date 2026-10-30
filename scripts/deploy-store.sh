#!/usr/bin/env bash
# ==============================================================================
# Solatide Biosciences - Atomic Storefront Deployment & Release Script
# ==============================================================================
# Architecture:
#   <FRONTEND_DIR>/releases/<RELEASE_ID>/          (web root of one release; served by nginx)
#   <FRONTEND_DIR>/dist-store-current -> releases/<ACTIVE_RELEASE>
#   <FRONTEND_DIR>/release-meta/<RELEASE_ID>.success   verification marker (OUTSIDE the web root)
#   <FRONTEND_DIR>/release-meta/activations.log       "<UTC time> <RELEASE_ID> <reason>" per activation
#   <FRONTEND_DIR>/release-meta/deploy.lock           flock(1) lock: one build/activation at a time
#
# Usage:
#   ./scripts/deploy-store.sh               # Build, validate, and atomically activate new release
#   ./scripts/deploy-store.sh --build-only  # Build and validate WITHOUT activating
#   ./scripts/deploy-store.sh rollback      # Re-activate the previously ACTIVATED verified release
#   ./scripts/deploy-store.sh status        # Show active release, activations and releases
#   ./scripts/deploy-store.sh activate <ID> # Atomically activate an existing verified release
#
# Environment:
#   FRONTEND_DIR            default: repo root
#   NOTE: this script never deletes releases. Old releases are kept; remove them manually if disk space is needed.
#   PRERENDER_API_FALLBACK  passed through to prerender.js (do not set in production)
#
# Requires Linux (flock from util-linux, GNU mv -T, date +%N). Exit code 75 = another deploy running.
# ==============================================================================

set -euo pipefail

# 1. Path Resolution
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="${FRONTEND_DIR:-$(cd "$SCRIPT_DIR/.." && pwd)}"
RELEASES_DIR="$FRONTEND_DIR/releases"
CURRENT_SYMLINK="$FRONTEND_DIR/dist-store-current"
META_DIR="$FRONTEND_DIR/release-meta"
ACTIVATIONS_LOG="$META_DIR/activations.log"
LOCK_FILE="$META_DIR/deploy.lock"

# 2. Helper Functions
log_info() { echo -e "\033[1;34m[INFO]\033[0m $*"; }
log_success() { echo -e "\033[1;32m[SUCCESS]\033[0m $*"; }
log_warn() { echo -e "\033[1;33m[WARN]\033[0m $*"; }
log_error() { echo -e "\033[1;31m[ERROR]\033[0m $*" >&2; }

mkdir -p "$RELEASES_DIR" "$META_DIR"

# Serialise every mutating command (build, activate, rollback). The API may trigger
# rebuilds from several PM2 workers at once; only one may run, the others exit 75 (EX_TEMPFAIL).
acquire_lock() {
    if ! command -v flock >/dev/null 2>&1; then
        log_error "flock(1) not found (util-linux). Refusing to run without a deploy lock."
        exit 1
    fi
    exec 9>"$LOCK_FILE"
    flock -n 9 || { echo "deploy busy"; exit 75; }
}

# A release is verified when its marker exists outside the web root (legacy: inside the release).
is_verified() {
    local id="$1"
    [ -f "$META_DIR/$id.success" ] || [ -f "$RELEASES_DIR/$id/.release-success" ]
}

active_release_id() {
    if [ -L "$CURRENT_SYMLINK" ]; then
        basename "$(readlink -f "$CURRENT_SYMLINK")"
    fi
}

# Most recently activated release id that differs from the current one (from the activation log).
previous_activated_id() {
    local current="${1:-}"
    [ -f "$ACTIVATIONS_LOG" ] || return 0
    awk '{print $2}' "$ACTIVATIONS_LOG" | tac | while read -r id; do
        if [ -n "$id" ] && [ "$id" != "$current" ] && [ -d "$RELEASES_DIR/$id" ] && is_verified "$id"; then
            echo "$id"
            break
        fi
    done
}

# Atomically switch the symlink to a release directory
atomic_activate() {
    local target_dir="$1"
    local reason="${2:-activate}"
    local release_name
    release_name="$(basename "$target_dir")"

    if [ ! -d "$target_dir" ]; then
        log_error "Target release directory does not exist: $target_dir"
        exit 1
    fi
    if ! is_verified "$release_name"; then
        log_error "Refusing to activate release '$release_name': no verification marker."
        exit 1
    fi

    log_info "Activating $release_name ($reason)"
    local tmp_symlink="$FRONTEND_DIR/dist-store-current.new.$$"
    rm -f "$tmp_symlink"
    ln -s "$target_dir" "$tmp_symlink"
    mv -Tf "$tmp_symlink" "$CURRENT_SYMLINK"
    echo "$(date -u +'%Y-%m-%dT%H:%M:%SZ') $release_name $reason" >> "$ACTIVATIONS_LOG"

    log_success "Active release is now: $release_name -> $(readlink -f "$CURRENT_SYMLINK")"
}

# Show status of current release and past releases
show_status() {
    echo "=================================================="
    echo "Solatide Storefront Release Status"
    echo "=================================================="
    local active
    active="$(active_release_id || true)"
    if [ -n "$active" ]; then
        echo "Active Release : $active -> $(readlink -f "$CURRENT_SYMLINK")"
    elif [ -e "$CURRENT_SYMLINK" ]; then
        echo "Active Target  : $CURRENT_SYMLINK (Warning: not a symlink)"
    else
        echo "Active Target  : None (dist-store-current does not exist yet)"
    fi
    echo "Previous       : $(previous_activated_id "$active" || true)"
    echo ""
    echo "Last activations:"
    if [ -f "$ACTIVATIONS_LOG" ]; then tail -n 10 "$ACTIVATIONS_LOG" | sed 's/^/  /'; else echo "  (none)"; fi
    echo ""
    echo "Releases in $RELEASES_DIR:"
    local found=0
    for rel in $(ls -1 "$RELEASES_DIR" | sort); do
        [ -d "$RELEASES_DIR/$rel" ] || continue
        local marker="  "
        [ "$rel" = "$active" ] && marker="* "
        local status_tag="[unverified]"
        is_verified "$rel" && status_tag="[verified]"
        echo "  $marker $rel $status_tag"
        found=1
    done
    [ "$found" -eq 0 ] && echo "  (No releases found)"
    echo "=================================================="
}

# Roll back to the release that was active before the current one (activation log, not name order).
do_rollback() {
    local current prev
    current="$(active_release_id || true)"
    if [ -z "$current" ]; then
        log_error "Cannot rollback: $CURRENT_SYMLINK is not an active release symlink."
        exit 1
    fi
    prev="$(previous_activated_id "$current" || true)"
    if [ -z "$prev" ]; then
        log_error "Cannot rollback: no previously activated verified release found in $ACTIVATIONS_LOG."
        exit 1
    fi
    atomic_activate "$RELEASES_DIR/$prev" "rollback-from-$current"
    log_success "Rollback completed: $current -> $prev"
}

# 3. Handle Arguments
BUILD_ONLY=0
case "${1:-}" in
    status)
        show_status
        exit 0
        ;;
    rollback)
        acquire_lock
        do_rollback
        exit 0
        ;;
    activate)
        if [ -z "${2:-}" ] || [[ ! "${2}" =~ ^[A-Za-z0-9_.-]+$ ]]; then
            log_error "Usage: $0 activate <RELEASE_ID>"
            exit 1
        fi
        acquire_lock
        atomic_activate "$RELEASES_DIR/$2" "manual-activate"
        exit 0
        ;;
    --build-only|build)
        BUILD_ONLY=1
        ;;
    "")
        ;;
    *)
        log_error "Unknown argument: $1"
        exit 1
        ;;
esac

acquire_lock

# ==============================================================================
# 4. Release Build & Validation Pipeline
# ==============================================================================

# Unique release ID: UTC timestamp with nanoseconds + PID + git sha (e.g. 20261012T130000.123456789Z_4242_a1b2c3d)
GIT_SHA="$(git -C "$FRONTEND_DIR" rev-parse --short HEAD 2>/dev/null || echo 'manual')"
RELEASE_ID="$(date -u +'%Y%m%dT%H%M%S.%NZ')_$$_${GIT_SHA}"
RELEASE_DIR="$RELEASES_DIR/$RELEASE_ID"

log_info "=================================================="
log_info "Starting Solatide Storefront Release Pipeline"
log_info "Release ID   : $RELEASE_ID"
log_info "Release Path : $RELEASE_DIR"
log_info "=================================================="

# No -p: fail loudly if the directory already exists (never build into an existing release).
mkdir "$RELEASE_DIR"

handle_failure() {
    local step_name="$1"
    log_error "❌ Release pipeline failed during: $step_name"
    log_warn "Failed release kept for inspection (never auto-deleted): $RELEASE_DIR"
    log_warn "Active symlink remains untouched."
    exit 1
}

cd "$FRONTEND_DIR"

# Step A: Vite Production Build into RELEASE_DIR (VITE_APP_ROLE=store excludes the admin app)
log_info "Step 1/4: Building Vite application into $RELEASE_DIR..."
npx cross-env VITE_APP_ROLE=store NODE_ENV=production npx vite build --outDir "$RELEASE_DIR" --emptyOutDir || handle_failure "Vite Build"
log_success "Vite build completed."

if [ -f "$FRONTEND_DIR/public/robots.txt" ] && [ ! -f "$RELEASE_DIR/robots.txt" ]; then
    cp "$FRONTEND_DIR/public/robots.txt" "$RELEASE_DIR/robots.txt"
fi

# Step B: Prerender (deploy mode: any failed route exits non-zero)
log_info "Step 2/4: Prerendering into $RELEASE_DIR..."
npx cross-env NODE_ENV=production DIST_STORE_DIR="$RELEASE_DIR" node prerender.js || handle_failure "Prerender"
log_success "Prerender completed."

# Step C: SEO Deployment Validation Suite
log_info "Step 3/4: Running SEO Deployment Validation Suite on $RELEASE_DIR..."
DIST_STORE_DIR="$RELEASE_DIR" node scripts/validate-seo-deployment.js || handle_failure "SEO Validation Suite"
log_success "SEO validation passed."

# Step D: Smoke-test required files
log_info "Step 4/4: Smoke-testing required release files in $RELEASE_DIR..."
REQUIRED_FILES=("index.html" "home.html" "404.html" "checkout.html" "200.html" "sitemap.xml" "robots.txt" "favicon.png")
REQUIRED_DIRS=("assets" "products" "pages" "collections")
for f in "${REQUIRED_FILES[@]}"; do
    [ -s "$RELEASE_DIR/$f" ] || handle_failure "Smoke-Test (missing or empty: $f)"
done
for d in "${REQUIRED_DIRS[@]}"; do
    [ -d "$RELEASE_DIR/$d" ] || handle_failure "Smoke-Test (missing directory: $d)"
done
for p in "pages/about.html" "collections/all.html"; do
    [ -s "$RELEASE_DIR/$p" ] || handle_failure "Smoke-Test (key page: $p)"
done
# The admin app is served by the hub host only (M-19)
if [ -e "$RELEASE_DIR/admin.html" ] || [ -e "$RELEASE_DIR/admin" ]; then
    handle_failure "Smoke-Test (admin shell present in store build)"
fi
# No dotfiles in the web root (nginx denies them anyway)
if [ -n "$(find "$RELEASE_DIR" -mindepth 1 -name '.*' -not -name '.well-known' -print -quit)" ]; then
    handle_failure "Smoke-Test (dotfile found in web root)"
fi
log_success "All smoke-test checks passed!"

# Verification marker lives OUTSIDE the web root so it is never publicly served (L-7).
{
    echo "verified_at=$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
    echo "release_id=$RELEASE_ID"
    echo "git_sha=$GIT_SHA"
} > "$META_DIR/$RELEASE_ID.success"
log_success "Release $RELEASE_ID is fully built and verified."

# ==============================================================================
# 5. Activation or Build-Only Return
# ==============================================================================
if [ "$BUILD_ONLY" -eq 1 ]; then
    log_info "Mode is --build-only. Skipping activation. To activate: $0 activate $RELEASE_ID"
    exit 0
fi

atomic_activate "$RELEASE_DIR" "deploy"
log_success "🚀 DEPLOYMENT COMPLETED SUCCESSFULLY ($RELEASE_ID)"
