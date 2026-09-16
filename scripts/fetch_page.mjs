import ZAI from 'z-ai-web-dev-sdk';
import { writeFileSync } from 'fs';

async function main() {
  const url = process.argv[2];
  const out = process.argv[3];
  const zai = await ZAI.create();
  const res = await zai.functions.invoke('page_reader', { url });
  const html = res?.data?.html || '';
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
  writeFileSync(out, (res?.data?.title || '') + '\n' + text);
  console.log('saved', out, 'chars:', text.length, 'published:', res?.data?.publishedTime || 'n/a');
}
main().catch((e) => { console.error('FAIL', e?.message || e); process.exit(1); });
