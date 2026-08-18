# -*- coding: utf-8 -*-
import os, time, urllib.request, urllib.parse
from PIL import Image

OUT_DIR = r"D:\edlanx-website\assets\images\thumbs"
os.makedirs(OUT_DIR, exist_ok=True)

STYLE = ", editorial photography style, natural lighting, shallow depth of field, realistic, high quality, no text, no watermark"

PROMPTS = {
    "full-stack-web-development": "A young Indian software developer coding a website on a laptop with a code editor visible on screen, modern office desk, warm ambient lighting",
    "web-architecture": "A young Indian web developer reviewing a website wireframe on a tablet next to a laptop showing HTML code, modern workspace, natural light",
    "python": "A young Indian programmer typing Python code on a laptop, focused expression, cozy desk setup with a monitor showing code",
    "machine-learning": "A young Indian data scientist analyzing machine learning model graphs on a laptop screen, modern office, focused expression",
    "android-app-development": "A young Indian mobile app developer testing an app on a smartphone next to a laptop, modern desk setup",
    "data-science": "A young Indian data analyst reviewing colorful data charts and graphs on a large monitor, modern office, focused expression",
    "artificial-intelligence": "A young Indian AI engineer working at a laptop displaying neural network diagrams, modern office, focused expression",
    "ui-ux": "A young Indian UX designer sketching app wireframes on a graphic tablet, creative studio desk with sticky notes",
    "graphic-design": "A young Indian graphic designer working on colorful branding designs on a laptop, creative studio desk",
    "ar-vr": "A young Indian developer wearing a VR headset, hands raised interacting with a virtual interface, modern tech lab",
    "devops": "A young Indian DevOps engineer monitoring server dashboards on multiple screens, modern office, focused expression",
    "selenium-testing-java": "A young Indian QA engineer reviewing automated test results on a laptop screen, modern office desk",
    "cyber-security": "A young Indian cybersecurity analyst monitoring security alerts on a laptop in a dim modern office, serious focused expression",
    "java": "A young Indian software engineer writing Java code on a laptop, modern office desk, focused expression",
    "sap": "A young Indian business systems consultant reviewing an SAP dashboard on a laptop, modern corporate office",
    "aws": "A young Indian cloud engineer working on cloud infrastructure diagrams on a laptop, modern office, focused expression",
    "embedded-systems": "A young Indian embedded systems engineer soldering a circuit board at an electronics workbench, workshop lighting",
    "hybrid-electric-vehicle": "A young Indian automotive engineer inspecting an electric vehicle battery pack in a modern garage, focused expression",
    "vlsi": "A young Indian chip design engineer examining a microchip under a microscope in a lab, focused expression",
    "iot": "A young Indian engineer connecting IoT sensor devices to a laptop dashboard, modern workshop",
    "robotics": "A young Indian robotics engineer programming a robotic arm in a lab, focused expression",
    "power-systems": "A young Indian electrical engineer inspecting power distribution equipment with a tablet, industrial setting",
    "autocad": "A young Indian design engineer working on a 2D drafting CAD drawing on a large monitor, modern office desk",
    "catia": "A young Indian mechanical design engineer reviewing a 3D CAD model of a car part on a monitor, modern office",
    "car-design": "A young Indian automotive designer sketching a car concept design on a tablet, creative studio",
    "construction-planning-structural-analysis": "A young Indian civil engineer reviewing building blueprints at a construction site, wearing a hard hat",
    "finance": "A young Indian financial analyst reviewing financial charts on a laptop, modern corporate office",
    "digital-marketing": "A young Indian digital marketer analyzing social media campaign analytics on a laptop, modern office",
    "hr-management": "A young Indian HR professional conducting a job interview across a desk, modern office",
    "business-analytics": "A young Indian business analyst presenting data dashboards on a laptop screen, modern office",
    "stock-marketing": "A young Indian stock trader analyzing market charts on multiple monitors, modern office, focused expression",
    "sap-fico": "A young Indian finance consultant reviewing SAP financial reports on a laptop, modern corporate office",
    "supply-chain-management": "A young Indian supply chain manager reviewing logistics data on a tablet in a warehouse",
    "sales-force": "A young Indian CRM administrator configuring a Salesforce dashboard on a laptop, modern office",
    "web3": "A young Indian blockchain developer reviewing smart contract code on a laptop, modern office",
    "investment-banking": "A young Indian investment banking analyst reviewing financial valuation models on a laptop, modern corporate office",
    "acca-f4": "A young Indian accounting student studying corporate law textbooks with a laptop, modern library",
    "bioinformatics": "A young Indian bioinformatics researcher analyzing DNA sequence data on a laptop screen in a lab",
    "microbiology": "A young Indian microbiologist examining a petri dish sample in a lab, wearing a lab coat",
    "molecular-biology": "A young Indian molecular biology researcher operating a PCR machine in a lab, wearing a lab coat",
    "medical-coding": "A young Indian medical coder reviewing healthcare documents on a laptop, modern office desk",
    "nano-science-technology": "A young Indian nanotechnology researcher examining materials under a lab microscope, wearing a lab coat",
    "genetic-engineering": "A young Indian genetic engineering researcher using a pipette in a modern biotech lab, wearing a lab coat",
    "pharmacovigilance": "A young Indian pharmacovigilance associate reviewing drug safety reports on a laptop, modern office",
    "food-science-technology": "A young Indian food scientist inspecting food samples in a quality control lab, wearing a lab coat",
    "nutrition-health-management": "A young Indian nutritionist consulting with a client about a diet plan, modern clinic office",
    "sensory-science": "A young Indian sensory scientist evaluating food samples in a tasting lab, focused expression",
}

def download(slug, prompt, seed, retries=3):
    out_path = os.path.join(OUT_DIR, f"{slug}.jpg")
    url = "https://image.pollinations.ai/prompt/" + urllib.parse.quote(prompt + STYLE) + f"?width=1024&height=576&nologo=true&seed={seed}"
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
            tmp_path = out_path + ".tmp"
            with open(tmp_path, "wb") as f:
                f.write(data)
            img = Image.open(tmp_path)
            img.verify()
            img = Image.open(tmp_path).convert("RGB")
            img.save(out_path, "JPEG", quality=80, optimize=True)
            os.remove(tmp_path)
            return True, os.path.getsize(out_path)
        except Exception as e:
            if attempt == retries - 1:
                return False, str(e)
            time.sleep(2)
    return False, "unknown"

results = []
for i, (slug, prompt) in enumerate(PROMPTS.items()):
    ok, info = download(slug, prompt, seed=1000 + i)
    status = "OK" if ok else "FAIL"
    print(f"[{i+1}/{len(PROMPTS)}] {status} {slug}: {info}")
    results.append((slug, ok))

failed = [s for s, ok in results if not ok]
print("\nDone. Failed:", failed if failed else "none")
