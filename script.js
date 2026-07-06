// ==========================================================================
// Tirana Apartment Scout — Build Log
// All state is in-memory only (no storage APIs) — the page is meant to be
// reset for every class run, not persisted between sessions.
// ==========================================================================

(function () {
  "use strict";

  /* ---------- Reveal / hide toggles ---------- */
  var revealButtons = document.querySelectorAll(".reveal-btn");

  revealButtons.forEach(function (btn) {
    // Remember each button's original label so we can restore it on hide.
    btn.dataset.showLabel = btn.textContent.trim();
    btn.dataset.hideLabel = btn.textContent.trim().replace(/^Reveal/, "Hide");

    btn.addEventListener("click", function () {
      var panelId = btn.getAttribute("aria-controls");
      var panel = document.getElementById(panelId);
      if (!panel) return;

      var isOpen = btn.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        panel.hidden = true;
        btn.setAttribute("aria-expanded", "false");
        btn.textContent = btn.dataset.showLabel;
      } else {
        panel.hidden = false;
        btn.setAttribute("aria-expanded", "true");
        btn.textContent = btn.dataset.hideLabel;
        // Bring a fully collapsed card into view if the panel opened
        // below the fold of a short viewport.
        window.requestAnimationFrame(function () {
          var rect = panel.getBoundingClientRect();
          var offscreen = rect.bottom > window.innerHeight;
          if (offscreen) {
            panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        });
      }
    });
  });

  /* ---------- Progress tracking ---------- */
  var doneCheckboxes = document.querySelectorAll(".done-checkbox");
  var progressCount = document.getElementById("progress-count");
  var progressFill = document.getElementById("progress-fill");
  var totalSteps = doneCheckboxes.length;

  function updateProgress() {
    var checked = document.querySelectorAll(".done-checkbox:checked").length;
    if (progressCount) progressCount.textContent = String(checked);
    if (progressFill) {
      var pct = totalSteps ? (checked / totalSteps) * 100 : 0;
      progressFill.style.width = pct + "%";
    }
  }

  doneCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", updateProgress);
  });

  updateProgress(); // set initial 0 / N state

  /* ---------- Scrollspy: highlight the active phase in the nav ---------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".phase-nav a")
  );
  var phaseSections = Array.prototype.slice.call(
    document.querySelectorAll(".phase")
  );

  if ("IntersectionObserver" in window && phaseSections.length && navLinks.length) {
    var linksById = {};
    navLinks.forEach(function (link) {
      linksById[link.getAttribute("href").replace("#", "")] = link;
    });

    var observer = new IntersectionObserver(
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

    phaseSections.forEach(function (section) { observer.observe(section); });
  }
})();
