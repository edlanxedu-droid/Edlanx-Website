# -*- coding: utf-8 -*-
import os, time, urllib.request, urllib.parse, json
from PIL import Image

API_KEY = "55788959-66aba7d58d6e729c70152bfb1"
OUT_DIR = r"D:\edlanx-website\assets\images\covers"
os.makedirs(OUT_DIR, exist_ok=True)

# name: (query, aspect_w, aspect_h, out_w, out_h)
HEROES = {
    "hero-student":      ("indian college student portrait laptop", 4, 5, 1000, 1250),
    "about-hero":        ("business team meeting collaboration office", 3, 2, 1400, 933),
    "register-hero":     ("customer service call center agent", 3, 2, 1400, 933),
    "departments-hero":  ("university campus students walking", 3, 2, 1400, 933),
    "pricing-hero":      ("graduation success achievement student", 3, 2, 1400, 933),
}

def fetch(slug, query, ratio_w, ratio_h, out_w, out_h, seed_page=1, retries=3):
    out_path = os.path.join(OUT_DIR, f"{slug}.jpg")
    orientation = "vertical" if ratio_h > ratio_w else "horizontal"
    search_url = "https://pixabay.com/api/?" + urllib.parse.urlencode({
        "key": API_KEY, "q": query, "image_type": "photo",
        "orientation": orientation, "safesearch": "true",
        "per_page": 10, "order": "popular", "min_width": 1200,
    })
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(search_url, timeout=20) as resp:
                data = json.loads(resp.read())
            hits = data.get("hits", [])
            if not hits:
                return False, "no results"
            # pick by seed_page index to avoid duplicate picks across calls
            hit = hits[min(seed_page - 1, len(hits) - 1)]
            img_url = hit.get("largeImageURL") or hit["webformatURL"]
            tmp_path = out_path + ".tmp"
            req = urllib.request.Request(img_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                img_data = resp.read()
            with open(tmp_path, "wb") as f:
                f.write(img_data)
            img = Image.open(tmp_path).convert("RGB")
            w, h = img.size
            target_ratio = ratio_w / ratio_h
            if w / h > target_ratio:
                new_w = int(h * target_ratio)
                left = (w - new_w) // 2
                img = img.crop((left, 0, left + new_w, h))
            else:
                new_h = int(w / target_ratio)
                top = (h - new_h) // 2
                img = img.crop((0, top, w, top + new_h))
            img = img.resize((out_w, out_h), Image.LANCZOS)
            img.save(out_path, "JPEG", quality=85, optimize=True)
            os.remove(tmp_path)
            return True, os.path.getsize(out_path)
        except Exception as e:
            if attempt == retries - 1:
                return False, str(e)
            time.sleep(1.5)
    return False, "unknown"

for i, (slug, (query, rw, rh, ow, oh)) in enumerate(HEROES.items()):
    ok, info = fetch(slug, query, rw, rh, ow, oh, seed_page=1)
    print(f"{'OK' if ok else 'FAIL'} {slug}: {info}")
    time.sleep(0.5)
