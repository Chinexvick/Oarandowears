/* LOUDAM — small interactions. Vanilla JS, no tracking, no third-party requests. */
(function () {
  "use strict";

  /* ---- Site settings ---- */
  var CONFIG = {
    email: "info@loudam.ng",
    whatsapp: "2349014665213" // digits only, with country code. Leave empty to hide WhatsApp buttons.
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* WhatsApp links with a prefilled greeting */
  if (/^\d{8,15}$/.test(CONFIG.whatsapp)) {
    $$("[data-wa]").forEach(function (a) {
      a.hidden = false;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent("Hello LOUDAM, I'd like to talk about growing my business.");
    });
  }

  var y = $("#year"); if (y) y.textContent = String(new Date().getFullYear());

  /* Mobile menu */
  var burger = $(".burger"), menu = $("#menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  burger.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 860) setMenu(false); });

  /* Work filters */
  var fb = $$(".filters button"), projs = $$(".proj");
  fb.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-f");
      fb.forEach(function (x) { var on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); });
      projs.forEach(function (p) { p.classList.toggle("hide", !(f === "all" || p.getAttribute("data-c") === f)); });
    });
  });

  /* Pricing links prefill the proposal form */
  $$(".plans a[data-svc]").forEach(function (a) {
    a.addEventListener("click", function () {
      var t = $("#propForm textarea[name='Project description']");
      if (t && !t.value) t.value = "I'm interested in a " + a.getAttribute("data-svc") + " engagement.";
    });
  });

  /* Forms: open the visitor's email app with the details filled in */
  $$("form.form").forEach(function (form) {
    var note = $(".form__note", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = false, lines = [];
      $$("input, select, textarea", form).forEach(function (f) {
        f.removeAttribute("aria-invalid");
        if (f.required && !f.value.trim()) { f.setAttribute("aria-invalid", "true"); bad = true; }
        if (f.type === "email" && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) { f.setAttribute("aria-invalid", "true"); bad = true; }
        if (f.value.trim()) lines.push((f.name || f.id) + ": " + f.value.trim());
      });
      $$("input[type=radio][form='" + form.id + "']:checked").forEach(function (r) { lines.unshift("Session type: " + r.value); });
      if (bad) { note.className = "form__note err"; note.textContent = "Please fill in your name and a valid email address."; return; }
      window.location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(form.getAttribute("data-subject")) + "&body=" + encodeURIComponent(lines.join("\n"));
      note.className = "form__note ok";
      note.textContent = "Your email app should open with the details ready to send to " + CONFIG.email + ".";
    });
  });

  /* Highlight the current section in the menu */
  var links = $$(".nav__links a:not(.btn)");
  var secs = ["about", "services", "work", "pricing", "insights", "contact"].map(function (id) { return document.getElementById(id); });
  var ticking = false;
  function update() {
    ticking = false;
    var active = "";
    secs.forEach(function (s) { if (s && s.getBoundingClientRect().top < window.innerHeight * 0.35) active = s.id; });
    links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + active); });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();
