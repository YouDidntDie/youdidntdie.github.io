document.addEventListener("DOMContentLoaded", function () {
  const contentEl = document.getElementById("content");
  const navLinks = document.querySelectorAll(".nav-button");

  // Grab hash from URL
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

      // Collapse nav on mobile
      if (window.innerWidth < 768) {
        document.body.classList.remove("nav-open");
      }
    });
  });

  // Hamburger toggle
  const menuToggle = document.getElementById("menu-toggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });
  }

  // Load markdown content
  function loadPage(pageName) {
    fetch(`content/${pageName}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("404: Markdown not found.");
        return res.text();
      })
      .then((md) => {
        contentEl.innerHTML = marked.parse(md);
        highlightNav(pageName);
      })
      .catch((err) => {
        contentEl.innerHTML = `<h2>Page Not Found</h2><p>${err.message}</p>`;
        highlightNav(null);
      });
  }

  // Highlight nav button
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

  // Support hashchange navigation
  window.addEventListener("hashchange", function () {
    const newPage = window.location.hash.replace("#", "") || "fire";
    loadPage(newPage);
  });
});