# -*- coding: utf-8 -*-
import json, os

PARSED = r"D:\edlanx-website\content-updates\curriculum-parsed"
OUT_JS = r"D:\edlanx-website\js\courses-data.js"

def load(name):
    with open(os.path.join(PARSED, name + ".json"), encoding="utf-8") as f:
        data = json.load(f)
    return [{"title": m["title"], "topics": m["topics"]} for m in data if m["topics"]]

# slug -> parsed-json basename
PDF_MAP = {
    "full-stack-web-development": "Edlanx Full stack",
    "python": "EDLANX PYTHON",
    "machine-learning": "EDLANX ML",
    "android-app-development": "EDLANX ANDRIOD APP DEVELOPMENT",
    "data-science": "EDLANX DATA SCIENCE",
    "artificial-intelligence": "EDLANX AI",
    "ui-ux": "EDLANX UIUX",
    "graphic-design": "EDLANX GRAPHIC DESIGN",
    "ar-vr": "EDLANX ARVR",
    "devops": "EDLANX DevOps",
    "selenium-testing-java": "EDLANX SELENIUM TESTING",
    "cyber-security": "CYBER SECURITY CURRICULUM",
    "java": "EDLANX JAVA",
    "embedded-systems": "EDLANX EMBEDDED SYSTEMS",
    "hybrid-electric-vehicle": "EDLANX HYBRID ELECTRIC VEHICLE",
    "vlsi": "EDLANX VLSI",
    "iot": "EDLANX IOT",
    "robotics": "EDLANX ROBOTICS",
    "power-systems": "EDLANX POWER SYSTEMS",
    "autocad": "EDLANX AUTOCAD",
    "catia": "EDLANX CATIA",
    "car-design": "EDLANX CAR DESIGN",
    "construction-planning-structural-analysis": "EDLANX CP&SA",
    "finance": "EDLANX FINANCE",
    "digital-marketing": "EDLANX DIGITAL MARKETING",
    "hr-management": "EDLANX HR MANAGEMENT",
    "business-analytics": "EDLANX Business Analytics",
    "stock-marketing": "EDLANX STOCK MARKETING",
    "sap-fico": "EDLANX SAP FICO",
    "supply-chain-management": "EDLANX SUPPLY CHAIN",
    "sales-force": "EDLANX SALESFORCE",
    "web3": "EDLANX WEB 3.0",
    "investment-banking": "EDLANX INVESTMENT BANKING",
    "acca-f4": "EDLANX ACCA",
    "bioinformatics": "EDLANX BIOINFORMATICS",
    "microbiology": "EDLANX MICROBIO",
    "molecular-biology": "EDLANX MOLECULAR BIOLOGY",
    "medical-coding": "EDLANX MEDICAL CODING",
    "nano-science-technology": "EDLANX NANOSCI&TECH",
    "genetic-engineering": "EDLANX GENETIC ENGINEERING",
    "pharmacovigilance": "EDLANX PHARMACOVIGILANCE",
    # new courses (brochure exists, no prior catalog entry)
    "aws": "EDLANX AWS",
    "food-science-technology": "EDLANX FOOD SCIENCE",
    "nutrition-health-management": "EDLANX NUTRITION&HEALTH MANAGEMENT",
    "sensory-science": "EDLANX SENSORY SCIENCE",
    "web-architecture": "EDLANX WEB DEVELOPMENT ",
}

SALARY = {
    "full-stack-web-development": "3-6 LPA",
    "python": "3-6 LPA",
    "machine-learning": "7-12 LPA",
    "android-app-development": "3.5-6 LPA",
    "data-science": "4-10 LPA",
    "artificial-intelligence": "7-12 LPA",
    "ui-ux": "3-8 LPA",
    "graphic-design": "2-4.5 LPA",
    "ar-vr": "3.5-6 LPA",
    "devops": "4-8 LPA",
    "selenium-testing-java": "4-8 LPA",
    "cyber-security": "4-8 LPA",
    "java": "3.5-6 LPA",
    "sap": "3-6 LPA",
    "embedded-systems": "3-6 LPA",
    "hybrid-electric-vehicle": "3-8 LPA",
    "vlsi": "4-7 LPA",
    "iot": "4-8 LPA",
    "robotics": "4-8 LPA",
    "power-systems": "3-6 LPA",
    "autocad": "2.5-4.5 LPA",
    "catia": "2.5-4.5 LPA",
    "car-design": "3-6 LPA",
    "construction-planning-structural-analysis": "2.5-5 LPA",
    "finance": "2.5-6 LPA",
    "digital-marketing": "2.5-4 LPA",
    "hr-management": "2.5-4.5 LPA",
    "business-analytics": "3.5-7 LPA",
    "stock-marketing": "4-7 LPA",
    "sap-fico": "3.5-6 LPA",
    "supply-chain-management": "3-6 LPA",
    "sales-force": "3-5.5 LPA",
    "web3": "5-8 LPA",
    "investment-banking": "6-12 LPA",
    "acca-f4": "4-6 LPA",
    "bioinformatics": "3.5-6 LPA",
    "microbiology": "3-5 LPA",
    "molecular-biology": "2.5-5 LPA",
    "medical-coding": "2.5-4.5 LPA",
    "nano-science-technology": "3-5 LPA",
    "genetic-engineering": "2-4 LPA",
    "pharmacovigilance": "3-5.5 LPA",
    # new courses: no dedicated research done: leave None, will render "On request"
    "aws": "4-9 LPA",
    "food-science-technology": "2.5-5 LPA",
    "nutrition-health-management": "2.5-5 LPA",
    "sensory-science": "2.5-4.5 LPA",
    "web-architecture": "3-6 LPA",
}

# ---- Full course metadata (existing 42 + 5 new) ----
DEPARTMENTS = [
    {"slug": "cse-it", "name": "CSE / IT", "icon": "cpu",
     "tagline": "Build future-ready digital skills in software, AI, data, cloud, and application development.",
     "description": "From frontend to full stack, from classic ML to generative AI, the CSE/IT track covers the skills hiring managers screen for first, with hands-on projects and an ISO certified certificate on completion."},
    {"slug": "ece", "name": "ECE", "icon": "circuitry",
     "tagline": "Learn to design smart electronic systems, automation, robotics, and next-gen technologies.",
     "description": "Embedded systems, VLSI, IoT and robotics for students who want to build the hardware and firmware behind next-generation electronics, EVs, and automation."},
    {"slug": "mechanical", "name": "Mechanical", "icon": "gear-six",
     "tagline": "Master design, modeling, and innovation for real-world mechanical and automotive systems.",
     "description": "Industry-standard CAD and CAE tools for mechanical design, automotive styling, and product development, taught the way design offices actually work."},
    {"slug": "civil", "name": "Civil", "icon": "buildings",
     "tagline": "Develop skills to plan, design, and manage modern infrastructure and construction projects.",
     "description": "Structural analysis, construction planning, and drafting skills for students heading into site engineering, planning, or infrastructure design roles."},
    {"slug": "management", "name": "Management & Commerce", "icon": "chart-line-up",
     "tagline": "Gain strong foundations in business, finance, marketing, analytics, and corporate strategy.",
     "description": "Finance, analytics, marketing, and enterprise tools for commerce and management students building a corporate career, from core fundamentals to platform-specific certifications like SAP FICO and Salesforce."},
    {"slug": "bio-life-sciences", "name": "Bio & Life Sciences", "icon": "dna",
     "tagline": "Explore careers in healthcare, biotechnology, genetics, and pharmaceutical technologies.",
     "description": "Lab-grounded training across bioinformatics, microbiology, genetics, and pharma-adjacent skills like medical coding, pharmacovigilance, and food and nutrition science."},
]

COURSES_META = [
    # ---- CSE / IT ----
    dict(slug="full-stack-web-development", name="Full Stack Web Development", departments=["cse-it"], category="tech",
         shortDescription="Master HTML, CSS, JS, React, Node.js and build responsive, production-ready web apps with CI/CD and cloud deployment.",
         scope="Full stack developers build and maintain both the frontend and backend of web applications, one of the highest-demand skill sets across Indian product companies, startups, and IT services firms.",
         roles=["Frontend Developer", "Backend Developer", "Full Stack Developer", "Software Engineer"]),
    dict(slug="web-architecture", name="Web Architecture", departments=["cse-it"], category="tech",
         shortDescription="Semantic HTML, responsive layout, JavaScript, and an introduction to React and Node.js for building and deploying complete web applications.",
         scope="Every product and agency needs engineers who can turn a design into a fast, accessible, well-structured website, the entry point into frontend and full stack careers.",
         roles=["Web Developer", "Frontend Developer", "Junior Software Engineer"]),
    dict(slug="python", name="Python", departments=["cse-it"], category="tech",
         shortDescription="Python fundamentals to intermediate with hands-on projects.",
         scope="Python is the most widely used language for scripting, automation, backend development, data analysis, and AI, making it a foundational skill across almost every tech role.",
         roles=["Python Developer", "Software Engineer", "Automation Engineer", "Backend Developer"]),
    dict(slug="machine-learning", name="Machine Learning", departments=["cse-it"], category="tech",
         shortDescription="Hands-on ML with scikit-learn, model evaluation, feature engineering, and deployment.",
         scope="Machine learning powers recommendation engines, fraud detection, forecasting, and automation across finance, e-commerce, healthcare, and product companies.",
         roles=["Machine Learning Engineer", "ML Ops Engineer", "Data Scientist", "AI Engineer"]),
    dict(slug="android-app-development", name="Android App Development", departments=["cse-it"], category="tech",
         shortDescription="Kotlin, Jetpack, REST APIs, and Play Store publishing.",
         scope="Android powers the majority of smartphones in India, and native app developers stay in steady demand across product companies, startups, and IT services firms.",
         roles=["Android Developer", "Mobile App Developer", "Software Engineer"]),
    dict(slug="data-science", name="Data Science", departments=["cse-it"], category="tech",
         shortDescription="Statistics, Python, Pandas, machine learning, and storytelling dashboards.",
         scope="Data scientists turn raw business data into decisions, a core function in e-commerce, fintech, healthcare, and analytics consulting.",
         roles=["Data Scientist", "Data Analyst", "Business Intelligence Analyst"]),
    dict(slug="artificial-intelligence", name="Artificial Intelligence", departments=["cse-it"], category="tech",
         shortDescription="Search, planning, NLP basics, and an introduction to deep learning.",
         scope="AI skills apply across search, recommendation, automation, and generative tools, and are increasingly required in both tech and non-tech industries adopting AI.",
         roles=["AI Engineer", "Machine Learning Engineer", "AI Research Associate"]),
    dict(slug="ui-ux", name="UI/UX", departments=["cse-it"], category="design",
         shortDescription="User research, wireframing, Figma, and design systems.",
         scope="Every digital product, app, or website needs usable, well-designed interfaces, making UI/UX a core hiring need across product companies, agencies, and startups.",
         roles=["UI/UX Designer", "Product Designer", "Interaction Designer"]),
    dict(slug="graphic-design", name="Graphic Design", departments=["cse-it"], category="design",
         shortDescription="Branding, typography, and visual storytelling.",
         scope="Brands, agencies, and marketing teams need visual designers for everything from social content to packaging and brand identity.",
         roles=["Graphic Designer", "Visual Designer", "Brand Designer"]),
    dict(slug="ar-vr", name="AR/VR Development", departments=["cse-it"], category="tech",
         shortDescription="Create immersive AR/VR experiences with Unity and WebXR technologies.",
         scope="AR/VR is expanding beyond gaming into training simulations, retail, real estate, and industrial visualization, creating demand for developers who can build immersive experiences.",
         roles=["AR/VR Developer", "Unity Developer", "XR Engineer"]),
    dict(slug="devops", name="DevOps", departments=["cse-it"], category="tech",
         shortDescription="Docker, Kubernetes, Terraform, Ansible, and cloud deployment workflows.",
         scope="DevOps engineers keep software delivery fast and reliable, a role every product company and IT services firm running cloud infrastructure needs.",
         roles=["DevOps Engineer", "Site Reliability Engineer", "Cloud Engineer"]),
    dict(slug="selenium-testing-java", name="Selenium Testing with Java", departments=["cse-it"], category="tech",
         shortDescription="Selenium WebDriver, TestNG, Page Objects, and CI test execution.",
         scope="Automated QA is essential to shipping reliable software fast, and Selenium remains the industry-standard tool for web test automation.",
         roles=["QA Automation Engineer", "SDET", "Test Engineer"]),
    dict(slug="cyber-security", name="Cyber Security", departments=["cse-it"], category="tech",
         shortDescription="Network security, ethical hacking, cloud and mobile security, and incident response.",
         scope="With rising cyber threats, every company handling digital data now needs security-aware engineers and analysts, from banks to SaaS startups.",
         roles=["Cyber Security Analyst", "SOC Analyst", "Security Engineer"]),
    dict(slug="java", name="Java", departments=["cse-it"], category="tech",
         shortDescription="Java fundamentals to intermediate with hands-on projects.",
         scope="Java remains the backbone of enterprise software, banking systems, and Android development across India's largest IT employers.",
         roles=["Java Developer", "Backend Developer", "Software Engineer"]),
    dict(slug="sap", name="SAP", departments=["cse-it", "management"], category="business",
         shortDescription="SAP overview with key modules and business process mapping.",
         scope="SAP runs the core operations of most large enterprises, and certified SAP professionals are consistently in demand at IT services and consulting firms.",
         roles=["SAP Consultant", "SAP Functional Analyst", "ERP Analyst"]),
    dict(slug="aws", name="AWS Cloud", departments=["cse-it"], category="tech",
         shortDescription="Core AWS services, cloud architecture, security, and deployment for production workloads.",
         scope="Cloud is the default deployment target for modern software, and AWS remains the most widely used cloud platform in Indian IT and product companies.",
         roles=["Cloud Engineer", "AWS Solutions Associate", "DevOps Engineer"]),

    # ---- ECE ----
    dict(slug="embedded-systems", name="Embedded Systems", departments=["ece"], category="hardware",
         shortDescription="Microcontrollers, RTOS, and peripheral interfacing through to driver development.",
         scope="Embedded engineers build the firmware behind everything from consumer electronics to automotive and industrial systems, a core hiring need in India's growing electronics manufacturing sector.",
         roles=["Embedded Systems Engineer", "Firmware Engineer", "Embedded Software Developer"]),
    dict(slug="hybrid-electric-vehicle", name="Hybrid Electric Vehicle", departments=["ece"], category="hardware",
         shortDescription="EV powertrains, battery management, and vehicle control systems.",
         scope="India's EV sector is expanding rapidly, creating fresh demand for engineers who understand powertrains, battery systems, and vehicle control.",
         roles=["EV Systems Engineer", "Automotive Electronics Engineer", "Powertrain Engineer"]),
    dict(slug="vlsi", name="VLSI", departments=["ece"], category="hardware",
         shortDescription="Digital design, Verilog HDL, and chip synthesis.",
         scope="Chip design is a specialised, high-value skill sought by semiconductor and product companies building custom hardware.",
         roles=["VLSI Design Engineer", "Digital Design Engineer", "ASIC Engineer"]),
    dict(slug="iot", name="IoT", departments=["ece"], category="hardware",
         shortDescription="Sensors, connectivity protocols, cloud dashboards, and industrial IoT.",
         scope="Connected devices are expanding across manufacturing, agriculture, healthcare, and smart-city projects, all needing engineers who can build the IoT stack end to end.",
         roles=["IoT Engineer", "Embedded IoT Developer", "Solutions Engineer"]),
    dict(slug="robotics", name="Robotics", departments=["ece"], category="hardware",
         shortDescription="Kinematics, control systems, ROS, and sensor integration.",
         scope="Automation and robotics are growing across manufacturing, logistics, and research, creating demand for engineers who understand control systems and robotic platforms.",
         roles=["Robotics Engineer", "Automation Engineer", "Controls Engineer"]),
    dict(slug="power-systems", name="Power Systems", departments=["ece"], category="hardware",
         shortDescription="Power generation, transmission, distribution, and protection systems.",
         scope="Power generation, transmission, and grid modernisation remain core to India's infrastructure, keeping demand steady for power systems engineers.",
         roles=["Power Systems Engineer", "Electrical Design Engineer", "Site Engineer"]),

    # ---- Mechanical ----
    dict(slug="autocad", name="AutoCAD", departments=["mechanical", "civil"], category="hardware",
         shortDescription="2D drafting and 3D modeling for mechanical designs.",
         scope="AutoCAD is the industry-standard drafting tool used across mechanical, civil, and architectural design offices, a baseline skill for most design roles.",
         roles=["CAD Designer", "Design Engineer", "Drafting Engineer"]),
    dict(slug="catia", name="CATIA", departments=["mechanical"], category="hardware",
         shortDescription="Mechanical 2D drafting and parametric 3D modeling in CATIA.",
         scope="CATIA is widely used in automotive and aerospace design offices for parametric 3D modeling, a valued specialised skill for product design roles.",
         roles=["CATIA Design Engineer", "Product Design Engineer", "CAD Engineer"]),
    dict(slug="car-design", name="Car Design", departments=["mechanical"], category="design",
         shortDescription="Automotive design fundamentals, surfacing, and aerodynamics.",
         scope="Automotive OEMs and design studios need stylists and design engineers who understand form, aerodynamics, and surfacing.",
         roles=["Automotive Designer", "Design Engineer", "Surface Modeling Engineer"]),

    # ---- Civil ----
    dict(slug="construction-planning-structural-analysis", name="Construction Planning & Structural Analysis", departments=["civil"], category="hardware",
         shortDescription="Construction planning, project scheduling methods, and structural analysis fundamentals.",
         scope="Every construction project needs planners and analysts who can manage schedules, costs, and structural safety, a core function across contractors and infrastructure firms.",
         roles=["Site Engineer", "Planning Engineer", "Structural Design Trainee"]),

    # ---- Management & Commerce ----
    dict(slug="finance", name="Finance", departments=["management"], category="business",
         shortDescription="Corporate finance foundations and financial modeling.",
         scope="Every company needs people who understand financial statements, valuation, and modeling, making finance one of the most transferable commerce skill sets.",
         roles=["Financial Analyst", "Finance Executive", "Accounts Executive"]),
    dict(slug="digital-marketing", name="Digital Marketing", departments=["management"], category="business",
         shortDescription="SEO, paid ads, content strategy, and marketing analytics.",
         scope="Nearly every business now runs digital campaigns, creating steady demand for marketers who understand SEO, paid ads, and analytics.",
         roles=["Digital Marketing Executive", "SEO Specialist", "Performance Marketing Executive"]),
    dict(slug="hr-management", name="HR Management", departments=["management"], category="business",
         shortDescription="Talent lifecycle, recruitment, and HR analytics.",
         scope="Every organisation needs HR professionals to manage hiring, onboarding, and people operations, a stable, evergreen career path.",
         roles=["HR Executive", "Talent Acquisition Associate", "HR Generalist"]),
    dict(slug="business-analytics", name="Business Analytics", departments=["management"], category="business",
         shortDescription="SQL, BI tooling, and data-driven decision making.",
         scope="Businesses increasingly rely on data to make decisions, creating demand for analysts who can turn numbers into recommendations.",
         roles=["Business Analyst", "Data Analyst", "Reporting Analyst"]),
    dict(slug="stock-marketing", name="Stock Marketing", departments=["management"], category="business",
         shortDescription="Market fundamentals, technical and fundamental analysis, and trading strategy.",
         scope="India's retail investing boom has grown demand for people who understand markets, trading, and investment research, for both personal and professional use.",
         roles=["Equity Research Associate", "Trading Associate", "Investment Analyst"]),
    dict(slug="sap-fico", name="SAP FICO", departments=["management"], category="business",
         shortDescription="Industry-oriented training in SAP financial accounting and controlling processes.",
         scope="SAP FICO specialists are consistently hired by IT services and consulting firms implementing SAP finance modules for enterprise clients.",
         roles=["SAP FICO Consultant", "Finance Systems Analyst", "ERP Consultant"]),
    dict(slug="supply-chain-management", name="Supply Chain Management", departments=["management"], category="business",
         shortDescription="Procurement, logistics, and demand planning fundamentals.",
         scope="Every manufacturing and retail business depends on efficient supply chains, keeping demand steady for planning and logistics professionals.",
         roles=["Supply Chain Analyst", "Logistics Executive", "Procurement Associate"]),
    dict(slug="sales-force", name="Salesforce", departments=["management"], category="business",
         shortDescription="Salesforce admin basics, objects, workflows, and automation.",
         scope="Salesforce is one of the most widely deployed CRM platforms globally, and certified administrators are in high demand at IT services firms and enterprises.",
         roles=["Salesforce Administrator", "CRM Analyst", "Salesforce Consultant"]),
    dict(slug="web3", name="Web 3.0", departments=["management"], category="tech",
         shortDescription="Blockchain fundamentals, smart contracts, and decentralized applications.",
         scope="Blockchain and decentralised applications are an emerging area for companies exploring digital assets, smart contracts, and Web3 products.",
         roles=["Blockchain Developer", "Web3 Associate", "Smart Contract Developer"]),
    dict(slug="investment-banking", name="Investment Banking", departments=["management"], category="business",
         shortDescription="Financial markets, corporate finance, and investment analysis fundamentals.",
         scope="Investment banking and corporate finance roles require strong grounding in valuation, financial markets, and analysis, sought by banks, boutique advisory firms, and corporates.",
         roles=["Investment Banking Analyst", "Corporate Finance Associate", "Equity Research Analyst"]),
    dict(slug="acca-f4", name="ACCA F4 (Business & Corporate Law)", departments=["management"], category="business",
         shortDescription="Business and corporate law principles aligned with ACCA standards.",
         scope="ACCA-aligned legal and corporate law knowledge is valued by accounting, audit, and compliance teams working with international standards.",
         roles=["Compliance Associate", "Legal & Corporate Affairs Associate", "Audit Trainee"]),

    # ---- Bio & Life Sciences ----
    dict(slug="bioinformatics", name="Bioinformatics", departments=["bio-life-sciences"], category="bio",
         shortDescription="Sequence analysis, BLAST, and bioinformatics pipelines.",
         scope="Genomics and pharma research increasingly rely on bioinformatics to process and interpret biological data, a growing niche at research institutions and biotech companies.",
         roles=["Bioinformatics Analyst", "Research Associate", "Genomics Data Analyst"]),
    dict(slug="microbiology", name="Microbiology", departments=["bio-life-sciences"], category="bio",
         shortDescription="Microbial techniques and industry applications.",
         scope="Microbiology skills apply across diagnostics labs, pharma quality control, and food safety testing.",
         roles=["Microbiologist", "Quality Control Analyst", "Lab Technician"]),
    dict(slug="molecular-biology", name="Molecular Biology", departments=["bio-life-sciences"], category="bio",
         shortDescription="DNA/RNA techniques and PCR.",
         scope="Molecular biology techniques are core to diagnostics, pharma R&D, and academic and clinical research labs.",
         roles=["Molecular Biology Technician", "Research Associate", "Lab Technician"]),
    dict(slug="medical-coding", name="Medical Coding", departments=["bio-life-sciences"], category="bio",
         shortDescription="ICD, CPT, and HIPAA basics.",
         scope="Healthcare providers and insurers need certified medical coders to process claims accurately, a fast-growing outsourced healthcare function in India.",
         roles=["Medical Coder", "Clinical Documentation Associate", "Health Information Associate"]),
    dict(slug="nano-science-technology", name="Nano Science and Technology", departments=["bio-life-sciences"], category="bio",
         shortDescription="Nanomaterials, characterization techniques, and applications.",
         scope="Nanotechnology research feeds into materials science, electronics, and pharma applications, mostly within research institutions and R&D teams.",
         roles=["Research Associate", "Materials Science Trainee", "Lab Technician"]),
    dict(slug="genetic-engineering", name="Genetic Engineering", departments=["bio-life-sciences"], category="bio",
         shortDescription="Gene editing, vectors, and lab applications.",
         scope="Gene editing and biotech research roles are growing at pharma, agri-biotech, and academic research labs.",
         roles=["Research Associate", "Genetic Engineering Technician", "Lab Technician"]),
    dict(slug="pharmacovigilance", name="Pharmacovigilance", departments=["bio-life-sciences"], category="bio",
         shortDescription="Adverse-event monitoring, drug safety reporting, and pharmacovigilance regulations.",
         scope="Pharma companies and CROs are required to monitor drug safety, creating steady, regulation-driven demand for pharmacovigilance associates.",
         roles=["Pharmacovigilance Associate", "Drug Safety Associate", "Clinical Data Associate"]),
    dict(slug="food-science-technology", name="Food Science and Technology", departments=["bio-life-sciences"], category="bio",
         shortDescription="Food chemistry, processing, and food safety systems.",
         scope="Food manufacturers and quality teams need trained professionals in processing, safety, and quality systems as India's packaged food industry grows.",
         roles=["Food Technologist", "Quality Assurance Executive", "Lab Technician"]),
    dict(slug="nutrition-health-management", name="Nutrition & Health Management", departments=["bio-life-sciences"], category="bio",
         shortDescription="Applied nutrition science and health management fundamentals.",
         scope="Growing health awareness has increased demand for trained professionals in nutrition counselling, wellness programs, and diet planning.",
         roles=["Nutrition Associate", "Wellness Coordinator", "Dietary Assistant"]),
    dict(slug="sensory-science", name="Sensory Science", departments=["bio-life-sciences"], category="bio",
         shortDescription="Sensory evaluation methods and quality assessment for food and consumer products.",
         scope="FMCG and food companies rely on trained sensory panels and analysts to evaluate product quality before launch.",
         roles=["Sensory Analyst", "Quality Assurance Associate", "R&D Associate"]),
]

def js_str(s):
    return json.dumps(s, ensure_ascii=False)

def js_list(lst):
    return "[" + ", ".join(js_str(x) for x in lst) + "]"

def modules_js(modules, indent="      "):
    lines = []
    for m in modules:
        topics = js_list(m["topics"])
        lines.append(f'{indent}{{ title: {js_str(m["title"])}, topics: {topics} }},')
    return "\n".join(lines)

lines = []
lines.append("/* ============================================================")
lines.append("   EDLANX — Course & curriculum data")
lines.append("   Single source of truth for department + course detail pages.")
lines.append("   Curriculum sourced from official Edlanx course brochures.")
lines.append("   ============================================================ */")
lines.append("")
lines.append("const CLOSING_MODULES = {")
lines.append('  tech: [')
lines.append('    { title: "Applied Capstone Project", topics: ["Real-world build", "Code reviews", "Performance & optimization", "Documentation & handoff"] },')
lines.append('    { title: "Industry Tools & Best Practices", topics: ["Git & version control", "CI/CD basics", "Agile & issue tracking", "Testing & QA standards"] },')
lines.append('  ],')
lines.append('  hardware: [')
lines.append('    { title: "Applied Capstone Project", topics: ["Prototype build", "Design reviews", "Testing & validation", "Documentation & handoff"] },')
lines.append('    { title: "Industry Tools & Standards", topics: ["Industry-standard CAD/CAE tools", "Safety & compliance standards", "Design documentation", "Vendor & BOM basics"] },')
lines.append('  ],')
lines.append('  business: [')
lines.append('    { title: "Applied Capstone Project", topics: ["Live case study", "Stakeholder presentation", "Data-backed recommendations", "Documentation & handoff"] },')
lines.append('    { title: "Industry Tools & Practices", topics: ["Excel & BI tooling", "Reporting frameworks", "Stakeholder communication", "Compliance basics"] },')
lines.append('  ],')
lines.append('  bio: [')
lines.append('    { title: "Applied Lab Project", topics: ["Guided lab / research project", "Data analysis & interpretation", "Lab safety & protocols", "Documentation & reporting"] },')
lines.append('    { title: "Industry Tools & Standards", topics: ["Standard lab & analysis software", "Regulatory & compliance basics", "Sample handling protocols", "Reporting standards"] },')
lines.append('  ],')
lines.append('  design: [')
lines.append('    { title: "Applied Capstone Project", topics: ["Brief-to-delivery project", "Design critiques", "Iteration & refinement", "Documentation & handoff"] },')
lines.append('    { title: "Industry Tools & Practices", topics: ["Industry design tooling", "Design systems & handoff", "Client presentation", "Feedback cycles"] },')
lines.append('  ],')
lines.append("};")
lines.append('const CAREER_MODULE = { title: "Career & Placement Prep", topics: ["Resume & portfolio building", "Mock interviews", "Career counselling session", "Placement support"] };')
lines.append("")
lines.append("function buildCurriculum(course) {")
lines.append("  if (course.modules && course.modules.length) return course.modules;")
lines.append("  return [];")
lines.append("}")
lines.append("")
lines.append("const DEPARTMENTS = [")
for d in DEPARTMENTS:
    lines.append("  {")
    lines.append(f'    slug: {js_str(d["slug"])},')
    lines.append(f'    name: {js_str(d["name"])},')
    lines.append(f'    icon: {js_str(d["icon"])},')
    lines.append(f'    tagline: {js_str(d["tagline"])},')
    lines.append(f'    description: {js_str(d["description"])},')
    lines.append("  },")
lines.append("];")
lines.append("")
lines.append("const COURSES_RAW = [")

missing_pdf = []
for c in COURSES_META:
    slug = c["slug"]
    pdf_key = PDF_MAP.get(slug)
    core_modules = load(pdf_key) if pdf_key else []
    if not core_modules:
        missing_pdf.append(slug)
    category = c["category"]
    closing_var = f"CLOSING_MODULES.{category}"
    salary = SALARY.get(slug)
    salary_js = js_str(salary) if salary else "null"

    lines.append("  {")
    lines.append(f'    slug: {js_str(slug)}, name: {js_str(c["name"])}, departments: {js_list(c["departments"])}, category: {js_str(category)},')
    lines.append(f'    shortDescription: {js_str(c["shortDescription"])},')
    lines.append(f'    scope: {js_str(c["scope"])},')
    lines.append(f'    roles: {js_list(c["roles"])},')
    lines.append(f'    salaryRange: {salary_js},')
    lines.append(f'    duration: "2-3 months", batchSize: "20-30 students",')
    if core_modules:
        lines.append("    modules: [")
        lines.append(modules_js(core_modules))
        lines.append(f"      ...{closing_var},")
        lines.append("      CAREER_MODULE,")
        lines.append("    ],")
    else:
        lines.append("    modules: [")
        lines.append(f"      ...{closing_var},")
        lines.append("      CAREER_MODULE,")
        lines.append("    ],")
    lines.append("  },")

lines.append("];")
lines.append("")
lines.append("const COURSES = COURSES_RAW.map(c => ({ ...c, curriculum: c.modules }));")
lines.append("")
lines.append("function getDepartment(slug) { return DEPARTMENTS.find(d => d.slug === slug); }")
lines.append("function getCoursesByDepartment(slug) { return COURSES.filter(c => c.departments.includes(slug)); }")
lines.append("function getCourse(slug) { return COURSES.find(c => c.slug === slug); }")
lines.append("")

with open(OUT_JS, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print("Wrote", OUT_JS)
print("Courses without a matching PDF (kept generic closing modules only):", missing_pdf)
