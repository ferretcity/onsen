import type { Plan } from '@/types'

function escapeHtmlAttr(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
}

/**
 * Builds a single, dependency-free HTML file that renders every practice in
 * the plan for whoever the group is running the practice with — mobile
 * first, no build step or server required to view it. This file is the
 * actual published output; Onsen itself is only the editor that produces
 * it.
 */
export function buildStaticSite(plan: Plan): string {
  const planJson = JSON.stringify(plan).replace(/</g, '\\u003c')
  const title = plan.organizationName || plan.practices[0]?.name || 'Onsen'

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtmlAttr(title)}</title>
<style>
  :root {
    --background: #f8f6f3;
    --foreground: #1f2a2e;
    --card: #ffffff;
    --border: #dde1e2;
    --primary: #2d7076;
    --muted: #6d7679;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--background);
    color: var(--foreground);
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  #app { max-width: 28rem; margin: 0 auto; padding-bottom: 5rem; }
  .content { padding: 1rem; }
  h1 { font-size: 1.25rem; margin: 0 0 0.25rem; }
  .muted { color: var(--muted); font-size: 0.875rem; margin: 0; }
  .back { display: inline-block; margin-bottom: 0.75rem; font-size: 0.875rem; color: var(--primary); background: none; border: none; padding: 0; font-family: inherit; }
  .slot-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--muted);
    margin: 1.5rem 0 0.5rem;
  }
  .card {
    border: 1px solid var(--border);
    background: var(--card);
    border-radius: 0.5rem;
    padding: 0.75rem;
    margin-bottom: 0.75rem;
  }
  .card.today { border-color: var(--primary); background: #eef5f5; }
  .card.clickable { cursor: pointer; }
  .item-title { display: block; font-weight: 500; }
  .item-body { display: block; font-size: 0.875rem; color: var(--muted); margin-top: 0.125rem; }
  .prompt {
    margin: 0.75rem 0 0;
    padding-left: 0.75rem;
    border-left: 2px solid rgba(45, 112, 118, 0.4);
    font-size: 0.875rem;
    font-style: italic;
    color: var(--primary);
  }
  .row { display: flex; gap: 0.5rem; font-size: 0.875rem; color: var(--muted); }
  .row strong { width: 4.5rem; flex-shrink: 0; color: var(--foreground); font-weight: 500; }
  .today-badge { margin-left: 0.5rem; font-size: 0.75rem; font-weight: 400; color: var(--primary); }
  .stepper { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
  .stepper button {
    border: 1px solid var(--border);
    background: var(--card);
    border-radius: 0.375rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-family: inherit;
    color: var(--foreground);
  }
  .stepper button:disabled { opacity: 0.4; }
  input[type="search"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    background: var(--card);
    color: var(--foreground);
  }
  nav.tabs {
    position: fixed;
    inset-inline: 0;
    bottom: 0;
    max-width: 28rem;
    margin: 0 auto;
    display: flex;
    border-top: 1px solid var(--border);
    background: var(--card);
  }
  nav.tabs button {
    flex: 1;
    padding: 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    background: none;
    border: none;
    color: var(--muted);
    font-family: inherit;
  }
  nav.tabs button.active { color: var(--primary); }
</style>
</head>
<body>
<div id="app"></div>
<script>
const PLAN = ${planJson};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

function currentCycleDay(occasionCount) {
  const dayOfMonth = new Date().getDate();
  return ((dayOfMonth - 1) % occasionCount) + 1;
}

function findPractice(id) {
  return PLAN.practices.filter(function (c) { return c.id === id; })[0];
}

function renderOccasion(practice, index) {
  const occasion = practice.occasions[index] || {};
  let html = "";
  practice.slots.forEach(function (slot) {
    const items = occasion[slot.id] || [];
    if (!items.length) return;
    html += "<h2 class=\\"slot-label\\">" + escapeHtml(slot.label) + "</h2>";
    items.forEach(function (item) {
      html += "<div class=\\"card\\"><span class=\\"item-title\\">" + escapeHtml(item.title) + "</span><span class=\\"item-body\\">" + escapeHtml(item.body) + "</span>";
      if (item.prompt) html += "<p class=\\"prompt\\">Talk about it: " + escapeHtml(item.prompt) + "</p>";
      html += "</div>";
    });
  });
  return html;
}

function renderCurrent(practice) {
  const isReading = practice.kind === "structured-reading";
  const index = isReading ? currentCycleDay(practice.occasionCount) - 1 : state.occasionIndex;
  const label = isReading ? "Day" : "Session";
  let html = "<header><h1>" + escapeHtml(practice.name) + "</h1><p class=\\"muted\\">" + label + " " + (index + 1) + " of " + practice.occasionCount + "</p></header>";
  if (!isReading) {
    html += "<div class=\\"stepper\\">"
      + "<button data-step=\\"-1\\"" + (index <= 0 ? " disabled" : "") + ">Prev</button>"
      + "<button data-step=\\"1\\"" + (index >= practice.occasionCount - 1 ? " disabled" : "") + ">Next</button>"
      + "</div>";
  }
  html += renderOccasion(practice, index);
  return html;
}

function renderList(practice) {
  const isReading = practice.kind === "structured-reading";
  const today = isReading ? currentCycleDay(practice.occasionCount) : -1;
  const label = isReading ? "Day" : "Session";
  let html = "<header><h1>" + (isReading ? "Plan" : "Sessions") + "</h1><p class=\\"muted\\">The full " + practice.occasionCount + (isReading ? "-day cycle." : " sessions.") + "</p></header>";
  practice.occasions.forEach(function (occasion, i) {
    const num = i + 1;
    const isToday = num === today;
    html += "<section class=\\"card clickable" + (isToday ? " today" : "") + "\\" data-goto=\\"" + i + "\\"><h2 style=\\"margin:0 0 0.5rem;font-size:0.875rem\\">" + label + " " + num + (isToday ? " <span class=\\"today-badge\\">today</span>" : "") + "</h2>";
    practice.slots.forEach(function (slot) {
      const items = occasion[slot.id] || [];
      if (!items.length) return;
      html += "<div class=\\"row\\"><strong>" + escapeHtml(slot.label) + "</strong><span>" + items.map(function (it) { return escapeHtml(it.title); }).join(", ") + "</span></div>";
    });
    html += "</section>";
  });
  return html;
}

function allItems(practice) {
  const seen = {};
  const items = [];
  practice.occasions.forEach(function (occasion) {
    Object.keys(occasion).forEach(function (slotId) {
      occasion[slotId].forEach(function (item) {
        if (seen[item.id]) return;
        seen[item.id] = true;
        items.push(item);
      });
    });
  });
  return items;
}

function renderLibrary(practice, query) {
  const q = (query || "").trim().toLowerCase();
  const items = allItems(practice);
  const filtered = q
    ? items.filter(function (i) { return i.title.toLowerCase().indexOf(q) !== -1 || i.body.toLowerCase().indexOf(q) !== -1; })
    : items;
  let html = "<header><h1>Library</h1><p class=\\"muted\\">Every item across the whole practice.</p></header>";
  html += "<input id=\\"search\\" type=\\"search\\" placeholder=\\"Search…\\" value=\\"" + escapeHtml(query || "") + "\\">";
  filtered.forEach(function (item) {
    html += "<article class=\\"card\\"><span class=\\"item-title\\">" + escapeHtml(item.title) + "</span><span class=\\"item-body\\">" + escapeHtml(item.body) + "</span>";
    if (item.prompt) html += "<p class=\\"prompt\\">Talk about it: " + escapeHtml(item.prompt) + "</p>";
    html += "</article>";
  });
  if (!filtered.length) html += "<p class=\\"muted\\">No matches.</p>";
  return html;
}

function renderPracticeList() {
  const title = PLAN.practices.length === 1
    ? PLAN.practices[0].name
    : (PLAN.organizationName || "Practices");
  let html = "<header><h1>" + escapeHtml(title) + "</h1></header>";
  if (PLAN.practices.length > 1) {
    PLAN.practices.forEach(function (c) {
      html += "<div class=\\"card clickable\\" data-open=\\"" + c.id + "\\"><span class=\\"item-title\\">" + escapeHtml(c.name) + "</span>";
      if (c.tagline) html += "<span class=\\"item-body\\">" + escapeHtml(c.tagline) + "</span>";
      html += "</div>";
    });
  }
  return html;
}

let state = { practiceId: PLAN.practices.length === 1 ? PLAN.practices[0].id : null, view: "current", occasionIndex: 0, libraryQuery: "" };

function renderNav(practice) {
  const tabs = [["current", practice.kind === "structured-reading" ? "Today" : "Session"], ["list", practice.kind === "structured-reading" ? "Plan" : "Sessions"], ["library", "Library"]];
  return "<nav class=\\"tabs\\">" + tabs.map(function (t) {
    return "<button data-view=\\"" + t[0] + "\\" class=\\"" + (state.view === t[0] ? "active" : "") + "\\">" + t[1] + "</button>";
  }).join("") + "</nav>";
}

function render() {
  const app = document.getElementById("app");
  const practice = state.practiceId ? findPractice(state.practiceId) : null;

  if (!practice) {
    app.innerHTML = "<div class=\\"content\\">" + renderPracticeList() + "</div>";
    Array.prototype.forEach.call(app.querySelectorAll("[data-open]"), function (el) {
      el.addEventListener("click", function () {
        state = { practiceId: el.getAttribute("data-open"), view: "current", occasionIndex: 0, libraryQuery: "" };
        render();
      });
    });
    return;
  }

  let content;
  let backLink = PLAN.practices.length > 1 ? "<button class=\\"back\\" id=\\"back\\">\\u2190 Practices</button>" : "";
  if (state.view === "current") content = renderCurrent(practice);
  else if (state.view === "list") content = renderList(practice);
  else content = renderLibrary(practice, state.libraryQuery);

  app.innerHTML = "<div class=\\"content\\">" + backLink + content + "</div>" + renderNav(practice);

  const back = document.getElementById("back");
  if (back) back.addEventListener("click", function () { state = { practiceId: null, view: "current", occasionIndex: 0, libraryQuery: "" }; render(); });

  Array.prototype.forEach.call(app.querySelectorAll("nav.tabs button"), function (btn) {
    btn.addEventListener("click", function () {
      state.view = btn.getAttribute("data-view");
      render();
    });
  });
  Array.prototype.forEach.call(app.querySelectorAll(".stepper button"), function (btn) {
    btn.addEventListener("click", function () {
      const delta = Number(btn.getAttribute("data-step"));
      state.occasionIndex = Math.max(0, Math.min(practice.occasionCount - 1, state.occasionIndex + delta));
      render();
    });
  });
  Array.prototype.forEach.call(app.querySelectorAll("[data-goto]"), function (el) {
    el.addEventListener("click", function () {
      state.occasionIndex = Number(el.getAttribute("data-goto"));
      state.view = "current";
      render();
    });
  });
  const search = document.getElementById("search");
  if (search) {
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
    search.addEventListener("input", function (e) {
      state.libraryQuery = e.target.value;
      render();
    });
  }
}

render();
</script>
</body>
</html>
`
}

function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'onsen'
}

/** Downloads the generated static site as a single HTML file, ready to host anywhere. */
export function downloadStaticSite(plan: Plan): void {
  const html = buildStaticSite(plan)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${slugify(plan.organizationName || plan.practices[0]?.name || 'onsen')}.html`
  a.click()
  URL.revokeObjectURL(url)
}
