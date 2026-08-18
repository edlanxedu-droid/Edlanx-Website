import re
from pathlib import Path

ROOT = Path(r"D:\edlanx-website")

PATTERNS = [
    (r'(src|href)="(\.\./)?(js|css|assets)/', r'\1="/\3/'),
]

count = 0
for f in ROOT.rglob("*.html"):
    text = f.read_text(encoding="utf-8")
    original = text
    for pat, repl in PATTERNS:
        text = re.sub(pat, repl, text)
    if text != original:
        f.write_text(text, encoding="utf-8")
        count += 1
        print("Updated:", f.relative_to(ROOT))

print(f"\n{count} files updated")
