window.YDD = window.YDD || {};

window.YDD.loadContent = async function(file){
  const contentEl = document.getElementById("content");
  try{
    const res = await fetch(`content/${file}`, { cache: "no-cache" });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const md = await res.text();

    // Minimal markdown-ish rendering (safe + simple)
    // Replace this later with a proper markdown parser if you want.
    const html = md
      .replace(/^### (.*)$/gm, "<h3>$1</h3>")
      .replace(/^## (.*)$/gm, "<h2>$1</h2>")
      .replace(/^# (.*)$/gm, "<h1>$1</h1>")
      .replace(/^\- (.*)$/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
      .replace(/\n\n+/g, "</p><p>")
      .replace(/\n/g, "<br/>");

    contentEl.innerHTML = `<p>${html}</p>`;
    contentEl.focus();
  } catch (err){
    contentEl.innerHTML = `<h2>Content load failed</h2><p>content/${file}</p><p>${String(err)}</p>`;
  }
};
