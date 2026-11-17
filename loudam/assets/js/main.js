/* LOUDAM — interactions. Vanilla JS, no tracking, no third-party requests. */
(function () {
  "use strict";

  /* ---- Site settings: fill these in when you have the details ---- */
  var CONFIG = {
    email: "info@loudam.ng",
    whatsapp: "2349014665213" // digits only with country code, e.g. "2348012345678". Leave empty to hide WhatsApp buttons.
  };

  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  doc.classList.add("js");

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* WhatsApp (only shown when a number is configured) */
  if (/^\d{8,15}$/.test(CONFIG.whatsapp)) {
    $$("[data-wa]").forEach(function (a) {
      a.hidden = false;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent("Hello LOUDAM, I'd like to talk about growing my business.");
    });
  }

  var y = $("#year"); if (y) y.textContent = String(new Date().getFullYear());

  /* ---- Intro ---- */
  function start() { requestAnimationFrame(function () { doc.classList.add("ld"); }); }
  if (document.readyState === "complete") start(); else window.addEventListener("load", start);
  setTimeout(start, 1800);

  /* ---- Mobile menu ---- */
  var burger = $(".burger"), sheet = $("#sheet"), nav = $(".nav");
  function setMenu(open) {
    sheet.classList.toggle("open", open);
    sheet.setAttribute("aria-hidden", open ? "false" : "true");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("locked", open);
  }
  burger.addEventListener("click", function () { setMenu(!sheet.classList.contains("open")); });
  $$("a", sheet).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 1020) setMenu(false); });

  /* ---- Reveal on scroll ---- */
  var rev = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    rev.forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 0.07 + "s"; io.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add("in"); }); }

  /* ---- Accordions: one service open at a time ---- */
  var svc = $$(".svc");
  svc.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) svc.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---- Work filters ---- */
  var fb = $$(".filters button"), projs = $$(".proj"), rail = $(".rail");
  fb.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-f");
      fb.forEach(function (x) { var on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); });
      projs.forEach(function (p) { var show = f === "all" || p.getAttribute("data-c") === f; p.classList.toggle("hide", !show); if (show) p.classList.add("in"); });
      if (rail) rail.scrollTo({ left: 0, behavior: reduce ? "auto" : "smooth" });
    });
  });
  // drag-to-scroll with a mouse
  if (rail) {
    var down = false, sx = 0, sl = 0;
    rail.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; sx = e.clientX; sl = rail.scrollLeft; rail.style.scrollSnapType = "none"; });
    window.addEventListener("pointerup", function () { if (down) { down = false; rail.style.scrollSnapType = ""; } });
    window.addEventListener("pointermove", function (e) { if (down) rail.scrollLeft = sl - (e.clientX - sx); });
  }

  /* ---- Pricing links preselect the proposal form ---- */
  $$(".plan a[data-svc]").forEach(function (a) {
    a.addEventListener("click", function () {
      var t = $("#propForm textarea[name='Project description']");
      if (t && !t.value) t.value = "I'm interested in a " + a.getAttribute("data-svc") + " engagement.";
    });
  });

  /* ---- Forms: open the visitor's email app with the details filled in ---- */
  $$("form.form").forEach(function (form) {
    var note = $(".form__note", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = false, lines = [];
      $$("input, select, textarea", form).forEach(function (f) {
        f.removeAttribute("aria-invalid");
        if (f.required && !f.value.trim()) { f.setAttribute("aria-invalid", "true"); bad = true; }
        if (f.type === "email" && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) { f.setAttribute("aria-invalid", "true"); bad = true; }
        if (f.type === "radio") { if (f.checked) lines.push("Session type: " + f.value); return; }
        if (f.value.trim()) lines.push((f.name || f.id) + ": " + f.value.trim());
      });
      // radio inputs outside the form element (linked by the form attribute)
      $$("input[type=radio][form='" + form.id + "']:checked").forEach(function (r) { lines.unshift("Session type: " + r.value); });
      if (bad) { note.className = "form__note err"; note.textContent = "Please fill in your name and a valid email address."; return; }
      var subject = form.getAttribute("data-subject");
      var body = lines.join("\n");
      window.location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      note.className = "form__note ok";
      note.textContent = "Your email app should open with the details ready to send to " + CONFIG.email + ".";
    });
  });

  /* ---- Scroll effects ---- */
  var hero = $(".hero"), bar = $(".progress span");
  var links = $$(".nav__links a"), dockLinks = $$(".dock a:not(.dock__main)");
  var secIds = ["about", "services", "work", "pricing", "insights", "contact"];
  var secs = secIds.map(function (id) { return document.getElementById(id); });
  var ticking = false, lastY = 0;

  function update() {
    ticking = false;
    var sy = window.scrollY, vh = window.innerHeight;
    var max = doc.scrollHeight - vh;
    if (bar) doc.style.setProperty("--sp", max > 0 ? (sy / max).toFixed(4) : 0);
    nav.classList.toggle("sc", sy > 24);
    if (hero && !reduce) doc.style.setProperty("--hp", Math.min(1, sy / (hero.offsetHeight * 0.9)).toFixed(3));
    var active = "";
    secs.forEach(function (s) { if (s && s.getBoundingClientRect().top < vh * 0.4) active = s.id; });
    links.concat(dockLinks).forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + active); });
    lastY = sy;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
})();
