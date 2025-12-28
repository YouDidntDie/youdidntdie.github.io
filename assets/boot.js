(() => {
  const linesEl = document.getElementById("boot-lines");
  const barEl = document.getElementById("boot-progress");

  const lines = [
    "Initializing mortality denial protocol… OK",
    "Loading sarcasm module… OK",
    "Verifying oxygen privileges… OK",
    "Scanning inventory: hope… NOT FOUND",
    "Mounting survival database… OK",
    "Injecting fear into common sense… OK",
    "Boot sequence: legally distinct from competence… OK"
  ];

  let i = 0;
  let p = 0;

  function addLine(text){
    const div = document.createElement("div");
    div.textContent = `> ${text}`;
    linesEl.appendChild(div);
  }

  function tick(){
    // progress creeps, lies, and jumps like a real boot screen
    p += Math.random() * 12;
    if (p > 100) p = 100;
    barEl.style.width = `${p}%`;

    if (i < lines.length && Math.random() > 0.25){
      addLine(lines[i++]);
    }

    if (p >= 100){
      // finish
      addLine("Handing control to user interface… OK");
      document.body.classList.add("boot-complete");
      document.getElementById("app").setAttribute("aria-hidden","false");
      return;
    }
    setTimeout(tick, 180 + Math.random()*220);
  }

  // Start
  setTimeout(tick, 350);
})();
