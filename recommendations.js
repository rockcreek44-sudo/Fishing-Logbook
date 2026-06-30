const Recommendations=(()=>{function initialize(){console.log("Recommendations module ready.")}function current(){const catches=Storage.catches();if(!catches.length)return fallback();const trip=Storage.currentTrip();let pool=catches.slice();if(trip&&trip.waterClarity)pool=boost(pool,"waterClarity",trip.waterClarity);if(trip&&trip.weather)pool=boost(pool,"weather",trip.weather);const combos=rankCombos(pool);const best=combos[0]||rankCombos(catches)[0];if(!best)return fallback();const parts=best.name.split(" • ");const confidence=Math.min(99,Math.max(35,Math.round(best.score)));return{bait:parts[0]||"Workhorse",color:parts[1]||"Green Pumpkin",trailer:parts[2]||"Spunk Shad",cover:parts[3]||"Grass",confidence,reason:reason(best,catches.length,trip),alternatives:combos.slice(1,4)}}function fallback(){return{bait:"Workhorse",color:"Green Pumpkin",trailer:"Spunk Shad",cover:"Grass",confidence:50,reason:"Not enough catch data yet. This is a starter recommendation based on your confidence bait.",alternatives:[]}}function boost(catches,key,value){const matches=catches.filter(f=>f[key]===value);return matches.length?matches.concat(matches):catches}function rankCombos(catches){const map={};catches.forEach(f=>{const name=[f.bait||"Unknown",f.color||"Unknown",f.trailer||"Unknown",f.cover||"Unknown"].join(" • ");if(!map[name])map[name]={name,count:0,totalWeight:0,biggest:0};map[name].count++;map[name].totalWeight+=Number(f.weight)||0;map[name].biggest=Math.max(map[name].biggest,Number(f.weight)||0)});return Object.values(map).map(x=>{const avg=x.count?x.totalWeight/x.count:0;return{...x,average:avg,score:(x.count*12)+(avg*14)+(x.biggest*9)}}).sort((a,b)=>b.score-a.score)}function reason(best,total,trip){let text=`Based on ${best.count} matching catches out of ${total} total. Average ${best.average.toFixed(2)} lb, biggest ${best.biggest.toFixed(2)} lb.`;if(trip)text+=` Current trip context: ${trip.waterClarity||"unknown clarity"}, ${trip.weather||"unknown weather"}.`;return text}return{initialize,current,rankCombos}})();

// Build 40 enhancement
function confidenceScore(matches,total){
  if(!total) return 50;
  return Math.max(50, Math.min(95, Math.round((matches/total)*100)));
}
window.Build40={
 explain(rec,conditions){
   return `Recommended because conditions match ${conditions.cover||"current cover"}, ${conditions.waterClarity||"current clarity"} and your catch history.`;
 },
 confidenceScore
};
