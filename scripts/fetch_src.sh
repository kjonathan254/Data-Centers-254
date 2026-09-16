#!/bin/bash
# fetch_src.sh <url> <out.txt> - fetch page via z-ai CLI page_reader, strip HTML
set -e
cd /home/z/my-project/data-centers-audit/repo
z-ai function -n page_reader -a "{\"url\": \"$1\"}" -o /tmp/pr_raw.json >/dev/null 2>&1
python3 - "$2" <<'EOF'
import json, re, sys
d = json.load(open('/tmp/pr_raw.json'))
def dig(x):
    if isinstance(x, dict):
        if 'html' in x and isinstance(x['html'], str):
            return x['html']
        for v in x.values():
            r = dig(v)
            if r: return r
    if isinstance(x, list):
        for v in x:
            r = dig(v)
            if r: return r
    return None
html = dig(d) or ''
t = re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>', ' ', html)
t = re.sub(r'<[^>]+>', ' ', t)
t = t.replace('&amp;', '&').replace('&#x27;', "'").replace('&#39;', "'").replace('&quot;', '"').replace('&nbsp;', ' ')
t = re.sub(r'\s+', ' ', t).strip()
open(sys.argv[1], 'w').write(t)
print('saved', sys.argv[1], 'chars:', len(t))
EOF
