/* LOUDAM — small interactions. No tracking, no third-party requests. */
(function () {
  "use strict";
  var CONFIG = {
    email: "info@loudam.ng",
    whatsapp: "2349014665213" // digits only, with country code. Leave empty to hide WhatsApp buttons.
  };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* WhatsApp */
  if (/^\d{8,15}$/.test(CONFIG.whatsapp)) {
    $$("[data-wa]").forEach(function (a) {
      a.hidden = false; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent("Hello LOUDAM, I'd like to talk about growing my business.");
    });
  }
  var y = $("#year"); if (y) y.textContent = String(new Date().getFullYear());

  /* Header turns solid after scrolling */
  var bar = $(".bar");
  function onScroll() { bar.classList.toggle("sc", window.scrollY > 24); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Subtle reveal on scroll */
  var rv = $$(".choice, .svc, .proj, .plans article, .topics article, .steps li, .trio > div, .cta__in, .reach, .head");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
    rv.forEach(function (el) { el.classList.add("rv"); io.observe(el); });
  }

  /* Menu (mobile) */
  var btn = $(".menu-btn"), menu = $("#menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.firstElementChild.textContent = open ? "Close" : "Menu";
    document.body.classList.toggle("noscroll", open);
    document.body.classList.toggle("menu-open", open);
  }
  btn.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 900) setMenu(false); });

  /* Work filters */
  var fb = $$(".filters button"), projs = $$(".proj");
  fb.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-f");
      fb.forEach(function (x) { var on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); });
      projs.forEach(function (p) { p.classList.toggle("hide", !(f === "all" || p.getAttribute("data-c") === f)); });
    });
  });

  /* Pricing: remember which plan was chosen */
  $$("a[data-svc]").forEach(function (a) {
    a.addEventListener("click", function () { try { sessionStorage.setItem("plan", a.getAttribute("data-svc")); } catch (e) {} });
  });

  /* Contact tabs (#book / #proposal) */
  var tabs = $$(".tabs button");
  if (tabs.length) {
    var show = function (id) {
      tabs.forEach(function (t) {
        var on = t.getAttribute("aria-controls") === id;
        t.setAttribute("aria-selected", on ? "true" : "false");
        $("#" + t.getAttribute("aria-controls")).hidden = !on;
      });
    };
    tabs.forEach(function (t) { t.addEventListener("click", function () { var id = t.getAttribute("aria-controls"); show(id); history.replaceState(null, "", "#" + id); }); });
    var h = location.hash.slice(1);
    show(h === "proposal" ? "proposal" : "book");
    var plan = null; try { plan = sessionStorage.getItem("plan"); } catch (e) {}
    var t = $("#propForm textarea[name='Project description']");
    if (plan && h === "proposal" && t && !t.value) t.value = "I'm interested in a " + plan + " engagement.";
    window.addEventListener("hashchange", function () { var x = location.hash.slice(1); if (x === "book" || x === "proposal") show(x); });
  }

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
})();
