// ==========================================================================
// Your Personal CV — Build Log
// All state is in-memory only (no storage APIs) — the page resets fresh
// for every class run, not persisted between sessions.
// ==========================================================================

(function () {
  "use strict";

  /* ---------- Reveal / hide toggles ---------- */
  var revealButtons = document.querySelectorAll(".reveal-btn");

  revealButtons.forEach(function (btn) {
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

  /* ---------- Progress tracking: core steps vs. stretch steps ---------- */
  var coreCheckboxes = document.querySelectorAll(
    ".phase:not(.stretch-section) .done-checkbox"
  );
  var stretchCheckboxes = document.querySelectorAll(
    ".stretch-section .done-checkbox"
  );

  var progressCount = document.getElementById("progress-count");
  var progressFill = document.getElementById("progress-fill");
  var stretchCount = document.getElementById("stretch-count");

  function updateCoreProgress() {
    var checked = document.querySelectorAll(
      ".phase:not(.stretch-section) .done-checkbox:checked"
    ).length;
    if (progressCount) progressCount.textContent = String(checked);
    if (progressFill) {
      var pct = coreCheckboxes.length ? (checked / coreCheckboxes.length) * 100 : 0;
      progressFill.style.width = pct + "%";
    }
  }

  function updateStretchProgress() {
    var checked = document.querySelectorAll(
      ".stretch-section .done-checkbox:checked"
    ).length;
    if (stretchCount) stretchCount.textContent = String(checked);
  }

  coreCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", updateCoreProgress);
  });
  stretchCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", updateStretchProgress);
  });

  updateCoreProgress();
  updateStretchProgress();

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
