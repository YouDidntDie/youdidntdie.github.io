document.addEventListener("DOMContentLoaded", function () {
  const contentEl = document.getElementById("content");
  const sidebarNav = document.querySelector("#sidebar nav");
  const menuToggle = document.getElementById("menu-toggle");

  // Boot elements (optional)
  const boot = document.getElementById("boot");
  const bootLines = document.getElementById("boot-lines");
  const bootFill = document.getElementById("boot-fill");

  // Guard rails: if core containers missing, don't crash
  if (!contentEl || !sidebarNav) {
    console.error("Missing required DOM elements: #content and/or #sidebar nav");
    return;
  }

  // Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });
  }

  // Boot sequence (runs even if fetch fails)
  runBoot();

  fetch("data/nav.json")
    .then((res) => {
      if (!res.ok) throw new Error("nav.json not found");
      return res.json();
    })
    .then((navData) => {
      sidebarNav.innerHTML = ""; // Clear
      navData.forEach((item) => {
        const btn = document.createElement("button");
        btn.classList.add("nav-button");
        btn.setAttribute("data-page", item.page);
        btn.type = "button";
        btn.innerText = item.label;
        sidebarNav.appendChild(btn);
      });

      setupNavListeners(navData);

      const page = window.location.hash.replace("#", "") || navData[0]?.page || "Basics";
      loadPage(page);
    })
    .catch((err) => {
      contentEl.innerHTML = `<h2>Navigation failed</h2><p>${err.message}</p>
      <p>Check that <code>data/nav.json</code> exists and you're running a local server (not file://).</p>`;
      console.error(err);
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
      const newPage = window.location.hash.replace("#", "") || navData[0]?.page;
      if (newPage) loadPage(newPage);
    });
  }

  function loadPage(pageName) {
    fetch(`content/${pageName}.md`)
      .then((res) => {
        if (!res.ok) throw new Error(`404: ${pageName}.md not found`);
        return res.text();
      })
      .then((md) => {
        // Marked must exist
        if (typeof marked === "undefined") {
          throw new Error("Markdown renderer missing: marked is not loaded.");
        }
        contentEl.innerHTML = marked.parse(md);
        highlightNav(pageName);
        endBoot();
      })
      .catch((err) => {
        contentEl.innerHTML = `<h2>Page Not Found</h2><p>${err.message}</p>`;
        highlightNav(null);
        endBoot();
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

  function runBoot() {
    if (!boot || !bootLines || !bootFill) return;

    const lines = [
      "Checking pulse… unfortunately detected.",
      "Loading Encyclopedia… because you clearly won’t read it.",
      "Calibrating sarcasm module… overclocked.",
      "Verifying supplies… insufficient. As expected.",
      "Initializing UI… pretending this is under control.",
    ];

    let i = 0;
    let progress = 0;

    const timer = setInterval(() => {
      if (i < lines.length) {
        bootLines.textContent += (bootLines.textContent ? "\n" : "") + lines[i];
        i++;
      }
      progress = Math.min(100, progress + 12);
      bootFill.style.width = progress + "%";

      if (progress >= 100) clearInterval(timer);
    }, 180);
  }

  function endBoot() {
    if (!boot) return;
    // small delay so it feels intentional
    setTimeout(() => boot.classList.add("hidden"), 250);
  }
});
