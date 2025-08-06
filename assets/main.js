document.addEventListener("DOMContentLoaded", () => {
  const contentEl = document.getElementById("content");
  const navEl = document.querySelector("nav");
  const clickSound = document.getElementById("click-sound");

  // Load navigation
  fetch("data/nav.json")
    .then((res) => res.json())
    .then((navData) => {
      navEl.innerHTML = ""; // Clear nav before rebuilding
      buildNav(navData);
      handleHashChange(); // Load the section if there's a hash
    });

  function buildNav(navData) {
    navData.forEach((item) => {
      const btn = createNavButton(item.title, item.section, false);
      navEl.appendChild(btn);

      if (item.sub && item.sub.length) {
        const subContainer = document.createElement("div");
        subContainer.classList.add("sub-menu");

        item.sub.forEach((subItem) => {
          const subBtn = createNavButton(subItem.title, subItem.section, true);
          subContainer.appendChild(subBtn);
        });

        navEl.appendChild(subContainer);
      }
    });

    navEl.addEventListener("click", (e) => {
      const button = e.target.closest("button[data-section]");
      if (!button) return;

      const section = button.dataset.section;
      if (section) {
        location.hash = section;
        if (window.innerWidth < 700) toggleNav(false); // close sidebar on mobile
      }
    });
  }

  function createNavButton(title, section, isSub = false) {
    const btn = document.createElement("button");
    btn.textContent = isSub ? "↳ " + title : title;
    btn.dataset.section = section;
    btn.classList.add(isSub ? "sub-link" : "nav-link");
    return btn;
  }

  function handleHashChange() {
    const section = location.hash?.replace("#", "") || "start";
    loadSection(section);
    highlightActive(section);
    expandSubMenu(section);
  }

  function loadSection(section) {
    fetch(`content/${section}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Content not found");
        return res.text();
      })
      .then((markdown) => {
        contentEl.innerHTML = marked.parse(markdown);
        contentEl.scrollTop = 0;
        contentEl.focus();
        playClick();
      })
      .catch(() => {
        contentEl.innerHTML = "<h2>404 Survival Tip Not Found</h2>";
      });
  }

  function highlightActive(section) {
    const buttons = navEl.querySelectorAll("button[data-section]");
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.section === section);
    });
  }

  function expandSubMenu(section) {
    const allSubMenus = navEl.querySelectorAll(".sub-menu");
    allSubMenus.forEach((sub) => (sub.style.display = "none"));

    const activeBtn = navEl.querySelector(`button[data-section="${section}"]`);
    if (activeBtn && activeBtn.classList.contains("sub-link")) {
      const subMenu = activeBtn.closest(".sub-menu");
      if (subMenu) subMenu.style.display = "block";
    }
  }

  function playClick() {
    if (!clickSound) return;
    clickSound.currentTime = 0;
    clickSound.play();
  }

  window.addEventListener("hashchange", handleHashChange);

  // Mobile nav toggle (optional — you'd need a toggle button in HTML)
  const navToggleBtn = document.getElementById("nav-toggle");
  if (navToggleBtn) {
    navToggleBtn.addEventListener("click", () => {
      toggleNav();
    });
  }

  function toggleNav(forceState = null) {
    const isOpen = navEl.classList.contains("open");
    const shouldOpen = forceState !== null ? forceState : !isOpen;
    navEl.classList.toggle("open", shouldOpen);
  }
});