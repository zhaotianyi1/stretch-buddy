// Usage: node yt_meta.mjs ID [ID...]  -> JSON lines with verified YouTube metadata
import { get } from './fetch.mjs';
const pick = (html, key) => { const m = html.match(new RegExp('"' + key + '":"((?:[^"\\\\]|\\\\.)*)"')); return m ? JSON.parse('"' + m[1] + '"') : null; };
for (const id of process.argv.slice(2)) {
  try {
    const html = get(`https://www.youtube.com/watch?v=${id}&hl=en`);
    const statusMatch = html.match(/"playabilityStatus":\{"status":"([A-Z_]+)"/);
    const out = {
      id, status: statusMatch ? statusMatch[1] : null,
      title: pick(html, 'title'), channel: pick(html, 'ownerChannelName'), channelId: pick(html, 'externalChannelId'),
      publishDate: (pick(html, 'publishDate') || '').slice(0, 10) || null, uploadDate: (pick(html, 'uploadDate') || '').slice(0, 10) || null,
      lengthSeconds: Number(pick(html, 'lengthSeconds')) || null, viewCount: Number(pick(html, 'viewCount')) || null,
      isLive: /"isLiveContent":true/.test(html),
    };
    const mf = html.match(/"playerMicroformatRenderer":\{"thumbnail"[\s\S]*?"title":\{"simpleText":"((?:[^"\\]|\\.)*)"/);
    if (mf) out.title = JSON.parse('"' + mf[1] + '"');
    out.isShort = out.lengthSeconds != null && out.lengthSeconds <= 60;
    console.log(JSON.stringify(out));
  } catch (e) { console.log(JSON.stringify({ id, error: String(e).slice(0, 200) })); }
}
