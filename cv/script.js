// ==========================================================================
// Evis Plaku — CV Site
// ==========================================================================

(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var navList = document.getElementById("nav-list");

  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      var isOpen = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navList.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navList.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scrollspy: highlight the active section in the nav ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-list a"));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main .section"));

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    var linksById = {};
    navLinks.forEach(function (link) {
      linksById[link.getAttribute("href").replace("#", "")] = link;
    });

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = linksById[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.removeAttribute("aria-current"); });
            link.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- Reveal-on-scroll fade-in ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal-on-scroll"));

  if ("IntersectionObserver" in window && revealEls.length) {
    var reveal = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { reveal.observe(el); });
  } else {
    // No IntersectionObserver support: just show everything.
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
