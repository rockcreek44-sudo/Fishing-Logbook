const Storage = (() => {
  const DB_KEY = "twoDegreeLogbookV3";
  const DB_VERSION = 1;

  const defaultData = () => ({
    version: DB_VERSION,
    settings: { theme: "dark", units: "imperial" },
    currentTrip: null,
    trips: [],
    catches: [],
    prototypes: [],
    inventory: []
  });

  let db = defaultData();

  function load() {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) { db = defaultData(); save(); return db; }
    try {
      db = JSON.parse(raw);
      db.version = db.version || DB_VERSION;
      db.settings = db.settings || { theme: "dark", units: "imperial" };
      db.trips = db.trips || [];
      db.catches = db.catches || [];
      db.prototypes = db.prototypes || [];
      db.inventory = db.inventory || [];
    } catch {
      db = defaultData();
      save();
    }
    return db;
  }

  function save() { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
  function data() { return db; }
  function reset() { db = defaultData(); save(); }
  function currentTrip() { return db.currentTrip; }
  function setCurrentTrip(trip) { db.currentTrip = trip; save(); }
  function endTrip() { if (!db.currentTrip) return; db.trips.push(db.currentTrip); db.currentTrip = null; save(); }
  function trips() { return db.trips; }
  function addTrip(trip) { db.trips.push(trip); save(); }
  function catches() { return db.catches; }
  function addCatch(catchData) { db.catches.push(catchData); save(); }
  function settings() { return db.settings; }
  function updateSettings(values) { db.settings = { ...db.settings, ...values }; save(); }
  function exportJSON() { return JSON.stringify(db, null, 2); }
  function importJSON(text) { try { db = JSON.parse(text); save(); return true; } catch { return false; } }

  load();

  return { load, save, data, reset, currentTrip, setCurrentTrip, endTrip, trips, addTrip, catches, addCatch, settings, updateSettings, exportJSON, importJSON };
})();