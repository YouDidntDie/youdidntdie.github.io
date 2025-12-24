document.addEventListener("DOMContentLoaded", () => {
  const contentEl = document.getElementById("content");
  const sidebarNav = document.querySelector("#sidebar nav");
  const menuToggle = document.getElementById("menu-toggle");

  // BOOT FAILSAFE: never allow infinite loader
setTimeout(() => {
  const boot = document.getElementById("boot");
  if (boot) boot.classList.add("hidden");
  console.warn("[YDD] Boot timeout triggered (something failed to load).");
}, 3000);
  
// absolute failsafe: never infinite boot
if (boot) {
  setTimeout(() => boot.classList.add("hidden"), 2000);
}
  // Loud errors instead of mysterious nothingness
  function die(msg, extra = "") {
    console.error("[YDD]", msg, extra);
    if (contentEl) contentEl.innerHTML = `<h2>Site Error</h2><p>${msg}</p><pre>${extra}</pre>`;
  }

  if (!contentEl) return console.error("[YDD] Missing #content in index.html");
  if (!sidebarNav) return die("Missing #sidebar nav in index.html", "Add: <aside id='sidebar'><nav></nav></aside>");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => document.body.classList.toggle("nav-open"));
  }

  fetch("data/nav.json")
    .then(r => {
      if (!r.ok) throw new Error(`nav.json fetch failed (${r.status})`);
      return r.json();
    })
    .then(navData => {
      if (!Array.isArray(navData) || navData.length === 0) {
        throw new Error("nav.json is empty or not an array");
      }

      sidebarNav.innerHTML = "";

      navData.forEach(item => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "nav-button";
        btn.textContent = item.label ?? "Untitled";

        // Support BOTH formats:
        // SPA markdown: {label, page}
        // multi-page:   {label, link}
        if (item.page) btn.dataset.page = item.page;
        if (item.link) btn.dataset.link = item.link;

        sidebarNav.appendChild(btn);
      });

      setupListeners(navData);

      const hash = window.location.hash.replace("#", "");
      const first = navData[0];
      if (hash) loadByKey(hash, navData);
      else if (first.page) loadPage(first.page);
      else if (first.link) window.location.href = first.link;
      else die("First nav item has no page or link", JSON.stringify(first, null, 2));
    })
    .catch(err => die("Failed to load navigation", err.message));

  function setupListeners(navData) {
    document.querySelectorAll(".nav-button").forEach(btn => {
      btn.addEventListener("click", () => {
        const page = btn.dataset.page;
        const link = btn.dataset.link;

        if (page) {
          window.location.hash = page;
          loadPage(page);
        } else if (link) {
          window.location.href = link;
        } else {
          die("Nav item missing page/link", btn.textContent);
        }

        if (window.innerWidth < 768) document.body.classList.remove("nav-open");
      });
    });

    window.addEventListener("hashchange", () => {
      const key = window.location.hash.replace("#", "");
      if (key) loadByKey(key, navData);
    });
  }

  function loadByKey(key, navData) {
    // allow hash to match either page name or label slug
    const hit = navData.find(i => i.page === key) || navData.find(i => slug(i.label) === key);
    if (!hit) return loadPage(key); // try direct
    if (hit.page) return loadPage(hit.page);
    if (hit.link) return (window.location.href = hit.link);
  }

  function loadPage(pageName) {
    fetch(`content/${pageName}.md`)
      .then(r => {
        if (!r.ok) throw new Error(`content/${pageName}.md not found (${r.status})`);
        return r.text();
      })
      .then(md => {
        if (typeof marked === "undefined") {
          throw new Error("marked is not defined. Add Marked CDN in <head>.");
        }
        contentEl.innerHTML = marked.parse(md);
        highlight(pageName);
      })
      .catch(err => {
        contentEl.innerHTML = `<h2>Page Not Found</h2><p>${err.message}</p>`;
        highlight(null);
        console.error("[YDD]", err);
      });
  }

  function highlight(activePage) {
    document.querySelectorAll(".nav-button").forEach(btn => {
      const isActive = btn.dataset.page === activePage;
      btn.classList.toggle("active", isActive);
      if (isActive) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
  }

  function slug(s = "") {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
});
