/* Orlando Wears — interactions & scroll animation
   Vanilla JS, no dependencies, no tracking, no network requests. */
(function () {
  "use strict";

  var WA_NUMBER = "2348141273507";
  var doc = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  doc.classList.add("js");

  /* ---------- WhatsApp links with a pre-filled message ---------- */
  function waLink(msg) {
    return "https://wa.me/" + WA_NUMBER + (msg ? "?text=" + encodeURIComponent(msg) : "");
  }
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.setAttribute("href", waLink(a.getAttribute("data-wa")));
  });

  /* ---------- Year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector(".burger");
  var menu = document.getElementById("menu");
  function closeMenu() {
    menu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------- Hero arch carousel ---------- */
  var LOOKS = [
    { img: "look-cream", name: "Cream Knit Polo" },
    { img: "look-stripe", name: "Striped Knit Polo" },
    { img: "look-lounge", name: "Textured Knit Polo" },
    { img: "look-street", name: "OW Signature Tee" },
    { img: "look-mono", name: "Cocoa Monochrome Set" },
    { img: "look-zip", name: "Tipped Zip Polo" },
    { img: "look-white", name: "Crisp White Shirt" },
    { img: "look-coat", name: "Camel Overcoat" }
  ];
  var arches = document.querySelector(".arches");
  var track = arches && arches.querySelector(".arches__track");
  var glass = arches && arches.querySelector(".glass");
  var current = 0;
  var archEls = [];

  function slotFor(i) {
    var n = LOOKS.length, half = Math.floor(n / 2);
    return ((i - current + n + half) % n) - half;
  }
  function renderArches() {
    archEls.forEach(function (el, i) {
      var s = slotFor(i);
      el.setAttribute("data-slot", String(s));
      el.setAttribute("aria-hidden", Math.abs(s) > 2 ? "true" : "false");
    });
    var look = LOOKS[current];
    if (glass) {
      glass.querySelector(".glass__name").textContent = look.name;
      glass.querySelector(".glass__thumb img").src = "/assets/img/" + look.img + "-480.webp";
      glass.href = waLink("Hello Orlando Wears, I'm interested in the " + look.name + " look.");
      glass.setAttribute("aria-label", "Shop the look: " + look.name + " on WhatsApp");
    }
  }
  function go(dir) {
    current = (current + dir + LOOKS.length) % LOOKS.length;
    renderArches();
  }

  if (track) {
    LOOKS.forEach(function (look, i) {
      var fig = document.createElement("figure");
      fig.className = "arch";
      var img = document.createElement("img");
      img.src = "/assets/img/" + look.img + "-480.webp";
      img.alt = look.name;
      img.width = 480; img.height = 640;
      img.decoding = "async";
      if (i > 2 && i < LOOKS.length - 2) img.loading = "lazy";
      fig.appendChild(img);
      fig.addEventListener("click", function () {
        var s = slotFor(i);
        if (s !== 0) go(s > 0 ? 1 : -1);
      });
      track.appendChild(fig);
      archEls.push(fig);
    });
    if (!reduceMotion) arches.classList.add("is-pre");
    renderArches();

    arches.querySelector(".arrow--prev").addEventListener("click", function () { go(-1); restartAuto(); });
    arches.querySelector(".arrow--next").addEventListener("click", function () { go(1); restartAuto(); });

    // swipe
    var sx = null;
    arches.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    arches.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) { go(dx < 0 ? 1 : -1); restartAuto(); }
      sx = null;
    }, { passive: true });

    // autoplay (only while visible, never with reduced motion)
    var timer = null, heroVisible = true, hovering = false;
    function restartAuto() {
      clearInterval(timer);
      if (reduceMotion) return;
      timer = setInterval(function () { if (heroVisible && !hovering && !document.hidden) go(1); }, 4800);
    }
    arches.addEventListener("mouseenter", function () { hovering = true; });
    arches.addEventListener("mouseleave", function () { hovering = false; });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; }).observe(arches);
    }
    restartAuto();
  }

  /* ---------- Intro ---------- */
  function start() {
    requestAnimationFrame(function () {
      doc.classList.add("is-loaded");
      setTimeout(function () { if (arches) arches.classList.remove("is-pre"); }, 250);
    });
  }
  if (document.readyState === "complete") start(); else window.addEventListener("load", start);
  setTimeout(start, 2500); // never hold content hostage to a slow image

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = ((i % 4) * 0.08) + "s";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Collection filters ---------- */
  var filterBtns = document.querySelectorAll(".filters button");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      document.querySelectorAll(".grid .card").forEach(function (c) {
        var show = f === "all" || c.getAttribute("data-cat") === f;
        c.classList.toggle("is-hidden", !show);
        if (show) c.classList.add("in");
      });
    });
  });

  /* ---------- Scroll-driven "film" + parallax ---------- */
  var nav = document.querySelector(".nav");
  var hero = document.querySelector(".hero");
  var film = document.querySelector(".film");
  var scenes = film ? Array.prototype.slice.call(film.querySelectorAll(".film__scene")) : [];
  var sceneImgs = scenes.map(function (s) { return s.querySelector("img"); });
  var caps = film ? film.querySelectorAll(".film__cap") : [];
  var countEl = film && film.querySelector(".film__count b");
  var stage = film && film.querySelector(".film__stage");
  var dets = document.querySelectorAll(".det[data-speed]");
  var waFloat = document.querySelector(".wa-float");
  var navLinks = document.querySelectorAll(".nav__links a");
  var sections = ["collection", "film", "details", "contact"].map(function (id) { return document.getElementById(id); });

  var lastY = window.scrollY, activeCap = -1, ticking = false;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return 1 - Math.pow(1 - t, 3); }

  function update() {
    ticking = false;
    var sy = window.scrollY, vh = window.innerHeight;

    // header state
    if (nav) {
      nav.classList.toggle("is-scrolled", sy > 30);
      var menuOpen = menu && menu.classList.contains("is-open");
      nav.classList.toggle("is-hidden", !menuOpen && sy > vh * 0.9 && sy > lastY + 2);
      if (sy < lastY - 2) nav.classList.remove("is-hidden");
    }
    if (waFloat) waFloat.classList.toggle("is-on", sy > vh * 0.6);
    lastY = sy;

    if (reduceMotion) return;

    // hero progress
    if (hero) {
      var hp = clamp(sy / (hero.offsetHeight * 0.8), 0, 1);
      hero.style.setProperty("--hp", hp.toFixed(4));
    }

    // film: map scroll through the section to scenes
    if (film) {
      var r = film.getBoundingClientRect();
      var total = film.offsetHeight - vh;
      var p = clamp(-r.top / total, 0, 1);
      stage.style.setProperty("--fp", p.toFixed(4));
      if (r.bottom > 0 && r.top < vh) {
        var n = scenes.length;
        var pos = p * (n - 0.6); // 0 .. n-0.6 : short hold on the final scene
        for (var i = 0; i < n; i++) {
          // scene i wipes in (bottom -> top) while pos goes from i-0.6 to i,
          // then holds while the camera keeps pushing in
          var enter = i === 0 ? 1 : ease(clamp((pos - (i - 0.6)) / 0.6, 0, 1));
          var life = clamp((pos - i + 1) / 2, 0, 1); // slow camera push over its lifetime
          if (i > 0) {
            var inset = (1 - enter) * 100;
            scenes[i].style.clipPath = "inset(" + inset.toFixed(2) + "% 0 0 0)";
          }
          var scale = 1.22 - life * 0.22;
          var drift = (0.5 - life) * 4;
          sceneImgs[i].style.transform = "translate3d(0," + drift.toFixed(2) + "%,0) scale(" + scale.toFixed(4) + ")";
        }
        var idx = clamp(Math.floor(pos + 0.35), 0, n - 1);
        if (idx !== activeCap) {
          activeCap = idx;
          for (var c = 0; c < caps.length; c++) caps[c].classList.toggle("is-on", c === idx);
          if (countEl) countEl.textContent = (idx + 1 < 10 ? "0" : "") + (idx + 1);
        }
      }
    }

    // details parallax
    for (var d = 0; d < dets.length; d++) {
      var rect = dets[d].parentNode.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) continue;
      var mid = rect.top + rect.height / 2 - vh / 2;
      var sp = parseFloat(dets[d].getAttribute("data-speed")) || 0;
      dets[d].style.setProperty("--py", (mid * sp).toFixed(1) + "px");
    }

    // active nav link
    var active = null;
    sections.forEach(function (s) { if (s && s.getBoundingClientRect().top < vh * 0.45) active = s.id; });
    navLinks.forEach(function (a) {
      var href = a.getAttribute("href").slice(1);
      a.classList.toggle("is-active", active ? href === active : href === "top");
    });
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();
})();
