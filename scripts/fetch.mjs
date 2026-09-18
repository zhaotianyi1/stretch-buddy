import { execFileSync } from 'node:child_process';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
export function get(url) {
  return execFileSync('curl', ['-sL', '--max-time', '25', '-A', UA, '-H', 'Accept-Language: en-US,en;q=0.9', '-H', 'Cookie: CONSENT=YES+1', url], { maxBuffer: 64 * 1024 * 1024 }).toString('utf8');
}
