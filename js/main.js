/* ============================================================
   EDLANX — Site behavior (nav, reveal, accordions, lead form)
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileNav.querySelectorAll(".mobile-sub-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = btn.nextElementSibling;
        panel.classList.toggle("is-open");
        btn.classList.toggle("is-open");
      });
    });
  }

  /* ---------- Scroll reveal ----------
     Runs on DOMContentLoaded (not immediately) so it also picks up
     .reveal cards injected by inline page scripts that run after
     this file loads (e.g. department/course pages building their
     course grids from courses-data.js). */
  function initReveal() {
    const revealEls = document.querySelectorAll(".reveal:not(.is-revealed), .reveal-stagger:not(.is-revealed)");
    if (!revealEls.length) return;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
      revealEls.forEach((el) => {
        el.classList.add("is-revealed");
        io.observe(el);
      });
    } else {
      revealEls.forEach((el) => {
        el.classList.add("is-revealed", "is-visible");
      });
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReveal);
  } else {
    initReveal();
  }

  /* ---------- Generic accordion (FAQ + curriculum) ---------- */
  document.addEventListener("click", (e) => {
    const faqTrigger = e.target.closest(".faq-q");
    if (faqTrigger) {
      const item = faqTrigger.closest(".faq-item");
      const wasOpen = item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".faq-item.is-open").forEach((i) => i !== item && i.classList.remove("is-open"));
      item.classList.toggle("is-open", !wasOpen);
      return;
    }
  });

  /* ---------- Register modal ---------- */
  const modalOverlay = document.getElementById("register-modal");
  function openModal(courseName) {
    if (!modalOverlay) return;
    modalOverlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    const courseField = modalOverlay.querySelector('[name="course_interest"]');
    if (courseField && courseName) courseField.value = courseName;
    const first = modalOverlay.querySelector("input, select");
    if (first) setTimeout(() => first.focus(), 250);
  }
  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open-register]");
    if (opener) {
      e.preventDefault();
      openModal(opener.getAttribute("data-course") || "");
    }
    if (e.target.closest(".modal-close") || e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  /* ---------- Lead form submission ---------- */
  function serializeForm(form) {
    const data = {};
    new FormData(form).forEach((value, key) => { data[key] = value; });
    data.page_url = window.location.href;
    data.source = form.getAttribute("data-source") || "website";
    return data;
  }

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll("[required]").forEach((field) => {
      const errorEl = field.closest(".form-field")?.querySelector(".form-error");
      const isEmpty = !field.value || !field.value.trim();
      const isBadPhone = field.type === "tel" && field.value && !/^[0-9+\-\s()]{7,15}$/.test(field.value);
      const isBadEmail = field.type === "email" && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      if (isEmpty || isBadPhone || isBadEmail) {
        valid = false;
        if (errorEl) errorEl.textContent = isEmpty ? "This field is required." : isBadPhone ? "Enter a valid phone number." : "Enter a valid email address.";
      } else if (errorEl) {
        errorEl.textContent = "";
      }
    });
    return valid;
  }

  document.querySelectorAll("form[data-lead-form]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const statusEl = form.querySelector(".form-status");
      const submitBtn = form.querySelector('button[type="submit"]');
      if (statusEl) { statusEl.className = "form-status"; statusEl.textContent = ""; }

      if (!validateForm(form)) return;

      const payload = serializeForm(form);
      const originalLabel = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending..."; }

      try {
        const res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Request failed");
        form.reset();
        if (statusEl) {
          statusEl.classList.add("is-success");
          statusEl.textContent = "Thanks! Our academic counsellor will call you shortly.";
        }
        if (modalOverlay && modalOverlay.contains(form)) {
          setTimeout(closeModal, 1800);
        }
      } catch (err) {
        if (statusEl) {
          statusEl.classList.add("is-error");
          statusEl.textContent = "Something went wrong. Please call +91 93608 40496 or try again.";
        }
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
      }
    });
  });

  /* ---------- Active nav link ---------- */
  const path = window.location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll(".nav-links a, .mobile-nav > ul > li > a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href && href !== "/" && path.startsWith(href.split("?")[0])) {
      a.setAttribute("aria-current", "page");
    }
  });

  /* ---------- Scroll progress bar ---------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    const progressWrap = document.createElement("div");
    progressWrap.className = "scroll-progress";
    progressWrap.innerHTML = '<div class="scroll-progress-fill"></div>';
    document.body.appendChild(progressWrap);
    const fill = progressWrap.querySelector(".scroll-progress-fill");

    let ticking = false;
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      fill.style.transform = `scaleX(${pct})`;
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    updateProgress();
  }

  /* ---------- Custom cursor (desktop, fine-pointer only) ---------- */
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.body.classList.add("has-custom-cursor");
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    let cursorVisible = false;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      if (!cursorVisible) {
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        cursorVisible = true;
      }
    });
    document.addEventListener("mouseleave", () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      cursorVisible = false;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverSelector = "a, button, input, select, textarea, .card, .curriculum-module, .domain-card, [data-open-register]";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverSelector)) ring.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverSelector)) ring.classList.remove("is-hover");
    });
  }

  /* ---------- Stat count-up (hero stat strip) ---------- */
  const statEls = document.querySelectorAll(".stat-num[data-count]");
  if (statEls.length && "IntersectionObserver" in window) {
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        statIo.unobserve(el);
        if (reduceMotion) return;
        const target = parseFloat(el.getAttribute("data-count"));
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = 900;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target < 10 && target % 1 !== 0 ? (target * eased).toFixed(1) : Math.round(target * eased);
          el.textContent = value + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    statEls.forEach((el) => statIo.observe(el));
  }

  /* ---------- Floating decorative shapes ----------
     Positioning rule: every shape sits either in the horizontal gutter
     (left <=3% or right <=4%, safe at ANY vertical position since the
     container's own padding never lets content reach the section edge)
     or in the top/bottom padding band (top/bottom <=6%, safe at ANY
     horizontal position since section-head / grid content sits below
     that band). Never combine a mid-height position with a mid-width
     one, that's the only way a shape could drift under a card. */
  function svgDots() {
    return '<svg viewBox="0 0 46 46" fill="currentColor"><circle cx="8" cy="8" r="4"/><circle cx="26" cy="8" r="4"/><circle cx="8" cy="26" r="4"/><circle cx="26" cy="26" r="4"/></svg>';
  }
  function svgWave() {
    return '<svg viewBox="0 0 320 60" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M2 30 C 40 5, 80 55, 120 30 S 200 5, 240 30 S 300 55, 318 30"/></svg>';
  }

  const COURSE_ICONS = [
    "graduation-cap", "code", "laptop", "book-open", "lightbulb", "chart-line-up",
    "flask", "gear-six", "rocket-launch", "brain", "certificate", "atom",
    "cpu", "briefcase", "target", "puzzle-piece",
  ];

  const RECIPES = [
    [{ cls: "deco-ring", pos: "top:4%; right:2%;" }, { icon: 1, pos: "bottom:20%; left:1.5%;" }, { cls: "deco-plus", pos: "top:55%; left:1%;" }, { cls: "deco-wave", pos: "bottom:1%; right:1%;", svg: "wave" }],
    [{ cls: "deco-dot-cluster", pos: "top:3%; left:2%;", svg: "dots" }, { cls: "deco-ring-lg", pos: "bottom:3%; right:1.5%;" }, { icon: 3, pos: "top:60%; right:1%;" }, { cls: "deco-plus", pos: "bottom:45%; left:2%;" }],
    [{ cls: "deco-square", pos: "top:5%; left:1%;" }, { cls: "deco-blob", pos: "bottom:2%; right:0%;" }, { icon: 5, pos: "top:50%; left:1.5%;" }, { cls: "deco-ring", pos: "top:2%; right:3%;" }],
    [{ cls: "deco-plus", pos: "top:4%; right:2%;" }, { icon: 7, pos: "bottom:18%; left:1%;" }, { cls: "deco-tri", pos: "top:58%; right:1.5%;" }, { cls: "deco-wave", pos: "top:2%; left:1%;", svg: "wave" }],
    [{ icon: 9, pos: "top:3%; left:1.5%;" }, { cls: "deco-ring", pos: "bottom:4%; right:2%;" }, { cls: "deco-dot-cluster", pos: "top:62%; left:1%;", svg: "dots" }, { cls: "deco-square", pos: "bottom:35%; right:1%;" }],
    [{ cls: "deco-tri", pos: "top:5%; left:2%;" }, { icon: 11, pos: "bottom:3%; right:1.5%;", lg: true }, { cls: "deco-square", pos: "top:55%; right:1%;" }, { cls: "deco-ring-lg", pos: "top:1%; left:0%;" }],
  ];
  const COLORS_LIGHT = ["var(--color-cta)", "var(--black-900)", "var(--gray-500)"];
  const COLORS_DARK = ["var(--orange-500)", "rgba(255,255,255,0.7)"];

  const decoTargets = document.querySelectorAll(
    ".section:not(.hero):not(.course-hero):not(.dept-hero), .section-alt, .section-dark"
  );
  let iconCursor = 0;
  decoTargets.forEach((section, i) => {
    if (getComputedStyle(section).position === "static") return;
    const isDark = section.classList.contains("section-dark");
    const recipe = RECIPES[i % RECIPES.length];
    const palette = isDark ? COLORS_DARK : COLORS_LIGHT;
    recipe.forEach((shape, j) => {
      const el = document.createElement("div");
      const color = "color:" + palette[(i + j) % palette.length] + ";";
      if (shape.icon !== undefined) {
        const iconName = COURSE_ICONS[iconCursor % COURSE_ICONS.length];
        iconCursor++;
        el.className = "deco-shape deco-icon" + (shape.lg ? " is-lg" : "");
        el.innerHTML = `<i class="ph-fill ph-${iconName}"></i>`;
        el.style.cssText = shape.pos + " " + color;
      } else {
        el.className = "deco-shape " + shape.cls;
        el.style.cssText = shape.pos + " " + color;
        if (shape.svg === "dots") el.innerHTML = svgDots();
        if (shape.svg === "wave") el.innerHTML = svgWave();
      }
      section.appendChild(el);
    });
  });
})();
