// Usage: node yt_search.mjs "query" [maxResults] -> JSON lines of search results (videos only)
import { get } from './fetch.mjs';
const [query, maxArg] = process.argv.slice(2); const max = Number(maxArg) || 20;
const html = get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&hl=en&sp=EgIQAQ%253D%253D`);
const m = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
if (!m) { console.error('no ytInitialData'); process.exit(1); }
const data = JSON.parse(m[1]);
const found = [];
const text = t => t ? (t.simpleText || (t.runs || []).map(r => r.text).join('')) : null;
const walk = (node) => {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) { node.forEach(walk); return; }
  if (node.videoRenderer) { const v = node.videoRenderer; found.push({ id: v.videoId, title: text(v.title), channel: text(v.ownerText), published: text(v.publishedTimeText), length: text(v.lengthText), views: text(v.viewCountText) }); }
  for (const k of Object.keys(node)) walk(node[k]);
};
walk(data);
found.slice(0, max).forEach(v => console.log(JSON.stringify(v)));
