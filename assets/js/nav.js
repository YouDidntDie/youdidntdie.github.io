(() => {
  const navEl = document.getElementById("nav");
  const toggle = document.getElementById("menu-toggle");
  const scrim = document.getElementById("scrim");

  function closeNav(){
    document.body.classList.remove("nav-open");
    document.getElementById("sidebar").setAttribute("aria-hidden","true");
    scrim.setAttribute("aria-hidden","true");
  }
  function openNav(){
    document.body.classList.add("nav-open");
    document.getElementById("sidebar").setAttribute("aria-hidden","false");
    scrim.setAttribute("aria-hidden","false");
  }

  if (toggle){
    toggle.addEventListener("click", () => {
      document.body.classList.contains("nav-open") ? closeNav() : openNav();
    });
  }
  if (scrim){
    scrim.addEventListener("click", closeNav);
  }

  async function initNav(){
    const res = await fetch("data/nav.json", { cache: "no-cache" });
    const items = await res.json();

    navEl.innerHTML = "";
    items.forEach(item => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = item.label;
      btn.dataset.file = item.file;
      btn.addEventListener("click", () => {
        if (!item.file) return;
        window.YDD.loadContent(item.file);
        // close drawer on mobile
        if (window.matchMedia("(max-width: 899px)").matches) closeNav();
      });
      navEl.appendChild(btn);
    });

    // load default page
    window.YDD.loadContent(items?.[0]?.file || "home.md");
  }

  initNav().catch(err => {
    navEl.innerHTML = `<div>Nav failed: ${String(err)}</div>`;
  });
})();
