// Visitor panel data (GET live/visitors/:sessionId/profile): the visit, the visitor, their other
// visits (paged, "Load more" appends) and their orders. Re-read quietly when the live card shows
// something the profile summarises has changed (checkout stage, an order, a name, the cart).
import { useCallback, useEffect, useRef, useState } from 'react';
import { apiService } from '../../../../services/api';

export default function useVisitorProfile(sessionId, liveCard) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const requestId = useRef(0);
  const pageRef = useRef(1);

  const load = useCallback(async (id, { quiet = false } = {}) => {
    const req = ++requestId.current;
    try {
      const res = await apiService.getVisitorProfile(id, 1);
      const json = await res.json();
      if (req !== requestId.current) return;
      if (!json.success) {
        if (!quiet) setError(json.message || 'Could not load this visit');
        return;
      }
      setError('');
      setProfile((prev) => {
        // A quiet refresh keeps visits already loaded with "Load more"
        if (quiet && prev?.session?.sessionId === id && pageRef.current > 1) return { ...json.data, otherVisits: prev.otherVisits };
        pageRef.current = 1;
        return json.data;
      });
    } catch {
      if (!quiet && req === requestId.current) setError('Could not load this visit');
    }
  }, []);

  // New visit opened: load from scratch
  useEffect(() => {
    if (!sessionId) return undefined;
    pageRef.current = 1;
    const t = setTimeout(() => load(sessionId), 0);
    return () => clearTimeout(t);
  }, [sessionId, load]);

  // Live changes worth re-reading for
  const liveKey = liveCard
    ? [liveCard.checkoutStage || '', liveCard.orderCount || 0, liveCard.name || '', liveCard.cart?.itemCount || 0].join('|')
    : '';
  const firstKey = useRef('');
  useEffect(() => {
    if (!sessionId || !liveKey) return undefined;
    if (!firstKey.current || firstKey.current.split('§')[0] !== sessionId) {
      firstKey.current = `${sessionId}§${liveKey}`;
      return undefined;
    }
    if (firstKey.current === `${sessionId}§${liveKey}`) return undefined;
    firstKey.current = `${sessionId}§${liveKey}`;
    const t = setTimeout(() => load(sessionId, { quiet: true }), 800);
    return () => clearTimeout(t);
  }, [sessionId, liveKey, load]);

  const loadMoreVisits = useCallback(async () => {
    if (!profile?.otherVisits?.hasMore || loadingMore) return;
    const id = profile.session.sessionId;
    const next = pageRef.current + 1;
    setLoadingMore(true);
    try {
      const res = await apiService.getVisitorProfile(id, next);
      const json = await res.json();
      if (!json.success) return;
      pageRef.current = next;
      setProfile((prev) => {
        if (!prev || prev.session.sessionId !== id) return prev;
        const seen = new Set(prev.otherVisits.items.map((v) => v.sessionId));
        return {
          ...prev,
          otherVisits: {
            ...json.data.otherVisits,
            items: [...prev.otherVisits.items, ...json.data.otherVisits.items.filter((v) => !seen.has(v.sessionId))],
          },
        };
      });
    } catch { /* click again */ } finally {
      setLoadingMore(false);
    }
  }, [profile, loadingMore]);

  const current = profile?.session?.sessionId === sessionId ? profile : null;
  return { profile: current, error: current ? '' : error, loadingMore, loadMoreVisits };
}
