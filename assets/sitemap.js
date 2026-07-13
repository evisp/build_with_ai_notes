// ==========================================================================
// Build With AI — Site Sidebar
// One shared list of every page on the site. Add a page here once and
// every page's sidebar updates automatically — nothing else to touch.
// ==========================================================================

(function () {
  "use strict";

  var SITE_SECTIONS = [
    {
      title: "Fundamentals",
      hub: "fundamentals/index.html",
      pages: [
        { key: "fundamentals/apartment-scout", title: "Tirana Apartment Scout", url: "fundamentals/apartment-scout.html", status: "live" },
        { key: "fundamentals/cv-project", title: "Personal CV Build-Along", url: "fundamentals/cv-project.html", status: "live" }
      ]
    },
    {
      title: "Week 1 — Data & Modeling",
      hub: "week-1/index.html",
      pages: [
        { key: "week-1/data-lab", title: "Data Lab", url: "week-1/data-lab.html", status: "live" },
        { key: "week-1/model-basics", title: "Model Basics", url: "week-1/model-basics.html", status: "live" }
      ]
    },
    {
      title: "Week 2 — Flask App & Analytics",
      hub: "week-2/index.html",
      pages: [
        { key: "week-2/flask-basics", title: "Flask Basics", url: "week-2/flask-basics.html", status: "live" },
        { key: "week-2/charts-maps", title: "Charts & Maps", url: "week-2/charts-maps.html", status: "live" }      ]
    },
    {
      title: "Week 3 — AI Tools & Chat",
      hub: "week-3/index.html",
      pages: [
        { key: "week-3/ai-tools", title: "AI Tool Calling", url: "week-3/ai-tools.html", status: "soon" },
        { key: "week-3/chat-widget", title: "Chat Widget", url: "week-3/chat-widget.html", status: "soon" }
      ]
    }
  ];

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function buildSidebarHTML(prefix, currentKey) {
    var sectionsHtml = SITE_SECTIONS.map(function (section) {
      var pagesHtml = section.pages.map(function (page) {
        if (page.status === "soon") {
          return (
            '<li><span class="is-disabled">' +
            escapeHtml(page.title) +
            ' <span class="optional-badge">Soon</span></span></li>'
          );
        }
        var activeClass = page.key === currentKey ? " is-active" : "";
        return (
          '<li><a class="' +
          activeClass.trim() +
          '" href="' +
          prefix +
          page.url +
          '">' +
          escapeHtml(page.title) +
          "</a></li>"
        );
      }).join("");

      var hasLivePages = section.pages.some(function (p) { return p.status === "live"; });
      var titleTag = hasLivePages
        ? '<a class="sidebar-section-title" href="' + prefix + section.hub + '">' + escapeHtml(section.title) + "</a>"
        : '<span class="sidebar-section-title is-disabled">' + escapeHtml(section.title) + "</span>";

      return (
        '<div class="sidebar-section">' + titleTag + "<ul>" + pagesHtml + "</ul></div>"
      );
    }).join("");

    var brandActive = currentKey === "index" ? " is-active" : "";

    return (
      '<button type="button" class="sidebar-toggle" id="sidebar-toggle" aria-expanded="false" aria-controls="site-sidebar" aria-label="Toggle navigation">' +
      '<span></span><span></span><span></span>' +
      "</button>" +
      '<div class="sidebar-overlay" id="sidebar-overlay"></div>' +
      '<aside class="site-sidebar" id="site-sidebar">' +
      '<a class="sidebar-brand' +
      brandActive +
      '" href="' +
      prefix +
      'index.html">Build With AI</a>' +
      '<nav class="sidebar-nav" aria-label="Site navigation">' +
      sectionsHtml +
      "</nav>" +
      "</aside>"
    );
  }

  function init() {
    var body = document.body;
    var depth = parseInt(body.dataset.depth || "0", 10);
    var currentKey = body.dataset.page || "";
    var prefix = "../".repeat(Math.max(depth, 0));

    body.insertAdjacentHTML("afterbegin", buildSidebarHTML(prefix, currentKey));

    try {
      if (window.matchMedia("(min-width: 901px)").matches &&
          localStorage.getItem("bwai-sidebar-collapsed") === "1") {
        body.classList.add("sidebar-collapsed");
      }
    } catch (e) {}

    var toggle = document.getElementById("sidebar-toggle");
    var overlay = document.getElementById("sidebar-overlay");
    var sidebar = document.getElementById("site-sidebar");

    function closeSidebar() {
      sidebar.classList.remove("is-open");
      overlay.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
    function openSidebar() {
      sidebar.classList.add("is-open");
      overlay.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }

    toggle.addEventListener("click", function () {
      var isMobile = window.matchMedia("(max-width: 900px)").matches;
      if (isMobile) {
        var isOpen = sidebar.classList.contains("is-open");
        if (isOpen) { closeSidebar(); } else { openSidebar(); }
      } else {
        var collapsed = body.classList.toggle("sidebar-collapsed");
        toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
        try { localStorage.setItem("bwai-sidebar-collapsed", collapsed ? "1" : "0"); } catch (e) {}
      }
    });
    overlay.addEventListener("click", closeSidebar);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeSidebar();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
