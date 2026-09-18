import React, { useMemo, useState } from 'react';
import { Activity, Ban, BookOpen, Bookmark, Check, Dumbbell, ExternalLink, Flame, Play, Search, ShieldAlert, ShieldCheck, Sparkles, Stethoscope, TriangleAlert, Wind } from 'lucide-react';
import VideoCard from './VideoCard.jsx';
import { generalDose, generalRedFlags } from '../content/guide.js';
import { sources } from '../content/sources.js';
import { kinds, layerMuscles, platformSearch, publisherLabel, publisherName, verifiedOn } from '../data.js';
import { fmtMinutes, sumSeconds } from '../utils.js';

const zhPart = t => (t.match(/[\u4e00-\u9fff][^（]*/) || [t])[0].trim();
const TABS = [['overview', '概览'], ['moves', '动作方案'], ['videos', '视频'], ['evidence', '依据与就医']];

export default function DetailPanel({ region, guide, layer, videos, saved, toggleSave, onGuide, onStartRoutine, completions, tab, setTab }) {
  const shownMuscles = layer === 'nerves' ? [region.nerves] : (layerMuscles[region.id]?.[layer] || region.muscles);
  const routineSeconds = sumSeconds(guide.daily.steps);
  const counts = { overview: null, moves: guide.moves.length, videos: videos.length, evidence: guide.refs.length };
  return (
    <aside className="panel detail-panel" id="region-detail">
      <div className="detail-head">
        <div>
          <div className="detail-idx"><i>SELECTED</i> {region.en}</div>
          <h2>{region.name} <span>{region.short.toUpperCase()}</span></h2>
          <p className="detail-latin">{region.latin}</p>
          <p className="detail-headline">{guide.headline}</p>
        </div>
        <button className={`btn btn-sm ${saved.has(`region-${region.id}`) ? 'btn-ink' : 'btn-outline'}`} onClick={() => toggleSave(`region-${region.id}`)}>
          {saved.has(`region-${region.id}`) ? <Check size={14} /> : <Bookmark size={14} />}{saved.has(`region-${region.id}`) ? '已收藏' : '收藏部位'}
        </button>
      </div>
      <div className="detail-tabs" role="tablist">
        {TABS.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'selected' : ''} onClick={() => setTab(id)}>
            {label}{counts[id] != null && <small>{String(counts[id]).padStart(2, '0')}</small>}
          </button>
        ))}
      </div>
      {tab === 'overview' && <OverviewTab region={region} guide={guide} layer={layer} shownMuscles={shownMuscles} />}
      {tab === 'moves' && <MovesTab region={region} guide={guide} routineSeconds={routineSeconds} completions={completions} onStartRoutine={onStartRoutine} />}
      {tab === 'videos' && <VideosTab region={region} videos={videos} saved={saved} toggleSave={toggleSave} onGuide={onGuide} />}
      {tab === 'evidence' && <EvidenceTab guide={guide} />}
    </aside>
  );
}

function OverviewTab({ region, guide, layer, shownMuscles }) {
  return (
    <div className="tabpanel" role="tabpanel">
      <p className="overview-text">{guide.overview}</p>
      <div className="fact-grid">
        <div className="fact"><span className="kicker bare">主要功能</span><p>{guide.roles.map((r, i) => <b key={r}>{r}</b>)}</p></div>
        <div className="fact"><span className="kicker bare">{layer === 'nerves' ? '神经走向' : layer === 'deep' ? '深层目标' : '浅层目标'}</span><p>{shownMuscles.map(m => <b key={m}>{m}</b>)}</p></div>
        <div className="fact nerve-fact"><span className="kicker bare">关联神经 · 示意</span><p>{region.nerves}</p></div>
      </div>
      <div className="two-col" style={{ marginTop: 26 }}>
        <div>
          <h3 style={{ fontSize: 15, margin: '0 0 12px' }}>紧绷的信号</h3>
          <ul className="signal-list">{guide.signals.map(s => <li key={s}>{s}</li>)}</ul>
        </div>
        <div>
          <h3 style={{ fontSize: 15, margin: '0 0 6px' }}>常见原因</h3>
          {guide.causes.map(c => <div className="cause" key={c.label}><b>{c.label}</b><p>{c.detail}</p></div>)}
        </div>
      </div>
      <h3 style={{ fontSize: 15, margin: '28px 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}><Sparkles size={15} /> 这个部位的拉伸剂量</h3>
      <div className="dose-card">
        <div><strong>{guide.dose.hold}</strong><small>保持</small></div>
        <div><strong>{guide.dose.reps}</strong><small>重复</small></div>
        <div><strong>{guide.dose.frequency}</strong><small>频率</small></div>
        <p>{guide.dose.note}</p>
      </div>
    </div>
  );
}

function MovesTab({ region, guide, routineSeconds, completions, onStartRoutine }) {
  return (
    <div className="tabpanel" role="tabpanel">
      <div className="routine-cta">
        <div className="time">{fmtMinutes(routineSeconds)}<i>分钟</i></div>
        <div>
          <b>{guide.daily.title} · {guide.daily.steps.length} 个步骤</b>
          <p>按顺序自动计时，含左右两侧。{completions ? `你已完成 ${completions} 次。` : '完成后会记录到今日练习。'}</p>
        </div>
        <button className="btn btn-ink" onClick={() => onStartRoutine({ title: guide.daily.title, subtitle: `${region.name} · 日常方案`, steps: guide.daily.steps })}><Play size={15} fill="currentColor" /> 开始跟练</button>
      </div>
      <h3><Activity size={16} /> 分步拉伸动作 <span className="kicker bare">{guide.moves.length} MOVES</span></h3>
      <div className="move-list">
        {guide.moves.map((m, i) => {
          const src = sources[m.source];
          return (
            <article className="move" key={m.name}>
              <div className="move-head">
                <div className="move-idx">{String(i + 1).padStart(2, '0')}</div>
                <div className="move-title">
                  <b>{m.name}</b><span>{m.en}</span>
                  <div className="move-target"><em>Target</em>{m.target}</div>
                </div>
                <div className="move-meta"><span><b>{m.hold}</b>保持</span><span><b>{m.reps}</b>重复</span></div>
              </div>
              <div className="move-body">
                <p className="move-pos"><b>起始姿势</b> · {m.position}</p>
                <ol className="move-steps">{m.steps.map(s => <li key={s}>{s}</li>)}</ol>
                <div className="move-notes">
                  <div className="note cue"><Sparkles size={13} /><span><b>要点</b> {m.cue}</span></div>
                  <div className="note avoid"><Ban size={13} /><span><b>避免</b> {m.avoid}</span></div>
                </div>
                {src && <a className="move-src" href={src.url} target="_blank" rel="noreferrer" title={src.title}>参考：{src.org} · {zhPart(src.title)} <ExternalLink size={11} /></a>}
              </div>
            </article>
          );
        })}
      </div>
      <h3><Wind size={16} /> 动态热身与活动度 <span className="kicker bare">Warm-up</span></h3>
      <div className="strip">{guide.mobility.map((m, i) => <div key={m}><i>{String(i + 1).padStart(2, '0')}</i><span>{m}</span></div>)}</div>
      <h3><Dumbbell size={16} /> 力量补充 <span className="kicker bare">Strengthen</span></h3>
      <div className="strength">
        {guide.strength.map(s => <div key={s.name}><div className="ic"><Flame size={16} /></div><div><b>{s.name}</b><p>{s.why}</p><p>做法：{s.how}</p></div></div>)}
      </div>
      <p className="source-note"><ShieldCheck size={14} /><span>剂量默认值来自 ACSM 立场声明（Garber 等，2011）：静态拉伸保持 {generalDose.hold}，重复 {generalDose.reps}，{generalDose.frequency}。{generalDose.intensity}。</span></p>
    </div>
  );
}

function VideosTab({ region, videos, saved, toggleSave, onGuide }) {
  const [kind, setKind] = useState('all');
  const [ptype, setPtype] = useState('all');
  const [fresh, setFresh] = useState(false);
  const availableKinds = useMemo(() => kinds.filter(k => videos.some(v => v.kind === k)), [videos]);
  const availableTypes = useMemo(() => Object.keys(publisherLabel).filter(t => videos.some(v => v.publisherType === t)), [videos]);
  const shown = videos.filter(v => (kind === 'all' || v.kind === kind) && (ptype === 'all' || v.publisherType === ptype) && (!fresh || (v.year || 0) >= 2024));
  return (
    <div className="tabpanel" role="tabpanel">
      <div className="video-toolbar">
        <button className={`chip ${kind === 'all' ? 'selected' : ''}`} onClick={() => setKind('all')}>全部类型</button>
        {availableKinds.map(k => <button key={k} className={`chip ${kind === k ? 'selected' : ''}`} onClick={() => setKind(k)}>{k}</button>)}
        <span className="spacer" />
        <span className="count">{shown.length} / {videos.length}</span>
      </div>
      <div className="video-toolbar" style={{ marginTop: -8 }}>
        <button className={`chip ${ptype === 'all' ? 'selected' : ''}`} onClick={() => setPtype('all')}>全部发布者</button>
        {availableTypes.map(t => <button key={t} className={`chip ${ptype === t ? 'selected' : ''}`} onClick={() => setPtype(t)} title={publisherName[t]}>{publisherLabel[t]} · {publisherName[t]}</button>)}
        <span className="spacer" />
        <button className={`chip ${fresh ? 'selected' : ''}`} onClick={() => setFresh(f => !f)}>2024 至今</button>
      </div>
      <div className="video-list">
        {shown.length ? shown.map(v => <VideoCard key={v.id} video={v} saved={saved.has(v.id)} onSave={() => toggleSave(v.id)} onGuide={() => onGuide(v)} />) : (
          <div className="empty">
            <Search size={20} />
            <p style={{ margin: 0 }}>这个筛选条件下没有可核实的视频。</p>
            <button className="btn btn-outline btn-sm" onClick={() => { setKind('all'); setPtype('all'); setFresh(false); }}>清除筛选</button>
            <a className="btn btn-outline btn-sm" href={platformSearch('YouTube', region.query)} target="_blank" rel="noreferrer">在 YouTube 继续查找 <ExternalLink size={12} /></a>
          </div>
        )}
      </div>
      <p className="source-note"><ShieldCheck size={14} /><span>视频元数据（原始标题、频道、上传日期、时长、观看数）于 {verifiedOn} 直接核对自 YouTube。按上传日期由新到旧排序；发布者资质表示身份，不代表临床审核。</span></p>
    </div>
  );
}

function EvidenceTab({ guide }) {
  const refs = guide.refs.map(k => ({ key: k, ...sources[k] })).filter(r => r.url);
  return (
    <div className="tabpanel" role="tabpanel">
      <div className="flag-box">
        <header><ShieldAlert size={16} /> 立即停止并就医的信号<small>Red flags</small></header>
        <ul>{guide.redFlags.map(f => <li key={f}>{f}</li>)}</ul>
        <div className="general"><div className="general-title">所有部位通用</div><ul>{generalRedFlags.map(f => <li key={f}>{f}</li>)}</ul></div>
      </div>
      <h3><Stethoscope size={16} /> 什么时候找专业人士</h3>
      <div className="seek"><div className="ic"><Stethoscope size={20} /></div><div><b>就医建议</b><p>{guide.seekCare}</p></div></div>
      <h3><TriangleAlert size={16} /> 这个部位要避免的做法</h3>
      <ul className="avoid-list">{guide.avoid.map(a => <li key={a}><Ban size={13} /><span>{a}</span></li>)}</ul>
      <h3><BookOpen size={16} /> 内容依据 <span className="kicker bare">{refs.length} sources</span></h3>
      <div className="ref-list">
        {refs.map(r => (
          <a className="ref" key={r.key} href={r.url} target="_blank" rel="noreferrer">
            <span className={`kind ${r.kind}`}>{r.kind === 'guideline' ? '指南' : r.kind === 'research' ? '研究' : '科普'}</span>
            <span><b>{r.title}</b><small>{r.org} · {r.year}</small></span>
            <ExternalLink size={14} />
          </a>
        ))}
      </div>
      <p className="source-note"><ShieldCheck size={14} /><span>以上内容为健康教育信息，不构成诊断或个体化治疗方案；来源链接于 {verifiedOn} 核对可访问。</span></p>
    </div>
  );
}
