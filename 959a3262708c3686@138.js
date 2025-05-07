import define1 from "./f3d342db2d382751@886.js";

function _1(md){return(
md`# Untitled`
)}

function _d3(require){return(
require("d3@7")
)}

function _3(md){return(
md`select = d3.select
`
)}

function _4(htl){return(
htl.html`<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
`
)}

function _L(require){return(
require("leaflet@1.9.4")
)}

function _6(L){return(
L.version
)}

function _7(htl){return(
htl.html`<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
`
)}

function _calendarData(FileAttachment){return(
FileAttachment("agent142_calendar.json").json()
)}

function _gaps(FileAttachment){return(
FileAttachment("agent142_gaps.json")
  .json()
  .then(arr => Object.fromEntries(arr.map(d => [d.gap_id, d])))
)}

function _10(calendarData){return(
calendarData.length
)}

function _dayOrder(){return(
["mo","tu","we","th","fr","sa","su"]
)}

function _rectWidth(){return(
0.012
)}

function _rectHeight(){return(
0.25
)}

function _select(d3){return(
d3.select
)}

function _dashboard(calendarData,html,select,DOM,rectWidth,rectHeight,gaps,L)
{
/*────────────────────────  CONSTANTS  ────────────────────────*/
const unitX = 100, unitY = 100;
const margin = {top: 50, right: 20, bottom: 50, left: 70};
const dayOrder = ["mo","tu","we","th","fr","sa","su"];

/*────────────────────────  DATA PREP  ────────────────────────*/
const weeks     = Array.from(new Set(calendarData.map(d => d.week))).sort();
const weekIndex = new Map(weeks.map((w,i)=>[w,i]));
const rows      = weeks.length;

/*────────────────────────  CONTAINER  ────────────────────────*/
const container = html`<div style="display:flex;flex-direction:column;gap:20px"></div>`;
container.value = null;

/*────────────────────────  LEGEND  ───────────────────────────*/
container.appendChild(html`
<style>
.legend{font:12px sans-serif;display:flex;gap:14px;align-items:center}
.swatch{width:14px;height:14px;border:1px solid #000}
</style>
<div class="legend">
 <div><span class="swatch" style="background:limegreen"></span> Available</div>
 <div><span class="swatch" style="background:black"></span> Missing</div>
 <div style="display:flex;align-items:center;gap:4px;">
   <img src="https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png"  width="12" height="12"> Pre‑gap
 </div>
 <div style="display:flex;align-items:center;gap:4px;">
   <img src="https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png" width="12" height="12"> Post‑gap
 </div>
</div>`);

/*────────────────────────  CALENDAR SVG  ─────────────────────*/
const calW = 7*unitX + margin.left + margin.right;
const calH = rows*unitY + margin.top + margin.bottom;
const svg  = select(DOM.svg(calW, calH));
container.appendChild(svg.node());

const pxX = d => margin.left + d*unitX;
const pxY = d => margin.top  + d*unitY;

/* title */
svg.append("text")
   .attr("x", calW/2).attr("y", margin.top/2)
   .attr("text-anchor","middle").attr("font-size","16px").attr("font-weight","bold")
   .text("Calendar — Green = Available  Black = Missing");

const g = svg.append("g").attr("transform",`translate(${margin.left},${margin.top})`);

/*──── 1.  TICKS  (hover via <title>) ────*/
g.selectAll("rect.tick")
 .data(calendarData)
 .enter().append("rect")
   .attr("x", d=>d.day_idx*unitX + d.offset*unitX - rectWidth*unitX/2)
   .attr("y", d=>weekIndex.get(d.week)*unitY + d.subrow*unitY)
   .attr("width",  rectWidth  * unitX)
   .attr("height", rectHeight * unitY)
   .attr("fill", d=>d.gap_id ? "black" : "limegreen")
   .style("cursor", d=>d.gap_id ? "pointer" : null)
   .on("click", (e,d)=> d.gap_id && setGap(d.gap_id))
   .append("title")                                         // ← tooltip
     .text(d => d.gap_id
         ? `${d.ts}\nGap ID: ${d.gap_id}\nDuration: ${gaps[d.gap_id].duration}s`
         : `${d.ts}\nFix present`);

/*──── 2.  GRID on top ────*/
const grid = g.append("g");
for (let c=0;c<=7;++c)
  grid.append("line")
      .attr("x1",c*unitX).attr("x2",c*unitX)
      .attr("y1",0).attr("y2",rows*unitY)
      .attr("stroke","#000").attr("stroke-width",1.5);

for (let r=0;r<=rows;++r)
  grid.append("line")
      .attr("x1",0).attr("x2",7*unitX)
      .attr("y1",r*unitY).attr("y2",r*unitY)
      .attr("stroke","#000").attr("stroke-width",1.5);

weeks.forEach((w,ri)=>
  [0.25,0.5,0.75].forEach(off=>
    grid.append("line")
        .attr("x1",0).attr("x2",7*unitX)
        .attr("y1",(ri+off)*unitY).attr("y2",(ri+off)*unitY)
        .attr("stroke","#666").attr("stroke-dasharray","2,2")
        .attr("stroke-width",0.8)));

/* labels */
g.selectAll("text.day")
 .data(dayOrder)
 .enter().append("text")
   .attr("x",(_,i)=>i*unitX+unitX/2)
   .attr("y", rows*unitY + 20)
   .attr("text-anchor","middle").attr("font-size","12px")
   .text(d=>d);

svg.append("text")
   .attr("x", calW/2).attr("y", calH-10)
   .attr("text-anchor","middle").attr("font-size","12px")
   .text("Days");

g.selectAll("text.week")
 .data(weeks)
 .enter().append("text")
   .attr("x", -10)
   .attr("y", w=>weekIndex.get(w)*unitY+unitY/2)
   .attr("dy","0.35em").attr("text-anchor","end")
   .attr("font-size","12px").attr("font-weight","bold")
   .text((w,i)=>`Week ${i}`);

const timeLabels = ["00–06","06–12","12–18","18–24"];
weeks.forEach((w,ri)=>{
  timeLabels.forEach((lbl,slot)=>{
    g.append("text")
     .attr("x",-12)
     .attr("y",ri*unitY+slot*unitY/4+unitY/8)
     .attr("dy","0.35em").attr("text-anchor","end")
     .attr("font-size","10px")
     .text(lbl);
  });
});

/*────────────────────────  LEAFLET MAP  ─────────────────────*/
const mapDiv = html`<div style="width:${calW}px;height:500px;"></div>`;
container.appendChild(mapDiv);

const map = L.map(mapDiv).setView([0,0],2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {attribution:"© OSM"}).addTo(map);

const red  = L.icon({iconUrl:"https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png", iconSize:[7,7]});
const blue = L.icon({iconUrl:"https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png", iconSize:[7,7]});
const preM  = L.marker([0,0],{icon:red }).addTo(map);
const postM = L.marker([0,0],{icon:blue}).addTo(map);

/*────────── reactive click handler ─────────*/
function setGap(id){
  const g = gaps[id];
  preM .setLatLng([g.pre_lat , g.pre_lon ]).bindPopup(`PRE<br>${g.pre_ts}`);
  postM.setLatLng([g.post_lat, g.post_lon]).bindPopup(`POST<br>${g.post_ts}`);
  map.flyToBounds([[g.pre_lat,g.pre_lon],[g.post_lat,g.post_lon]],{padding:[40,40]});
  container.value = id;
  container.dispatchEvent(new CustomEvent("input"));
}

return container;
}


function _17(Plot){return(
Plot.version
)}

function _18(gaps,md,d3,Plot,html)
{
  /* ─── 1. extract numeric durations ─── */
  const durations = Object.values(gaps)
        .map(g => Number(g.duration))
        .filter(v => Number.isFinite(v) && v > 0);

  if (!durations.length) return md`*No numeric durations found – cannot plot.*`;

  /* ─── 2. summary markdown ─── */
  const stats = md`*n = ${durations.length}, median = ${d3.median(durations)} s, max = ${d3.max(durations)} s*`;

  /* ─── 3A. histogram (linear) ─── */
  const hist = Plot.plot({
    width: 720,
    height: 280,
    marginLeft: 50,
    style: {background: "#fafafa"},
    x: {label: "Missing time (seconds)"},
    y: {label: "Frequency", grid: true},
    marks: [
      Plot.barY(
        durations,
        Plot.binX(
          {y: "count",
           fill: d => (d.x0 < 60 ? "salmon" : "steelblue"),
           title: d => `${d.length} gaps`},
          {thresholds: d3.thresholdFreedmanDiaconis}
        )
      ),
      Plot.ruleY([0])
    ]
  });

  /* ─── 3B. box-and-whisker (linear x) with rug dots ─── */
  const box = Plot.plot({
    width: 720,
    height: 140,
    marginLeft: 50,
    style: {background: "#fafafa"},
    x: {label: "Missing time (seconds)"},
    y: {axis: null},
    marks: [
      Plot.boxX(durations, {y: 0, inset: 4, stroke: "black"}),
      Plot.dot(durations, {y: 0, r: 1.2, opacity: 0.4, title: d => d + " s"})
    ]
  });

  /* ─── 4. legend explaining box-plot glyphs ─── */
  const legend = html`
  <style>
    .legend-row {display:flex;align-items:center;gap:6px;font:12px sans-serif}
    .legend-box {width:16px;height:10px;fill:none;stroke:#000}
    .legend-whisker{stroke:#000;stroke-width:2}
    .legend-outlier{fill:none;stroke:#000}
  </style>
  <svg width="16" height="12">
    <rect x="0" y="1" width="16" height="10" class="legend-box"></rect>
    <line x1="8" x2="8" y1="0" y2="12" class="legend-whisker"></line>
  </svg> median & quartiles<br/>
  <svg width="16" height="12">
    <circle cx="8" cy="6" r="4" class="legend-outlier"></circle>
  </svg> outlier`;

  /* ─── 5. stack everything ─── */
  return html`<div style="display:flex;flex-direction:column;gap:18px">
    ${stats}
    ${hist}
    ${box}
    <div class="legend-row">${legend}</div>
  </div>`;
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["agent142_gaps.json", {url: new URL("./files/agent142_gaps.json", import.meta.url), mimeType: "application/json", toString}],
    ["agent142_calendar.json", {url: new URL("./files/agent142_calendar.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["htl"], _4);
  main.variable(observer("L")).define("L", ["require"], _L);
  main.variable(observer()).define(["L"], _6);
  main.variable(observer()).define(["htl"], _7);
  main.variable(observer("calendarData")).define("calendarData", ["FileAttachment"], _calendarData);
  main.variable(observer("gaps")).define("gaps", ["FileAttachment"], _gaps);
  main.variable(observer()).define(["calendarData"], _10);
  main.variable(observer("dayOrder")).define("dayOrder", _dayOrder);
  main.variable(observer("rectWidth")).define("rectWidth", _rectWidth);
  main.variable(observer("rectHeight")).define("rectHeight", _rectHeight);
  main.variable(observer("select")).define("select", ["d3"], _select);
  main.variable(observer("viewof dashboard")).define("viewof dashboard", ["calendarData","html","select","DOM","rectWidth","rectHeight","gaps","L"], _dashboard);
  main.variable(observer("dashboard")).define("dashboard", ["Generators", "viewof dashboard"], (G, _) => G.input(_));
  const child1 = runtime.module(define1);
  main.import("Plot", child1);
  main.variable(observer()).define(["Plot"], _17);
  main.variable(observer()).define(["gaps","md","d3","Plot","html"], _18);
  return main;
}
