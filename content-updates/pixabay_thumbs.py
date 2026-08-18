# -*- coding: utf-8 -*-
import os, time, urllib.request, urllib.parse, json
from PIL import Image

API_KEY = "55788959-66aba7d58d6e729c70152bfb1"
OUT_DIR = r"D:\edlanx-website\assets\images\thumbs"
os.makedirs(OUT_DIR, exist_ok=True)

QUERIES = {
    "full-stack-web-development": "website code screen programming",
    "web-architecture": "website wireframe layout design",
    "python": "python code programming screen",
    "machine-learning": "neural network data technology",
    "android-app-development": "mobile app smartphone screen",
    "data-science": "data analytics charts dashboard",
    "artificial-intelligence": "artificial intelligence circuit technology",
    "ui-ux": "ux wireframe design sketch",
    "graphic-design": "graphic design colorful branding",
    "ar-vr": "virtual reality headset technology",
    "devops": "server data center technology",
    "selenium-testing-java": "software code testing screen",
    "cyber-security": "cyber security lock digital",
    "java": "programming code screen",
    "sap": "business software dashboard screen",
    "aws": "cloud computing servers technology",
    "embedded-systems": "circuit board electronics chip",
    "hybrid-electric-vehicle": "electric vehicle charging battery",
    "vlsi": "microchip semiconductor circuit",
    "iot": "internet of things sensor device",
    "robotics": "robot arm technology",
    "power-systems": "electrical power lines grid",
    "autocad": "cad blueprint technical drawing",
    "catia": "3d model engineering design",
    "car-design": "car concept sketch design",
    "construction-planning-structural-analysis": "construction blueprint building site",
    "finance": "finance charts money graph",
    "digital-marketing": "digital marketing social media analytics",
    "hr-management": "office desk documents",
    "business-analytics": "business analytics dashboard charts",
    "stock-marketing": "stock market chart trading",
    "sap-fico": "finance accounting business charts",
    "supply-chain-management": "warehouse logistics boxes",
    "sales-force": "crm software dashboard",
    "web3": "blockchain digital technology",
    "investment-banking": "finance banking charts money",
    "acca-f4": "law books legal documents",
    "bioinformatics": "dna genome research",
    "microbiology": "microscope laboratory petri dish",
    "molecular-biology": "dna molecule laboratory",
    "medical-coding": "medical documents healthcare",
    "nano-science-technology": "nanotechnology laboratory microscope",
    "genetic-engineering": "dna genetic laboratory",
    "pharmacovigilance": "pharmacy medicine pills",
    "food-science-technology": "food laboratory science testing",
    "nutrition-health-management": "healthy food nutrition diet",
    "sensory-science": "food tasting laboratory testing",
}

def search_and_download(slug, query, retries=3):
    out_path = os.path.join(OUT_DIR, f"{slug}.jpg")
    search_url = "https://pixabay.com/api/?" + urllib.parse.urlencode({
        "key": API_KEY, "q": query, "image_type": "photo",
        "orientation": "horizontal", "safesearch": "true",
        "per_page": 5, "order": "popular",
    })
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(search_url, timeout=20) as resp:
                data = json.loads(resp.read())
            hits = data.get("hits", [])
            if not hits:
                return False, "no results"
            img_url = hits[0]["webformatURL"]
            tmp_path = out_path + ".tmp"
            req = urllib.request.Request(img_url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=20) as resp:
                img_data = resp.read()
            with open(tmp_path, "wb") as f:
                f.write(img_data)
            img = Image.open(tmp_path).convert("RGB")
            # crop to 16:9
            w, h = img.size
            target_ratio = 16 / 9
            if w / h > target_ratio:
                new_w = int(h * target_ratio)
                left = (w - new_w) // 2
                img = img.crop((left, 0, left + new_w, h))
            else:
                new_h = int(w / target_ratio)
                top = (h - new_h) // 2
                img = img.crop((0, top, w, top + new_h))
            img = img.resize((900, 506), Image.LANCZOS)
            img.save(out_path, "JPEG", quality=80, optimize=True)
            os.remove(tmp_path)
            return True, os.path.getsize(out_path)
        except Exception as e:
            if attempt == retries - 1:
                return False, str(e)
            time.sleep(1.5)
    return False, "unknown"

results = []
for i, (slug, query) in enumerate(QUERIES.items()):
    ok, info = search_and_download(slug, query)
    print(f"[{i+1}/{len(QUERIES)}] {'OK' if ok else 'FAIL'} {slug}: {info}")
    results.append((slug, ok))
    time.sleep(0.3)

failed = [s for s, ok in results if not ok]
print("\nDone. Failed:", failed if failed else "none")
