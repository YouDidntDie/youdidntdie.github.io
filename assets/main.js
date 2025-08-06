document.addEventListener("DOMContentLoaded", function () {
  const contentEl = document.getElementById("content");
  const sidebar = document.querySelector("#sidebar nav");
  const menuToggle = document.getElementById("menu-toggle");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });
  }

  fetch("data/nav.json")
    .then((res) => res.json())
    .then((navData) => {
      sidebar.innerHTML = ""; // Clear
      navData.forEach((item) => {
        const btn = document.createElement("button");
        btn.classList.add("nav-button");
        btn.setAttribute("data-page", item.page);
        btn.innerText = item.label;
        sidebar.appendChild(btn);
      });

      setupNavListeners(navData);
      const page = window.location.hash.replace("#", "") || navData[0].page;
      loadPage(page);
    });

  function setupNavListeners(navData) {
    const navLinks = document.querySelectorAll(".nav-button");

    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        const targetPage = this.getAttribute("data-page");
        if (!targetPage) return;
        window.location.hash = targetPage;
        loadPage(targetPage);
        if (window.innerWidth < 768) {
          document.body.classList.remove("nav-open");
        }
      });
    });

    window.addEventListener("hashchange", function () {
      const newPage = window.location.hash.replace("#", "") || navData[0].page;
      loadPage(newPage);
    });
  }

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

  function highlightNav(activePage) {
    const navLinks = document.querySelectorAll(".nav-button");
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
});