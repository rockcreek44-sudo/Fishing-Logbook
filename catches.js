const Catches = (() => {
  function makeId() {
    return (crypto && crypto.randomUUID) ? crypto.randomUUID() : "id_" + Date.now() + "_" + Math.random().toString(16).slice(2);
  }

  function initialize() { console.log("Catch module ready."); }

  function create(data) {
    const trip = Trips.current();
    if (!trip) throw new Error("No active trip.");
    const fish = {
      id: makeId(),
      tripId: trip.id,
      lake: trip.lake,
      date: new Date().toISOString(),
      bait: data.bait || "Unknown",
      color: data.color || "",
      trailer: data.trailer || "",
      weight: Number(data.weight) || 0,
      length: Number(data.length) || 0,
      cover: data.cover || "",
      depth: Number(data.depth) || 0,
      notes: data.notes || "",
      photos: []
    };
    Storage.addCatch(fish);
    Trips.addCatch(fish.id);
    return fish;
  }

  function addPhoto(catchId, photoId) { const fish = Storage.catches().find(c => c.id === catchId); if (!fish) return; fish.photos.push(photoId); Storage.save(); }
  function update(id, values) { const fish = Storage.catches().find(c => c.id === id); if (!fish) return; Object.assign(fish, values); Storage.save(); }
  function remove(id) { const catches = Storage.catches(); const index = catches.findIndex(c => c.id === id); if (index < 0) return; catches.splice(index, 1); Storage.save(); }
  function all() { return Storage.catches(); }
  function trip(id) { return Storage.catches().filter(c => c.tripId === id); }
  function biggest() { const catches = Storage.catches(); if (!catches.length) return null; return catches.reduce((largest, fish) => fish.weight > largest.weight ? fish : largest); }
  function count() { return Storage.catches().length; }

  return { initialize, create, update, remove, addPhoto, all, trip, biggest, count };
})();