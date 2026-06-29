const App = (() => {
  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;
    Storage.load();
    Trips.initialize();
    Catches.initialize();
    Stats.initialize();
    UI.initialize();
    console.log("2° Logbook Ready");
  }

  function reload() {
    initialized = false;
    init();
  }

  function version() { return "3.0 Build 1"; }

  return { init, reload, version };
})();

document.addEventListener("DOMContentLoaded", () => App.init());
