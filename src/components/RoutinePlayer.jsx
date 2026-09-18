import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, RotateCcw, X } from 'lucide-react';
import { fmtClock, normalizeSteps, sumSeconds } from '../utils.js';

/** Sequenced follow-along timer: one step at a time, auto-advance, completion log. */
export default function RoutinePlayer({ title, subtitle, steps: rawSteps, video, onClose, onComplete }) {
  const steps = useMemo(() => normalizeSteps(rawSteps), [rawSteps]);
  const total = useMemo(() => sumSeconds(steps), [steps]);
  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(steps[0]?.seconds || 30);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!running || finished) return undefined;
    const t = setInterval(() => setLeft(v => v - 1), 1000);
    return () => clearInterval(t);
  }, [running, finished]);

  useEffect(() => {
    if (left > 0 || !running) return;
    if (idx < steps.length - 1) { setIdx(idx + 1); setLeft(steps[idx + 1].seconds); }
    else { setRunning(false); setFinished(true); onComplete?.(total); }
  }, [left, running, idx, steps, total, onComplete]);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); if (e.key === ' ') { e.preventDefault(); setRunning(r => !r); } };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const go = n => { const next = Math.min(Math.max(n, 0), steps.length - 1); setIdx(next); setLeft(steps[next].seconds); setFinished(false); };
  const restart = () => { setIdx(0); setLeft(steps[0].seconds); setFinished(false); setRunning(true); };
  const step = steps[idx];
  const pct = step ? Math.round(((step.seconds - left) / step.seconds) * 100) : 0;
  const elapsed = steps.slice(0, idx).reduce((a, s) => a + s.seconds, 0) + (step ? step.seconds - left : 0);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="跟练计时" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="player">
        <button className="close" aria-label="关闭" onClick={onClose}><X size={18} /></button>
        <div className="player-eyebrow"><span className="dot" style={{ background: 'var(--volt)' }} /> FOLLOW ALONG · {steps.length} STEPS · {fmtClock(total)}</div>
        <h2>{title}</h2>
        {subtitle && <p className="sub">{subtitle}</p>}
        <div className="player-progress" aria-hidden="true">
          {steps.map((s, i) => <i key={i} className={i < idx || finished ? 'done' : ''}><b style={i === idx && !finished ? { width: `${pct}%` } : undefined} /></i>)}
        </div>
        {finished ? (
          <div className="player-done">
            <div className="big">DONE</div>
            <p>完成 {steps.length} 个步骤，共 {fmtClock(total)}。已记录到今日练习。</p>
            <button className="player-main" onClick={restart}><RotateCcw size={16} /> 再来一组</button>
          </div>
        ) : (
          <>
            <div className="player-now">
              <div className="step-label">STEP {String(idx + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</div>
              <div className="step-name">{step.name}</div>
              {step.side && <div className="step-side">{step.side}</div>}
            </div>
            <div className="ring" style={{ '--p': `${pct}%` }}>
              <div><strong>{left}<small>秒</small></strong></div>
            </div>
            <div className="player-controls">
              <button className="round" aria-label="上一步" disabled={idx === 0} onClick={() => go(idx - 1)}><ChevronLeft size={18} /></button>
              <button className={`player-main ${running ? 'paused' : ''}`} onClick={() => setRunning(r => !r)}>
                {running ? <><Pause size={16} /> 暂停</> : <><Play size={16} fill="currentColor" /> {elapsed > 0 ? '继续' : '开始'}</>}
              </button>
              <button className="round" aria-label="下一步" disabled={idx === steps.length - 1} onClick={() => go(idx + 1)}><ChevronRight size={18} /></button>
            </div>
          </>
        )}
        <ol className="player-steps">
          {steps.map((s, i) => (
            <li key={i} className={i === idx && !finished ? 'active' : i < idx || finished ? 'done' : ''} onClick={() => go(i)} style={{ cursor: 'pointer' }}>
              <i>{String(i + 1).padStart(2, '0')}</i><span>{s.name}{s.side ? ` · ${s.side}` : ''}</span><span>{s.seconds}s</span>
            </li>
          ))}
        </ol>
        {video && <p style={{ textAlign: 'center', margin: '16px 0 0' }}><a className="btn btn-outline on-dark btn-sm" href={video.url} target="_blank" rel="noreferrer">打开示范视频 <ArrowUpRight size={14} /></a></p>}
        <small className="note">空格键开始/暂停，Esc 关闭。拉伸保持轻柔，出现刺痛、麻木或疼痛加重时请停止。</small>
      </div>
    </div>
  );
}
