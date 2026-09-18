import React from 'react';
import { Bookmark, Check, ExternalLink, Play, Timer } from 'lucide-react';
import { publisherLabel } from '../data.js';
import { fmtDuration, fmtViews } from '../utils.js';

export default function VideoCard({ video, saved, onSave, onGuide }) {
  return (
    <article className="video-card">
      <a className="video-thumb" href={video.url} target="_blank" rel="noreferrer" aria-label={`在 YouTube 观看：${video.title}`}>
        <img src={video.thumbnail} alt="" loading="lazy" onError={e => { e.currentTarget.style.display = 'none'; }} />
        <span className="wash" />
        <span className={`ptype ${video.publisherType === 'publicHealth' ? 'nhs' : ''}`}>{publisherLabel[video.publisherType] || 'PT'}</span>
        <span className="play"><Play size={16} fill="currentColor" /></span>
        {video.lengthSeconds ? <span className="dur">{fmtDuration(video.lengthSeconds)}</span> : null}
      </a>
      <div className="video-body">
        <div className="video-top">
          <div className="video-meta">
            <span className="kind">{video.kind}</span>
            <span>{video.publishedAt ? `上传 ${video.publishedAt}` : '上传日期未确认'}</span>
            {video.viewCount ? <span>{fmtViews(video.viewCount)} 次观看</span> : null}
          </div>
          <button className={`icon-btn ${saved ? 'active' : ''}`} aria-label={saved ? '取消收藏' : '收藏视频'} title={saved ? '取消收藏' : '收藏视频'} onClick={onSave}>
            {saved ? <Check size={15} /> : <Bookmark size={15} />}
          </button>
        </div>
        <h4>{video.title}</h4>
        <p className="video-orig" title={video.original}>{video.original}</p>
        <div className="video-pub">
          <span>{video.channel}</span>
          {video.credentials && <span className="cred">{video.credentials}</span>}
        </div>
        {video.tags?.length ? <div className="video-tags">{video.tags.map(t => <span className="chip tag" key={t}>{t}</span>)}</div> : null}
        <div className="video-actions">
          {video.sourceUrl && <a className="src" href={video.sourceUrl} target="_blank" rel="noreferrer" title="发布者来源页面">来源 ↗</a>}
          <button onClick={onGuide}><Timer size={14} /> 跟练计时</button>
          <a className="go" href={video.url} target="_blank" rel="noreferrer">在 YouTube 观看 <ExternalLink size={12} /></a>
        </div>
      </div>
    </article>
  );
}
