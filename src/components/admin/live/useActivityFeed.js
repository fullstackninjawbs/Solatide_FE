// "All activity" feed: first page from the server (same filters/search), older pages on demand, new
// actions from the live stream added on top when they match. Paused = new actions wait in a buffer
// ("12 new") until resumed, so the list doesn't move while being read.
import { useCallback, useEffect, useRef, useState } from 'react';
import { apiService } from '../../../services/api';
import { FEED_FILTERS } from './liveFormat';

const PAGE = 30;
const MAX_ITEMS = 600;

function matches(item, { types, q, sessionId }) {
  if (sessionId && item.sessionId !== sessionId) return false;
  if (types.length && !types.includes(item.type)) return false;
  if (!q) return true;
  const needle = q.toLowerCase().replace(/^#/, '');
  const v = item.visitor || {};
  return [item.productName, item.path, v.name, v.anonymousId, v.location?.city, v.location?.country, v.visitorId?.slice(0, 6)]
    .some((f) => typeof f === 'string' && f.toLowerCase().includes(needle));
}

export default function useActivityFeed({ enabled, subscribeActivity, sessionId = '' }) {
  const [filterKeys, setFilterKeys] = useState([]); // empty = all
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [paused, setPaused] = useState(false);
  const [buffered, setBuffered] = useState([]);
  const cursor = useRef(null);
  const requestId = useRef(0);

  const types = FEED_FILTERS.filter((f) => filterKeys.includes(f.key)).flatMap((f) => f.types);
  const typesKey = types.join(',');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // First page whenever opened or filters/search change
  useEffect(() => {
    if (!enabled) return undefined;
    const id = ++requestId.current;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await apiService.getLiveActivity({ limit: PAGE, types: typesKey, q: debounced, sessionId });
        const json = await res.json();
        if (cancelled || id !== requestId.current || !json.success) return;
        setItems(json.data.items);
        setHasMore(json.data.hasMore);
        cursor.current = json.data.nextCursor;
        setBuffered([]);
      } catch { /* keep the list */ } finally {
        if (!cancelled && id === requestId.current) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [enabled, typesKey, debounced, sessionId]);

  // Live additions
  const filtersRef = useRef({ types: [], q: '', sessionId });
  const pausedRef = useRef(false);
  useEffect(() => {
    filtersRef.current = { types: typesKey ? typesKey.split(',') : [], q: debounced, sessionId };
  }, [typesKey, debounced, sessionId]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => {
    if (!enabled) return undefined;
    return subscribeActivity((item) => {
      if (!matches(item, filtersRef.current)) return;
      const add = (list) => (list.some((x) => x.id === item.id) ? list : [item, ...list].slice(0, MAX_ITEMS));
      if (pausedRef.current) setBuffered(add);
      else setItems(add);
    });
  }, [enabled, subscribeActivity]);

  const loadOlder = useCallback(async () => {
    if (!cursor.current || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const res = await apiService.getLiveActivity({ limit: PAGE, types: typesKey, q: debounced, sessionId, before: cursor.current });
      const json = await res.json();
      if (json.success) {
        setItems((prev) => {
          const seen = new Set(prev.map((x) => x.id));
          return [...prev, ...json.data.items.filter((x) => !seen.has(x.id))];
        });
        setHasMore(json.data.hasMore);
        cursor.current = json.data.nextCursor;
      }
    } catch { /* retry by clicking again */ } finally {
      setLoadingOlder(false);
    }
  }, [typesKey, debounced, sessionId, loadingOlder]);

  const togglePaused = useCallback(() => {
    if (paused && buffered.length) {
      // Resume: show what arrived meanwhile
      setItems((prev) => {
        const seen = new Set(prev.map((x) => x.id));
        return [...buffered.filter((x) => !seen.has(x.id)), ...prev].slice(0, MAX_ITEMS);
      });
      setBuffered([]);
    }
    pausedRef.current = !paused;
    setPaused(!paused);
  }, [paused, buffered]);

  const toggleFilter = useCallback((key) => {
    setFilterKeys((keys) => (keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key]));
  }, []);

  return {
    items, loading, loadingOlder, hasMore, loadOlder,
    paused, togglePaused, bufferedCount: buffered.length,
    filterKeys, toggleFilter, clearFilters: () => setFilterKeys([]),
    query, setQuery,
  };
}
