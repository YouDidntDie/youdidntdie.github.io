// main.js

document.addEventListener("DOMContentLoaded", function () {
  const contentEl = document.getElementById("content");
  const navLinks = document.querySelectorAll(".nav-button");

  // Grab the hash part from URL
  let page = window.location.hash.replace("#", "") || "fire";
  loadPage(page);

  // Handle nav clicks
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetPage = this.getAttribute("data-page");
      if (!targetPage) return;
      window.location.hash = targetPage;
      loadPage(targetPage);
      // Collapse nav if mobile
      if (window.innerWidth < 768) {
        document.body.classList.remove("nav-open");
      }
    });
  });

  // Load the Markdown file
  function loadPage(pageName) {
    fetch(`content/${pageName}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("404: Markdown not found.");
        return res.text();
      })
      .then((md) => {
        contentEl.innerHTML = marked(md);
        highlightNav(pageName);
      })
      .catch((err) => {
        contentEl.innerHTML = `<h2>Page Not Found</h2><p>${err.message}</p>`;
        highlightNav(null);
      });
  }

  // Highlight the active page in nav
  function highlightNav(activePage) {
    navLinks.forEach((btn) => {
      if (btn.getAttribute("data-page") === activePage) {
        btn.classList.add("active");
        btn.setAttribute("aria-current", "page");
      } else {
        btn.classList.remove("active");
        btn.removeAttribute("aria-current");
      }
    });
  }

  // Optional: Live hash change support
  window.addEventListener("hashchange", function () {
    const newPage = window.location.hash.replace("#", "") || "fire";
    loadPage(newPage);
  });
});