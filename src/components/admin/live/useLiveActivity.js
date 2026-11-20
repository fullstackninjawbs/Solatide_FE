// Live customer activity data for the admin dashboard.
// - Snapshot (GET live/visitors): recent visitor cards + every open visit's activity times.
// - Stream (GET live/stream, Server-Sent Events read with fetch so the Bearer token is sent): each
//   recorded action and heartbeat arrives as an "update" with the session's fresh card.
// - Reconnects by itself (backoff) and re-reads the snapshot after reconnecting and once a minute,
//   so nothing missed while disconnected stays wrong.
// - One card per visitor (their latest visit). "online now" still counts visits.
// - Statuses (active / inactive / ended) are worked out from timestamps with the server's
//   definitions and the server clock offset, re-checked every few seconds.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiService } from '../../../services/api';
import { liveStatus } from './liveFormat';

const SNAPSHOT_EVERY_MS = 60_000;
const TICK_MS = 5_000;
const MAX_CARDS_KEPT = 40;

function parseSseBlock(block) {
  let event = 'message';
  const data = [];
  for (const line of block.split('\n')) {
    if (!line || line.startsWith(':')) continue;
    const i = line.indexOf(':');
    const field = i === -1 ? line : line.slice(0, i);
    const value = i === -1 ? '' : line.slice(i + 1).replace(/^ /, '');
    if (field === 'event') event = value;
    if (field === 'data') data.push(value);
  }
  if (!data.length) return null;
  try { return { event, data: JSON.parse(data.join('\n')) }; } catch { return null; }
}

export default function useLiveActivity({ cardLimit = 6 } = {}) {
  const [cards, setCards] = useState(() => new Map());
  const [presence, setPresence] = useState(() => new Map());
  const [definitions, setDefinitions] = useState(null);
  const [connection, setConnection] = useState('connecting'); // connecting | live | reconnecting
  const [loaded, setLoaded] = useState(false);
  const [offset, setOffset] = useState(0); // server clock - browser clock
  const [tick, setTick] = useState(() => Date.now());
  const [visitCounts, setVisitCounts] = useState(() => new Map()); // visitorId → visits in the card window (snapshot)
  const [windowHours, setWindowHours] = useState(24);
  const listeners = useRef(new Set());

  const applySession = useCallback((card) => {
    if (!card?.sessionId) return;
    setCards((prev) => {
      const next = new Map(prev);
      next.set(card.sessionId, card);
      if (next.size > MAX_CARDS_KEPT) {
        const oldest = [...next.values()].sort((a, b) => new Date(a.lastActivityAt) - new Date(b.lastActivityAt))[0];
        next.delete(oldest.sessionId);
      }
      return next;
    });
    setPresence((prev) => new Map(prev).set(card.sessionId, { lastActivityAt: card.lastActivityAt, leftAt: card.leftAt }));
  }, []);

  const loadSnapshot = useCallback(async () => {
    try {
      const res = await apiService.getLiveVisitors(cardLimit);
      const json = await res.json();
      if (!json.success) return;
      const d = json.data;
      setOffset(new Date(d.serverTime).getTime() - Date.now());
      setDefinitions(d.definitions);
      setCards((prev) => {
        // Keep cards that arrived on the stream meanwhile if they are newer
        const next = new Map();
        for (const c of d.visitors) next.set(c.sessionId, c);
        for (const [id, c] of prev) {
          const snap = next.get(id);
          if (!snap || new Date(c.lastActivityAt) > new Date(snap.lastActivityAt)) next.set(id, c);
        }
        return next;
      });
      setPresence(new Map(d.presence.map((p) => [p.sessionId, p])));
      setVisitCounts(new Map(d.visitors.filter((c) => c.visitorId).map((c) => [c.visitorId, c.recentVisitCount || 1])));
      if (d.recentWindowHours) setWindowHours(d.recentWindowHours);
      setLoaded(true);
    } catch { /* keep what we have; the next snapshot retries */ }
  }, [cardLimit]);

  // Stream with reconnect
  useEffect(() => {
    let stopped = false;
    let controller = null;
    let attempt = 0;
    const run = async () => {
      while (!stopped) {
        controller = new AbortController();
        try {
          const res = await apiService.openLiveStream(controller.signal);
          if (!res.ok || !res.body) throw new Error(`stream ${res.status}`);
          attempt = 0;
          setConnection('live');
          loadSnapshot();
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          while (!stopped) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');
            let cut;
            while ((cut = buffer.indexOf('\n\n')) !== -1) {
              const msg = parseSseBlock(buffer.slice(0, cut));
              buffer = buffer.slice(cut + 2);
              if (!msg) continue;
              if (msg.event === 'hello') {
                setOffset(new Date(msg.data.serverTime).getTime() - Date.now());
                if (msg.data.definitions) setDefinitions(msg.data.definitions);
              } else if (msg.event === 'update') {
                if (msg.data.session) applySession(msg.data.session);
                for (const item of msg.data.activity || []) listeners.current.forEach((fn) => fn(item));
              }
            }
          }
        } catch { /* fall through to reconnect */ }
        if (stopped) return;
        setConnection('reconnecting');
        attempt += 1;
        const wait = Math.min(30_000, 1000 * 2 ** Math.min(attempt, 5));
        await new Promise((r) => setTimeout(r, wait));
      }
    };
    run();
    return () => { stopped = true; controller?.abort(); };
  }, [applySession, loadSnapshot]);

  // Safety-net snapshot + clock tick
  useEffect(() => {
    const first = setTimeout(loadSnapshot, 0);
    const snap = setInterval(loadSnapshot, SNAPSHOT_EVERY_MS);
    const t = setInterval(() => setTick(Date.now()), TICK_MS);
    return () => { clearTimeout(first); clearInterval(snap); clearInterval(t); };
  }, [loadSnapshot]);

  const now = tick + offset;

  const visibleCards = useMemo(() => {
    const sorted = [...cards.values()].sort((a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt));
    // Visits seen per visitor (snapshot count, or more if new visits arrived on the stream)
    const seen = new Map();
    for (const c of sorted) {
      const key = c.visitorId || c.sessionId;
      seen.set(key, (seen.get(key) || 0) + 1);
    }
    const shown = new Set();
    const out = [];
    for (const c of sorted) {
      const key = c.visitorId || c.sessionId;
      if (shown.has(key)) continue;
      shown.add(key);
      out.push({
        ...c,
        recentVisitCount: Math.max(visitCounts.get(c.visitorId) || 1, seen.get(key) || 1),
        status: liveStatus(presence.get(c.sessionId) || c, now, definitions),
      });
      if (out.length >= cardLimit) break;
    }
    return out;
  }, [cards, presence, cardLimit, now, definitions, visitCounts]);

  const onlineNow = useMemo(() => {
    let n = 0;
    for (const p of presence.values()) if (liveStatus(p, now, definitions) === 'active') n += 1;
    return n;
  }, [presence, now, definitions]);

  const statusOf = useCallback(
    (sessionId) => liveStatus(presence.get(sessionId) || cards.get(sessionId), now, definitions),
    [presence, cards, now, definitions]
  );

  const cardOf = useCallback((sessionId) => cards.get(sessionId) || null, [cards]);

  /** Subscribe to each newly recorded action; returns the unsubscribe function. */
  const subscribeActivity = useCallback((fn) => {
    listeners.current.add(fn);
    return () => listeners.current.delete(fn);
  }, []);

  return { cards: visibleCards, windowHours, onlineNow, connection, loaded, now, definitions, statusOf, cardOf, subscribeActivity };
}
