export const fmtDuration = s => { if (!s && s !== 0) return ''; const m = Math.floor(s / 60); const r = s % 60; return `${m}:${String(r).padStart(2, '0')}`; };
export const fmtViews = n => { if (n == null) return ''; if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M`; if (n >= 1e3) return `${(n / 1e3).toFixed(n >= 1e5 ? 0 : 1)}K`; return String(n); };
export const fmtClock = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
export const sumSeconds = steps => steps.reduce((a, s) => a + (Array.isArray(s) ? s[1] : s.seconds), 0);
export const fmtMinutes = s => { const m = Math.round(s / 60); return m < 1 ? '1' : String(m); };
export const normalizeSteps = steps => steps.map(s => Array.isArray(s) ? { name: s[0], seconds: s[1], side: s[2] } : s);
export const readJSON = (key, fallback) => { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } };
export const writeJSON = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
