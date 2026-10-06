#!/usr/bin/env bash
# ==============================================================================
# Solatide Biosciences - Atomic Storefront Deployment & Release Script
# ==============================================================================
# Architecture:
#   <FRONTEND_DIR>/releases/<RELEASE_ID>/
#   <FRONTEND_DIR>/dist-store-current -> releases/<ACTIVE_RELEASE>
#
# Usage:
#   ./scripts/deploy-store.sh               # Build, validate, and atomically activate new release
#   ./scripts/deploy-store.sh --build-only  # Build and validate WITHOUT activating
#   ./scripts/deploy-store.sh rollback      # Rollback to the previous successful release
#   ./scripts/deploy-store.sh status        # Show active release and available releases
#   ./scripts/deploy-store.sh activate <ID> # Atomically activate an existing release ID
# ==============================================================================

set -euo pipefail

# 1. Path Resolution
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="${FRONTEND_DIR:-$(cd "$SCRIPT_DIR/.." && pwd)}"
RELEASES_DIR="$FRONTEND_DIR/releases"
CURRENT_SYMLINK="$FRONTEND_DIR/dist-store-current"

# 2. Helper Functions
log_info() { echo -e "\033[1;34m[INFO]\033[0m $*"; }
log_success() { echo -e "\033[1;32m[SUCCESS]\033[0m $*"; }
log_warn() { echo -e "\033[1;33m[WARN]\033[0m $*"; }
log_error() { echo -e "\033[1;31m[ERROR]\033[0m $*" >&2; }

# Atomically switch the symlink to a release directory
atomic_activate() {
    local target_dir="$1"
    local release_name="$(basename "$target_dir")"

    if [ ! -d "$target_dir" ]; then
        log_error "Target release directory does not exist: $target_dir"
        exit 1
    fi

    log_info "Preparing atomic symlink activation for: $release_name"
    log_info "Source: $target_dir"
    log_info "Target: $CURRENT_SYMLINK"

    # Use absolute paths for the atomic symlink switch
    local tmp_symlink="$FRONTEND_DIR/dist-store-current.new"
    rm -f "$tmp_symlink"
    ln -s "$target_dir" "$tmp_symlink"
    mv -Tf "$tmp_symlink" "$CURRENT_SYMLINK"

    log_success "Atomic activation complete!"
    log_success "Active release is now: $release_name"
    log_success "Symlink points to: $(readlink -f "$CURRENT_SYMLINK")"
}

# Show status of current release and past releases
show_status() {
    echo "=================================================="
    echo "Solatide Storefront Release Status"
    echo "=================================================="
    if [ -L "$CURRENT_SYMLINK" ]; then
        local active_path
        active_path="$(readlink -f "$CURRENT_SYMLINK")"
        echo "Active Symlink : $CURRENT_SYMLINK"
        echo "Active Release : $(basename "$active_path")"
        echo "Active Target  : $active_path"
    elif [ -e "$CURRENT_SYMLINK" ]; then
        echo "Active Target  : $CURRENT_SYMLINK (Warning: not a symlink)"
    else
        echo "Active Target  : None (dist-store-current does not exist yet)"
        if [ -d "$FRONTEND_DIR/dist-store" ]; then
            echo "Legacy Target  : $FRONTEND_DIR/dist-store (Currently served by Nginx)"
        fi
    fi

    echo ""
    echo "Available Releases in $RELEASES_DIR:"
    if [ -d "$RELEASES_DIR" ]; then
        local found=0
        for rel in $(ls -1 "$RELEASES_DIR" | sort); do
            local marker="  "
            if [ -L "$CURRENT_SYMLINK" ] && [ "$(readlink -f "$CURRENT_SYMLINK")" = "$RELEASES_DIR/$rel" ]; then
                marker="* "
            fi
            echo "  $marker $rel"
            found=1
        done
        if [ "$found" -eq 0 ]; then
            echo "  (No releases found)"
        fi
    else
        echo "  (Releases directory does not exist yet)"
    fi
    echo "=================================================="
}

# Rollback to the release immediately prior to the current active release
do_rollback() {
    log_info "Initiating rollback procedure..."

    if [ ! -L "$CURRENT_SYMLINK" ]; then
        log_error "Cannot rollback: $CURRENT_SYMLINK is not an active release symlink."
        exit 1
    fi

    local current_active
    current_active="$(readlink -f "$CURRENT_SYMLINK")"
    local current_name
    current_name="$(basename "$current_active")"

    log_info "Currently active release: $current_name"

    if [ ! -d "$RELEASES_DIR" ]; then
        log_error "Releases directory does not exist: $RELEASES_DIR"
        exit 1
    fi

    # Collect sorted release list
    mapfile -t all_releases < <(ls -1 "$RELEASES_DIR" | sort)
    local count="${#all_releases[@]}"

    if [ "$count" -lt 2 ]; then
        log_error "Cannot rollback: only $count release(s) found in $RELEASES_DIR. Need at least 2."
        exit 1
    fi

    # Find the index of the current active release
    local current_idx=-1
    for i in "${!all_releases[@]}"; do
        if [ "${all_releases[$i]}" = "$current_name" ]; then
            current_idx="$i"
            break
        fi
    done

    if [ "$current_idx" -le 0 ]; then
        log_error "Cannot rollback: active release '$current_name' is the earliest known release or was not found in $RELEASES_DIR."
        exit 1
    fi

    local prev_release_name="${all_releases[$((current_idx - 1))]}"
    local prev_release_dir="$RELEASES_DIR/$prev_release_name"

    log_info "Found previous known-good release: $prev_release_name"
    atomic_activate "$prev_release_dir"
    log_success "Rollback successfully completed from '$current_name' to '$prev_release_name'!"
}

# 3. Handle Arguments (rollback, status, activate, build-only)
BUILD_ONLY=0

if [ "${1:-}" = "status" ]; then
    show_status
    exit 0
elif [ "${1:-}" = "rollback" ]; then
    do_rollback
    exit 0
elif [ "${1:-}" = "activate" ]; then
    if [ -z "${2:-}" ]; then
        log_error "Usage: $0 activate <RELEASE_ID>"
        exit 1
    fi
    atomic_activate "$RELEASES_DIR/$2"
    exit 0
elif [ "${1:-}" = "--build-only" ] || [ "${1:-}" = "build" ]; then
    BUILD_ONLY=1
fi

# ==============================================================================
# 4. Release Build & Validation Pipeline
# ==============================================================================

# Ensure releases directory exists
mkdir -p "$RELEASES_DIR"

# Generate a unique timestamped release ID (e.g. 20261006_130000_a1b2c3d)
TIMESTAMP="$(date +'%Y%m%d_%H%M%S')"
GIT_SHA="$(git rev-parse --short HEAD 2>/dev/null || echo 'manual')"
RELEASE_ID="${TIMESTAMP}_${GIT_SHA}"
RELEASE_DIR="$RELEASES_DIR/$RELEASE_ID"

log_info "=================================================="
log_info "Starting Solatide Storefront Release Pipeline"
log_info "Release ID   : $RELEASE_ID"
log_info "Release Path : $RELEASE_DIR"
log_info "=================================================="

# Create clean release directory
mkdir -p "$RELEASE_DIR"

# Helper for handling build/validation failure
handle_failure() {
    local step_name="$1"
    log_error "❌ Release pipeline failed during: $step_name"
    log_warn "Preserving failed release directory for inspection at: $RELEASE_DIR"
    log_warn "Active symlink and legacy dist-store remain 100% untouched."
    exit 1
}

# Step A: Vite Production Build into RELEASE_DIR
log_info "Step 1/4: Building Vite application into $RELEASE_DIR..."
cd "$FRONTEND_DIR"
npx cross-env VITE_APP_ROLE=store NODE_ENV=production npx vite build --outDir "$RELEASE_DIR" || handle_failure "Vite Build"
log_success "Vite build completed."

# Copy public assets (e.g. robots.txt, favicon.png, assets/) if Vite didn't already
if [ -f "$FRONTEND_DIR/public/robots.txt" ] && [ ! -f "$RELEASE_DIR/robots.txt" ]; then
    cp "$FRONTEND_DIR/public/robots.txt" "$RELEASE_DIR/robots.txt"
fi

# Step B: Prerender Static Pages into RELEASE_DIR
log_info "Step 2/4: Running prerendering against $RELEASE_DIR..."
npx cross-env NODE_ENV=production DIST_STORE_DIR="$RELEASE_DIR" node prerender.js || handle_failure "Prerender"
log_success "Prerender completed."

# Step C: Run SEO Deployment Validation Suite on RELEASE_DIR
log_info "Step 3/4: Running SEO Deployment Validation Suite on $RELEASE_DIR..."
DIST_STORE_DIR="$RELEASE_DIR" node scripts/validate-seo-deployment.js || handle_failure "SEO Validation Suite"
log_success "SEO validation passed 100%."

# Step D: Smoke-Test Required Files & Directories in RELEASE_DIR
log_info "Step 4/4: Smoke-testing required release files in $RELEASE_DIR..."

REQUIRED_FILES=(
    "index.html"
    "home.html"
    "404.html"
    "checkout.html"
    "admin.html"
    "admin/login.html"
    "sitemap.xml"
    "robots.txt"
    "favicon.png"
    "200.html"
)

REQUIRED_DIRS=(
    "assets"
    "products"
    "pages"
    "collections"
)

# Check required files
for f in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$RELEASE_DIR/$f" ]; then
        log_error "Required file missing: $RELEASE_DIR/$f"
        handle_failure "Smoke-Test (Missing File: $f)"
    fi
    if [ ! -s "$RELEASE_DIR/$f" ]; then
        log_error "Required file is unexpectedly empty: $RELEASE_DIR/$f"
        handle_failure "Smoke-Test (Empty File: $f)"
    fi
done

# Check required directories
for d in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$RELEASE_DIR/$d" ]; then
        log_error "Required directory missing: $RELEASE_DIR/$d"
        handle_failure "Smoke-Test (Missing Directory: $d)"
    fi
done

# Verify key product and CMS pages exist and are non-empty
KEY_PAGES=(
    "products/retatrutide-10mg.html"
    "products/cagrilintide-5mg.html"
    "pages/about.html"
    "pages/what-is-cjc-1295.html"
    "collections/all.html"
)

for p in "${KEY_PAGES[@]}"; do
    if [ ! -s "$RELEASE_DIR/$p" ]; then
        log_error "Key prerendered page missing or empty: $RELEASE_DIR/$p"
        handle_failure "Smoke-Test (Key Page: $p)"
    fi
done

log_success "All smoke-test file integrity checks passed!"
log_info "=================================================="
log_success "🎉 Release $RELEASE_ID is fully built and verified!"
log_info "=================================================="

# ==============================================================================
# 5. Activation or Build-Only Return
# ==============================================================================

if [ "$BUILD_ONLY" -eq 1 ]; then
    log_info "Mode is --build-only. Skipping activation."
    log_info "To activate this release manually, run:"
    log_info "  $0 activate $RELEASE_ID"
    exit 0
fi

# Perform atomic symlink activation
atomic_activate "$RELEASE_DIR"
log_success "🚀 DEPLOYMENT COMPLETED SUCCESSFULLY!"
log_info "Nginx serving dist-store-current will immediately serve release: $RELEASE_ID"
