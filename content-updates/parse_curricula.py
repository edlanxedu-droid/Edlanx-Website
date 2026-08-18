import re, os, json, glob

SRC = r"D:\edlanx-website\content-updates\curriculum-txt"
OUT = r"D:\edlanx-website\content-updates\curriculum-parsed"
os.makedirs(OUT, exist_ok=True)

TOP_RE = re.compile(r'^\s*(\d{1,2})\s+(?!\d)([A-Z][A-Za-z0-9&,\'/:\.\-\(\) ]{3,})$')
TOP_DOT_RE = re.compile(r'^\s*(\d{1,2})\.\s+([A-Z][A-Za-z0-9&,\'/:\.\-\(\) ]{3,})$')
SUB_SEARCH_RE = re.compile(r'^\s*(?:\d{1,2}\s+)?(\d{1,2})\.(\d{1,2})(?:\.(\d{1,2}))?\.?\s+([A-Z(].+)$')
BARE_LINE_RE = re.compile(r'^[A-Z][A-Za-z0-9&,\'/:\-\(\) ]{2,80}$')
STOP_MARKERS = ["WHY CHOOSE", "Why This Journey", "DIRECT MENTORSHIP", "Projects:"]
SKIP_EXACT = {'EDLANX', 'Program Overview', 'The Edlanx Methodology', 'Our Development Philosophy', 'The Edlanx Advantage'}

def clean(s):
    s = re.sub(r'\s+', ' ', s).strip()
    return s.rstrip('.')

def parse_file(path):
    with open(path, encoding='utf-8', errors='replace') as f:
        raw_lines = [l.rstrip('\n') for l in f.readlines()]

    start = 0
    for i, l in enumerate(raw_lines):
        if 'Table of Contents' in l:
            start = i + 1
            break

    stop = len(raw_lines)
    for i in range(start, len(raw_lines)):
        if any(m in raw_lines[i] for m in STOP_MARKERS):
            stop = i
            break

    body = [l.strip() for l in raw_lines[start:stop]]
    body = [l for l in body if l and l not in SKIP_EXACT]

    explicit_titles = {}
    topics_by_module = {}
    order = []
    bare_pool = []  # (index, text) lines with no explicit module attribution

    i = 0
    n = len(body)
    while i < n:
        l = body[i]
        m_top = TOP_RE.match(l) or TOP_DOT_RE.match(l)
        m_sub = SUB_SEARCH_RE.search(l)

        if m_top and not m_sub:
            num = int(m_top.group(1))
            title_parts = [clean(m_top.group(2))]
            j = i + 1
            # consume wrapped continuation lines (bare, no digits) until a topic/new heading
            while j < n:
                nxt = body[j]
                if SUB_SEARCH_RE.search(nxt) or TOP_RE.match(nxt) or TOP_DOT_RE.match(nxt):
                    break
                if BARE_LINE_RE.match(nxt) and not re.search(r'\d', nxt):
                    title_parts.append(clean(nxt))
                    j += 1
                    continue
                break
            explicit_titles.setdefault(num, clean(' '.join(title_parts)))
            i = j
            continue

        if m_sub:
            num = int(m_sub.group(1))
            text = clean(m_sub.group(4))
            if text and len(text) >= 3:
                topics_by_module.setdefault(num, [])
                if num not in order:
                    order.append(num)
                topics_by_module[num].append(text)
            i += 1
            continue

        if BARE_LINE_RE.match(l) and not re.search(r'\d', l):
            bare_pool.append((i, clean(l)))
        i += 1

    all_nums = sorted(set(list(topics_by_module.keys()) + list(explicit_titles.keys())))
    missing_title_nums = [num for num in all_nums if num not in explicit_titles]

    # merge consecutive bare_pool lines into candidate phrases
    candidates = []
    k = 0
    while k < len(bare_pool):
        idx, text = bare_pool[k]
        parts = [text]
        k2 = k + 1
        while k2 < len(bare_pool) and bare_pool[k2][0] == bare_pool[k2 - 1][0] + 1:
            parts.append(bare_pool[k2][1])
            k2 += 1
        candidates.append(' '.join(parts))
        k = k2

    ci = 0
    for num in missing_title_nums:
        if ci < len(candidates):
            explicit_titles[num] = candidates[ci]
            ci += 1
        else:
            explicit_titles[num] = f'Module {num}'

    modules = []
    for num in all_nums:
        modules.append({
            'num': num,
            'title': explicit_titles.get(num, f'Module {num}'),
            'topics': topics_by_module.get(num, []),
        })
    return modules

results = {}
for path in glob.glob(os.path.join(SRC, '*.txt')):
    name = os.path.splitext(os.path.basename(path))[0]
    mods = parse_file(path)
    results[name] = mods
    with open(os.path.join(OUT, name + '.json'), 'w', encoding='utf-8') as f:
        json.dump(mods, f, indent=2, ensure_ascii=False)

summary_lines = []
flag_lines = []
for name, mods in sorted(results.items()):
    total_topics = sum(len(m['topics']) for m in mods)
    nums = [m['num'] for m in mods]
    expected = list(range(1, max(nums) + 1)) if nums else []
    missing = [num for num in expected if num not in nums]
    summary_lines.append(f"{name}: {len(mods)} modules, {total_topics} topics" + (f"  MISSING={missing}" if missing else ""))
    for m in mods:
        if m['title'].startswith('Module ') or len(m['title'].split()) < 2:
            flag_lines.append(f"{name} | num={m['num']} | title='{m['title']}'")

with open(os.path.join(OUT, '_summary.txt'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(summary_lines))

print('\n'.join(summary_lines))
print('\n--- FLAGGED TITLES (still bad) ---')
print('\n'.join(flag_lines) if flag_lines else 'none')
