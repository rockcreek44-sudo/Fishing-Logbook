const UI = (() => {
  const pages = {};

  function initialize() {
    cachePages();
    bindNavigation();
    bindForms();
    render();
    show("home");
    console.log("UI module ready.");
  }

  function cachePages() { document.querySelectorAll("[data-page]").forEach(page => pages[page.id] = page); }
  function bindNavigation() { document.querySelectorAll("[data-nav]").forEach(button => button.addEventListener("click", () => show(button.dataset.nav))); }

  function bindForms() {
    const startTripForm = document.getElementById("startTripForm");
    const catchForm = document.getElementById("catchForm");
    const endTripButton = document.getElementById("endTripButton");

    if (startTripForm) {
      startTripForm.addEventListener("submit", event => {
        event.preventDefault();
        Trips.create({ lake: getValue("tripLake"), weather: getValue("tripWeather"), waterClarity: getValue("tripWaterClarity"), notes: getValue("tripNotes") });
        render();
        show("catch");
      });
    }

    if (catchForm) {
      catchForm.addEventListener("submit", event => {
        event.preventDefault();
        try {
          Catches.create({ bait: getValue("catchBait"), color: getValue("catchColor"), trailer: getValue("catchTrailer"), weight: getValue("catchWeight"), length: getValue("catchLength"), cover: getValue("catchCover"), depth: getValue("catchDepth"), notes: getValue("catchNotes") });
          catchForm.reset();
          render();
          show("home");
        } catch {
          alert("Start a trip first.");
          show("trip");
        }
      });
    }

    if (endTripButton) {
      endTripButton.addEventListener("click", () => { Trips.finish(); render(); show("home"); });
    }
  }

  function show(pageId) {
    Object.values(pages).forEach(page => page.classList.remove("active"));
    if (pages[pageId]) pages[pageId].classList.add("active");
    document.querySelectorAll("[data-nav]").forEach(button => button.classList.toggle("active", button.dataset.nav === pageId));
  }

  function render() { renderDashboard(); renderTripStatus(); renderHistory(); renderStats(); }

  function renderDashboard() {
    const summary = Stats.summary();
    const biggest = summary.biggestFish;
    setText("totalFish", summary.totalFish);
    setText("averageWeight", summary.averageWeight.toFixed(2));
    setText("confidenceBait", summary.confidenceBait || "No data");
    setText("biggestFish", biggest ? `${biggest.weight.toFixed(2)} lb` : "None");
  }

  function renderTripStatus() {
    const trip = Trips.current();
    setText("currentTripStatus", trip ? `${trip.lake} • ${Trips.elapsedMinutes()} min` : "No active trip");
  }

  function renderHistory() {
    const container = document.getElementById("tripHistory");
    if (!container) return;
    const trips = Storage.trips();
    if (!trips.length) { container.innerHTML = `<div class="card empty">No trips logged yet.</div>`; return; }
    container.innerHTML = trips.slice().reverse().map(trip => {
      const catches = Catches.trip(trip.id);
      return `<div class="card"><h3>${escapeHTML(trip.lake)}</h3><p class="small-text">${new Date(trip.startTime).toLocaleString()}</p><p>${catches.length} fish</p><p>${escapeHTML(trip.waterClarity)} • ${escapeHTML(trip.weather)}</p></div>`;
    }).join("");
  }

  function renderStats() {
    const container = document.getElementById("baitStats");
    if (!container) return;
    const performance = Stats.baitPerformance();
    const names = Object.keys(performance);
    if (!names.length) { container.innerHTML = `<div class="card empty">No bait data yet.</div>`; return; }
    container.innerHTML = names.map(name => {
      const item = performance[name];
      return `<div class="card"><h3>${escapeHTML(name)}</h3><p>${item.fish} fish</p><p>Average: ${item.averageWeight.toFixed(2)} lb</p></div>`;
    }).join("");
  }

  function getValue(id) { const el = document.getElementById(id); return el ? el.value.trim() : ""; }
  function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }
  function escapeHTML(value) { return String(value || "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char])); }

  return { initialize, render, show };
})();