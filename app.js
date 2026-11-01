"use strict";

// ---- state ----
const state = {
  img: null, // object URL of the uploaded thumbnail, or the sample
  title: "My Awesome New Video — Watch Till the End!",
  channel: "My Channel",
  duration: "4:27",
  meta: "128K views • 2 days ago",
};

// A sample thumbnail drawn as an inline SVG, so the previews look real
// before anything is uploaded.
const SAMPLE = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720">
     <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
       <stop offset="0" stop-color="#1f6feb"/><stop offset="1" stop-color="#7d3aed"/>
     </linearGradient></defs>
     <rect width="1280" height="720" fill="url(#g)"/>
     <text x="640" y="330" font-family="Arial, sans-serif" font-size="120" font-weight="800"
       fill="#ffffff" text-anchor="middle">YOUR VIDEO</text>
     <text x="640" y="450" font-family="Arial, sans-serif" font-size="64"
       fill="#ffd93b" text-anchor="middle">upload a thumbnail to replace me</text>
   </svg>`);

const FAKES = [
  { cls: "f1", emoji: "🎧", title: "lofi beats to relax and study to — 24/7 radio", channel: "Chill Corner", meta: "3.1K watching", duration: "LIVE" },
  { cls: "f2", emoji: "🚀", title: "I Built a Rocket in My Backyard (Part 3)", channel: "Garage Science", meta: "842K views • 1 week ago", duration: "12:08" },
  { cls: "f3", emoji: "🌋", title: "The Volcano That Changed the Map Forever", channel: "Earth Stories", meta: "2.3M views • 3 weeks ago", duration: "18:44" },
  { cls: "f4", emoji: "🍜", title: "Rating Street Food in 5 Cities — One Winner", channel: "Fork & Road", meta: "567K views • 5 days ago", duration: "15:31" },
  { cls: "f5", emoji: "🎹", title: "One Piano, Ten Movie Themes, Zero Practice", channel: "Keys Daily", meta: "1.1M views • 2 weeks ago", duration: "9:57" },
];

const AVATAR_COLORS = ["#c0392b", "#2471a3", "#1e8449", "#7d3c98", "#b9770e", "#148f77", "#935116", "#616a6b"];
function avatarColor(name) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
}
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ---- card builders ----
function userThumb() {
  return `<img src="${state.img || SAMPLE}" alt="Your thumbnail">`;
}
function userCard() {
  return `<article class="vcard mine">
    <div class="vthumb">${userThumb()}<span class="badge">${esc(state.duration) || "0:00"}</span></div>
    <div class="vmeta">
      <div class="avatar" style="background:${avatarColor(state.channel)}">${esc(initials(state.channel))}</div>
      <div class="vtext">
        <div class="vtitle">${esc(state.title)}</div>
        <div class="vsub">${esc(state.channel)}</div>
        <div class="vsub">${esc(state.meta)}</div>
      </div>
    </div>
  </article>`;
}
function fakeCard(f) {
  return `<article class="vcard">
    <div class="vthumb"><div class="fake ${f.cls}">${f.emoji}</div><span class="badge">${f.duration}</span></div>
    <div class="vmeta">
      <div class="avatar" style="background:${avatarColor(f.channel)}">${esc(initials(f.channel))}</div>
      <div class="vtext">
        <div class="vtitle">${esc(f.title)}</div>
        <div class="vsub">${esc(f.channel)}</div>
        <div class="vsub">${esc(f.meta)}</div>
      </div>
    </div>
  </article>`;
}
function userRow() {
  return `<article class="srow">
    <div class="vthumb">${userThumb()}<span class="badge">${esc(state.duration) || "0:00"}</span></div>
    <div class="vtext">
      <div class="vtitle">${esc(state.title)}</div>
      <div class="vsub">${esc(state.meta)}</div>
      <div class="vsub" style="margin-top:8px">${esc(state.channel)}</div>
      <div class="vdesc">Watch the full video to see how it was made, step by step. New videos every week — subscribe for more.</div>
    </div>
  </article>`;
}
function fakeRow(f) {
  return `<article class="srow">
    <div class="vthumb"><div class="fake ${f.cls}">${f.emoji}</div><span class="badge">${f.duration}</span></div>
    <div class="vtext">
      <div class="vtitle">${esc(f.title)}</div>
      <div class="vsub">${esc(f.meta)}</div>
      <div class="vsub" style="margin-top:8px">${esc(f.channel)}</div>
      <div class="vdesc">A viewer favourite — sit back and enjoy the full story from start to finish.</div>
    </div>
  </article>`;
}

// ---- render ----
const $ = (id) => document.getElementById(id);
function render() {
  $("homeGrid").innerHTML = [userCard(), ...FAKES.map(fakeCard)].join("");
  $("searchRows").innerHTML = [userRow(), fakeRow(FAKES[1]), fakeRow(FAKES[3])].join("");
  $("mobileFeed").innerHTML = [userCard(), fakeCard(FAKES[0]), fakeCard(FAKES[2])].join("");
  $("searchQuery").textContent = state.title.toLowerCase();
  $("tinyImg").src = state.img || SAMPLE;
  $("tinyImg2").src = state.img || SAMPLE;
}

// ---- inputs ----
$("titleInput").addEventListener("input", (e) => { state.title = e.target.value; render(); });
$("channelInput").addEventListener("input", (e) => { state.channel = e.target.value; render(); });
$("durationInput").addEventListener("input", (e) => { state.duration = e.target.value; render(); });
$("metaInput").addEventListener("input", (e) => { state.meta = e.target.value; render(); });

// ---- upload ----
const dropZone = $("dropZone");
const fileInput = $("fileInput");
function setImage(file) {
  if (!file || !file.type.startsWith("image/")) return;
  if (state.img) URL.revokeObjectURL(state.img);
  state.img = URL.createObjectURL(file);
  render();
}
dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
fileInput.addEventListener("change", () => setImage(fileInput.files[0]));
["dragover", "dragenter"].forEach((ev) => dropZone.addEventListener(ev, (e) => { e.preventDefault(); dropZone.classList.add("dragover"); }));
["dragleave", "drop"].forEach((ev) => dropZone.addEventListener(ev, (e) => { e.preventDefault(); dropZone.classList.remove("dragover"); }));
dropZone.addEventListener("drop", (e) => setImage(e.dataTransfer.files[0]));

// ---- tabs ----
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b === btn));
    ["home", "search", "mobile"].forEach((m) => { $("view-" + m).hidden = m !== btn.dataset.mode; });
  });
});

render();
