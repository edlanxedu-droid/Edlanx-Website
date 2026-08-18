import re
from pathlib import Path

ROOT = Path(r"D:\edlanx-website")

ROOT_LEVEL_FILES = ["index.html", "about.html", "pricing.html", "register.html", "course.html"]
DEPT_FILES = ["departments/index.html", "departments/department.html"]
ADMIN_FILES = ["admin/index.html", "admin/settings.html", "admin/emails.html", "admin/account.html", "admin/login.html"]

def sub_common(text, dept_prefix, course_prefix):
    # departments/department.html?slug=X or department.html?slug=X (dept_prefix handles either)
    text = re.sub(r'href="' + dept_prefix + r'department\.html\?slug=([a-z0-9-]+)"', r'href="/departments/\1"', text)
    text = re.sub(r"'" + dept_prefix + r"department\.html\?slug=\$\{([^}]+)\}'", r"'/departments/${\1}'", text)
    text = re.sub(r'"' + dept_prefix + r'department\.html\?slug=\$\{([^}]+)\}"', r'"/departments/${\1}"', text)
    # course.html?slug=X (with optional ../ prefix)
    text = re.sub(r'href="' + course_prefix + r'course\.html\?slug=\$\{([^}]+)\}"', r'href="/courses/${\1}"', text)
    text = re.sub(r'href="' + course_prefix + r'course\.html\?slug=([a-z0-9-]+)"', r'href="/courses/\1"', text)
    return text

def process_root(path):
    text = path.read_text(encoding="utf-8")
    text = sub_common(text, dept_prefix="departments/", course_prefix="")
    text = text.replace('href="about.html"', 'href="/about"')
    text = text.replace('href="pricing.html"', 'href="/pricing"')
    text = text.replace('href="register.html"', 'href="/register"')
    text = text.replace('href="departments/index.html"', 'href="/departments"')
    path.write_text(text, encoding="utf-8")

def process_dept(path):
    text = path.read_text(encoding="utf-8")
    text = sub_common(text, dept_prefix="", course_prefix=r"\.\./")
    text = text.replace('href="../about.html"', 'href="/about"')
    text = text.replace('href="../pricing.html"', 'href="/pricing"')
    text = text.replace('href="../register.html"', 'href="/register"')
    text = text.replace('href="index.html"', 'href="/departments"')
    path.write_text(text, encoding="utf-8")

def process_admin(path):
    text = path.read_text(encoding="utf-8")
    text = text.replace('href="index.html"', 'href="/admin"')
    text = text.replace('href="settings.html"', 'href="/admin/settings"')
    text = text.replace('href="emails.html"', 'href="/admin/emails"')
    text = text.replace('href="account.html"', 'href="/admin/account"')
    text = text.replace('href="login.html"', 'href="/admin/login"')
    path.write_text(text, encoding="utf-8")

for f in ROOT_LEVEL_FILES:
    process_root(ROOT / f)
for f in DEPT_FILES:
    process_dept(ROOT / f)
for f in ADMIN_FILES:
    process_admin(ROOT / f)

print("Done")
