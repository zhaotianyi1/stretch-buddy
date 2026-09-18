import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, Armchair, ArrowUpRight, Bike, Bookmark, Car, Clock3, Crosshair, Dumbbell, Flame, Footprints, HeartPulse, Info,
  Layers, Menu, MousePointer2, Play, Search, ShieldCheck, Smartphone, Sunrise, Target, Timer, Wind, X, Zap
} from 'lucide-react';
import BodyAtlas from './BodyAtlas.jsx';
import DetailPanel from './components/DetailPanel.jsx';
import RoutinePlayer from './components/RoutinePlayer.jsx';
import { layerMuscles, regions, verifiedOn, videos, videosFor } from './data.js';
import { generalDose, regionGuides } from './content/guide.js';
import { sources } from './content/sources.js';
import { scenes } from './content/scenes.js';
import { fmtMinutes, readJSON, sumSeconds, writeJSON } from './utils.js';

const ICONS = { Armchair, Smartphone, MousePointer2, Footprints, Dumbbell, Clock3, Sunrise, Car, Bike };
const LEFT_LABELS = ['neck', 'chest', 'abs', 'hip', 'thigh'];
const RIGHT_LABELS = ['shoulder', 'upperBack', 'lowerBack', 'arm', 'forearm', 'calf'];
const BACK_REGIONS = new Set(['upperBack', 'lowerBack']);
const FRONT_REGIONS = new Set(['chest', 'abs']);
const totalMoves = Object.values(regionGuides).reduce((a, g) => a + g.moves.length, 0);
const sourceCount = Object.keys(sources).length;

function Brand() {
  return <a className="brand" href="#top" aria-label="Stretch Buddy 首页"><span className="brand-mark" /><span>Stretch<em>Buddy</em></span></a>;
}

const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export default function App() {
  const [selected, setSelected] = useState('neck');
  const [hovered, setHovered] = useState(null);
  const [clickedRegion, setClickedRegion] = useState(null);
  const [layer, setLayer] = useState('superficial');
  const [view, setView] = useState('front');
  const [tab, setTab] = useState('overview');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState(() => new Set(readJSON('stretch-buddy-saved', [])));
  const [log, setLog] = useState(() => readJSON('stretch-buddy-log', []));
  const [player, setPlayer] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const searchRef = useRef(null);

  const region = regions.find(r => r.id === selected) || regions[0];
  const guide = regionGuides[region.id];
  const regionVideos = useMemo(() => videosFor(region.id), [region.id]);
  const hoveredRegion = regions.find(r => r.id === hovered);
  const completions = log.filter(e => e.region === region.id).length;
  const todayCount = log.filter(e => e.date === new Date().toISOString().slice(0, 10)).length;

  const visibleRegions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return regions.filter(r => `${r.name}${r.en}${r.latin}${r.short}${r.nerves}${r.muscles.join('')}${Object.values(layerMuscles[r.id] || {}).flat().join('')}${regionGuides[r.id].signals.join('')}`.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    const onKey = e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchRef.current?.focus(); scrollTo('scenes'); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const pickRegion = useCallback((id, opts = {}) => {
    setSelected(id);
    setClickedRegion(id);
    setHovered(null);
    if (BACK_REGIONS.has(id)) setView('back');
    if (FRONT_REGIONS.has(id)) setView('front');
    if (opts.tab) setTab(opts.tab);
    if (opts.scroll) scrollTo(opts.scroll);
  }, []);

  const selectFromAtlas = id => {
    if (id === clickedRegion) { scrollTo('region-detail'); return; }
    pickRegion(id);
  };

  const toggleSave = id => setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); writeJSON('stretch-buddy-saved', [...n]); return n; });
  const logCompletion = useCallback(seconds => {
    setLog(prev => { const n = [...prev, { region: region.id, date: new Date().toISOString().slice(0, 10), seconds }]; writeJSON('stretch-buddy-log', n.slice(-500)); return n; });
  }, [region.id]);

  const startRoutine = routine => setPlayer(routine);
  const startVideoGuide = video => setPlayer({
    title: `跟随视频 · ${video.title}`, subtitle: `${video.channel} · 按示范节奏，自由计时`, video,
    steps: [['先完整观看示范', 45], ['跟练 · 第一组', 60, '左右各半'], ['放松 · 自然呼吸', 20], ['跟练 · 第二组', 60, '左右各半'], ['轻柔活动收尾', 30]],
  });

  const labelButton = id => {
    const r = regions.find(x => x.id === id);
    return (
      <button key={id} className={selected === id ? 'selected' : ''} onClick={() => selectFromAtlas(id)}
        onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(id)} onBlur={() => setHovered(null)}>
        {r.short}<span>{r.en}</span>
      </button>
    );
  };

  const switchLayer = l => { setLayer(l); setClickedRegion(null); setHovered(null); };
  const switchView = v => { setView(v); setClickedRegion(null); setHovered(null); };

  return (
    <div className="shell" id="top">
      <header className="topbar">
        <div className="wrap">
          <Brand />
          <nav className={`nav ${mobileMenu ? 'open' : ''}`} onClick={() => setMobileMenu(false)}>
            <a href="#dose">拉伸剂量 <span>01</span></a>
            <a className="active" href="#atlas">人体图谱 <span>02</span></a>
            <a href="#scenes">日常场景 <span>03</span></a>
            <a href="#method">内容依据 <span>04</span></a>
          </nav>
          <div className="top-actions">
            <span className="saved-pill" title="收藏与今日完成"><Bookmark size={13} /><b>{saved.size}</b><span>收藏</span><Flame size={13} style={{ marginLeft: 6 }} /><b>{todayCount}</b><span>今日</span></span>
            <button className="btn btn-volt btn-sm" onClick={() => { setTab('moves'); scrollTo('region-detail'); }}><Play size={13} fill="currentColor" /><span className="lbl">开始跟练</span></button>
            <button className="icon-btn menu-btn" aria-label="打开导航" onClick={() => setMobileMenu(v => !v)}>{mobileMenu ? <X size={18} /> : <Menu size={18} />}</button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap hero-inner">
            <div className="hero-copy">
              <div className="hero-eyebrow"><span className="live" /> Evidence-based body atlas · 循证拉伸图谱</div>
              <h1>找到酸痛点，<br /><em>科学地</em>拉伸。</h1>
              <p className="hero-sub">按部位读懂肌肉与神经，拿到有出处的拉伸剂量、分步动作方案，以及逐条核验过的物理治疗师 YouTube 示范——把身体的信号，变成一条清晰的舒展路径。</p>
              <div className="hero-cta">
                <button className="btn btn-volt" onClick={() => scrollTo('atlas')}><Crosshair size={17} /> 定位我的酸痛处</button>
                <button className="btn btn-outline on-dark" onClick={() => scrollTo('dose')}>先看拉伸剂量 <ArrowUpRight size={15} /></button>
              </div>
              <div className="hero-stats">
                <div><strong>{regions.length}</strong><small>身体部位</small></div>
                <div><strong>{videos.length}<i>▶</i></strong><small>核验 YouTube 视频</small></div>
                <div><strong>{totalMoves}</strong><small>分步动作</small></div>
                <div><strong>{sourceCount}</strong><small>指南与研究来源</small></div>
              </div>
            </div>
            <div className="hero-side" aria-label="身体索引">
              <header><span>Body index</span><b>{verifiedOn} 核对</b></header>
              {regions.map((r, i) => (
                <button key={r.id} className={selected === r.id ? 'selected' : ''} onClick={() => pickRegion(r.id, { scroll: 'atlas' })}>
                  <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                  <span className="name">{r.name}<small>{r.en}</small></span>
                  <span className="count">{videosFor(r.id).length} 视频 · {regionGuides[r.id].moves.length} 动作</span>
                  <ArrowUpRight size={14} />
                </button>
              ))}
            </div>
          </div>
          <div className="ticker" aria-hidden="true">
            <div className="ticker-track">
              {[...regions, ...regions].map((r, i) => <span key={i}><i>{r.name}</i>{r.latin}</span>)}
            </div>
          </div>
        </section>

        <section className="dose" id="dose">
          <div className="wrap">
            <div className="section-head">
              <div><span className="kicker">01 · Dosage</span><h2>拉伸的科学剂量<span>How much is enough</span></h2></div>
              <p>通用建议来自 ACSM 立场声明与 NHS 指南。各部位的具体保持时间与次数，见图谱右侧的"动作方案"。</p>
            </div>
            <div className="dose-grid">
              <div className="dose-tile"><span className="kicker bare">Hold</span><div className="dose-num">15–30<i>秒</i></div><div className="dose-label">每次保持</div><p className="dose-note">静态拉伸保持 10–30 秒即可，老年人可延长至 30–60 秒。</p></div>
              <div className="dose-tile"><span className="kicker bare">Reps</span><div className="dose-num">2–4<i>次</i></div><div className="dose-label">每个动作重复</div><p className="dose-note">每个动作累计约 60 秒；感到明显牵拉或轻微不适即可，不应疼痛。</p></div>
              <div className="dose-tile"><span className="kicker bare">Frequency</span><div className="dose-num">≥2–3<i>天/周</i></div><div className="dose-label">每周频率</div><p className="dose-note">每天做效果最好；每个肌群每周累计约 5 分钟就能改善活动度。</p></div>
              <div className="dose-tile"><span className="kicker bare">Timing</span><div className="dose-num">5–10<i>分钟</i></div><div className="dose-label">先热身再拉伸</div><p className="dose-note">肌肉温热时拉伸效果最好；也可以安排在运动之后。</p></div>
            </div>
            <div className="rules">
              <div className="rule"><div className="ic"><Wind size={18} /></div><div><b>运动前动态，运动后静态</b><p>运动前对单块肌肉静态拉伸超过 60 秒可能短暂降低力量与爆发力；热身阶段更适合动态拉伸。</p><a href={sources.behm2016.url} target="_blank" rel="noreferrer">Behm 2016 系统综述 ↗</a></div></div>
              <div className="rule"><div className="ic"><Dumbbell size={18} /></div><div><b>拉伸不能替代力量</b><p>肩、腰、髋、跟腱等部位的康复方案都把拉伸与渐进力量训练放在一起；单纯拉伸对疼痛的长期改善有限。</p><a href={sources.aaosShoulder.url} target="_blank" rel="noreferrer">AAOS 康复方案 ↗</a></div></div>
              <div className="rule"><div className="ic"><Timer size={18} /></div><div><b>酸痛不是拉伸能"拉掉"的</b><p>Cochrane 综述显示，运动前后拉伸对延迟性肌肉酸痛几乎没有影响；改善活动度需要持续数周的积累。</p><a href={sources.herbert2011.url} target="_blank" rel="noreferrer">Herbert 2011 Cochrane ↗</a></div></div>
            </div>
          </div>
        </section>

        <section className="wrap" id="atlas">
          <div className="section-head">
            <div><span className="kicker">02 · Atlas</span><h2>读懂你的身体<span>Explore by region</span></h2></div>
            <p>悬停预览、点击选中；切换浅层、深层与神经三个层次，右侧同步给出该部位的方案与视频。</p>
          </div>
          <div className="atlas">
            <div className="panel atlas-panel">
              <div className="panel-head">
                <div><span className="kicker bare"><Layers size={12} /> {view === 'front' ? 'Anterior' : 'Posterior'} · {layer}</span><h2>人体图谱</h2></div>
                <div className="panel-help"><Info size={13} /> 悬停预览 · 点击高亮 · 再点跳到详情</div>
              </div>
              <div className="atlas-controls">
                <div className="seg">
                  <button className={view === 'front' ? 'selected' : ''} onClick={() => switchView('front')}>正面</button>
                  <button className={view === 'back' ? 'selected' : ''} onClick={() => switchView('back')}>背面</button>
                </div>
                <div className="seg">
                  <button className={layer === 'superficial' ? 'selected' : ''} onClick={() => switchLayer('superficial')}><span className="dot muscle" />浅层肌肉</button>
                  <button className={layer === 'deep' ? 'selected' : ''} onClick={() => switchLayer('deep')}><span className="dot deep" />深层肌肉</button>
                  <button className={layer === 'nerves' ? 'selected' : ''} onClick={() => switchLayer('nerves')}><span className="dot nerve" />神经</button>
                </div>
              </div>
              <div className="atlas-canvas">
                <div className="canvas-grid" /><div className="canvas-axis" />
                {hoveredRegion && (
                  <div className="atlas-hover" role="tooltip">
                    <strong>{hoveredRegion.name}</strong>
                    <span>{layer === 'nerves' ? hoveredRegion.nerves : layerMuscles[hovered]?.[layer]?.join(' · ')}</span>
                    <small>{clickedRegion === hovered ? 'SELECTED · 再次点击查看详情' : 'CLICK TO SELECT'}</small>
                  </div>
                )}
                <div className="body-labels left-labels">{LEFT_LABELS.map(labelButton)}</div>
                <BodyAtlas selected={selected} hovered={hovered} onSelect={selectFromAtlas} onHover={setHovered} layer={layer} view={view} />
                <div className="body-labels right-labels">{RIGHT_LABELS.map(labelButton)}</div>
                <div className="atlas-caption">
                  <span><b>示意图谱</b> · 浅深层按覆盖关系绘制<br />仅供定位与理解，不用于诊断</span>
                  <span className="legend"><span><span className="dot muscle" />Muscle</span><span><span className="dot deep" />Deep</span><span><span className="dot nerve" />Nerve</span></span>
                </div>
              </div>
            </div>
            <DetailPanel region={region} guide={guide} layer={layer} videos={regionVideos} saved={saved} toggleSave={toggleSave}
              onGuide={startVideoGuide} onStartRoutine={startRoutine} completions={completions} tab={tab} setTab={setTab} />
          </div>
        </section>

        <section className="scenes" id="scenes">
          <div className="wrap">
            <div className="section-head">
              <div><span className="kicker">03 · Start here</span><h2>今天哪里不舒服？<span>Scenes</span></h2></div>
              <p>从一个日常场景进入，直接打开对应部位的动作方案。也可以按肌肉或英文名搜索。</p>
            </div>
            <div className="scene-grid">
              {scenes.map((s, i) => {
                const Icon = ICONS[s.icon] || Activity;
                const mins = fmtMinutes(sumSeconds(regionGuides[s.region].daily.steps));
                return (
                  <button key={s.id} className={`scene ${selected === s.region ? 'selected' : ''}`} data-idx={String(i + 1).padStart(2, '0')} onClick={() => pickRegion(s.region, { tab: 'moves', scroll: 'atlas' })}>
                    <span className="mins">{mins} MIN</span>
                    <span className="arrow"><ArrowUpRight size={14} /></span>
                    <Icon size={20} style={{ marginBottom: 8, opacity: .8 }} />
                    <b>{s.label}</b>
                    <small>{s.sub} · {regions.find(r => r.id === s.region).name}</small>
                  </button>
                );
              })}
            </div>
            <div className="search-row">
              <div className="search-box">
                <Search size={17} />
                <input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索肌肉、部位、症状或英文名称…" aria-label="搜索部位" />
                {query ? <span className="count" style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{visibleRegions.length} 个匹配</span> : <kbd>⌘K</kbd>}
              </div>
              {query && visibleRegions.length > 0 && (
                <div className="search-results">
                  {visibleRegions.slice(0, 5).map(r => (
                    <button key={r.id} onClick={() => { pickRegion(r.id, { scroll: 'atlas' }); setQuery(''); }}>
                      <span>{r.name}<small style={{ marginLeft: 8 }}>{r.latin}</small></span><small>{videosFor(r.id).length} 视频</small><ArrowUpRight size={14} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="method" id="method">
          <div className="wrap">
            <div className="section-head">
              <div><span className="kicker">04 · Method</span><h2>内容是怎么来的<span>Methodology</span></h2></div>
              <p>每一条建议和每一个视频都能追溯到出处。这里说明筛选标准与边界。</p>
            </div>
            <div className="method-grid">
              <div className="method-card">
                <span className="kicker bare">Videos</span>
                <h3>视频如何筛选</h3>
                <ul>
                  <li>只收录 YouTube 单视频直链；发布者为物理治疗师（PT/DPT）、医师、医院或公共卫生机构。</li>
                  <li>原始标题、频道、上传日期、时长与观看数于 {verifiedOn} 直接核对自 YouTube 页面元数据，不采用机构网页的更新日期。</li>
                  <li>优先 2024 年以后的内容；保留少量较早的专业示范补充覆盖。综合视频标注为"跟练""活动度""康复讲解"等，避免把所有内容描述为纯拉伸。</li>
                </ul>
              </div>
              <div className="method-card">
                <span className="kicker bare">Guidance</span>
                <h3>康复建议的依据</h3>
                <ul>
                  <li>剂量默认值来自 ACSM 立场声明（Garber 等，2011）：保持 {generalDose.hold}、重复 {generalDose.reps}、{generalDose.frequency}。</li>
                  <li>各部位动作与就医建议对照 NHS、NHS inform、AAOS OrthoInfo 康复方案与 NICE NG59 整理，并注明每个动作的出处。</li>
                  <li>拉伸与运动表现、肌肉酸痛的关系引用 Behm 2016、Herbert 2011（Cochrane）与 Thomas 2018 等系统综述。</li>
                </ul>
              </div>
              <div className="method-card">
                <span className="kicker bare">Boundaries</span>
                <h3>边界与免责</h3>
                <p>Stretch Buddy 是健康教育与动作发现工具，不提供诊断或个体化治疗方案。发布者资质表示身份，不代表临床审核，也不表示视频适合每一个人。</p>
                <p>解剖图谱为按部位组织的教育示意，浅层与深层表示覆盖关系，不等同于解剖间室分类。</p>
              </div>
            </div>
            <div className="method-stats">
              <div><strong>{videos.length}</strong><small>核验视频</small></div>
              <div><strong>{new Set(videos.map(v => v.channelId)).size}</strong><small>发布频道</small></div>
              <div><strong>{sourceCount}</strong><small>指南与研究来源</small></div>
              <div><strong>{verifiedOn}</strong><small>核对日期</small></div>
            </div>
          </div>
        </section>

        <section className="safety">
          <div className="wrap">
            <div className="ic"><ShieldCheck size={24} /></div>
            <div>
              <span className="kicker">A kind reminder</span>
              <h3>把舒适放在第一位</h3>
              <p>拉伸应保持轻柔。若出现刺痛、麻木、头晕或疼痛加重，请停止练习并寻求专业帮助；各部位的红旗症状见"依据与就医"。</p>
            </div>
            <div className="safety-tags"><span><Zap size={13} /> 轻柔开始</span><span><Clock3 size={13} /> 循序渐进</span><span><HeartPulse size={13} /> 自然呼吸</span><span><Target size={13} /> 无痛范围</span></div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <Brand />
          <p>让身体，自在一点。</p>
          <span>© 2026 Stretch Buddy · Body atlas for everyday movement · Data verified {verifiedOn}</span>
        </div>
      </footer>

      {player && <RoutinePlayer title={player.title} subtitle={player.subtitle} steps={player.steps} video={player.video} onClose={() => setPlayer(null)} onComplete={logCompletion} />}
    </div>
  );
}
