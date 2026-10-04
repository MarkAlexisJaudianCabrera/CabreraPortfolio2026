const GITHUB_USER = "MarkAlexisJaudianCabrera";
const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== Page-load animation ===== */
let started = false;
function startPage() {
  if (started) return;
  started = true;
  document.getElementById("loader").classList.add("done");
  root.classList.add("ready");
  typeLoop();
}
/* Do not wait for slow images or fonts */
document.addEventListener("DOMContentLoaded", () => setTimeout(startPage, reduced ? 0 : 700));
setTimeout(startPage, 2000);

/* ===== Dark / light mode ===== */
const themeIcon = document.getElementById("themeIcon");
function applyTheme(t) {
  root.setAttribute("data-theme", t);
  themeIcon.textContent = t === "dark" ? "☀" : "☾";
  try { localStorage.setItem("theme", t); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem("theme"); } catch (e) {}
applyTheme(saved || "dark");
document.getElementById("themeToggle").addEventListener("click", () =>
  applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));

/* ===== Mobile menu ===== */
const navLinks = document.getElementById("navLinks");
const menuBtn = document.getElementById("menuBtn");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  navLinks.classList.remove("open"); menuBtn.setAttribute("aria-expanded", false);
}));

/* ===== Typing effect ===== */
const roles = ["Full-Stack Developer", "BS Information Technology", "Arduino and hardware builder", "Fresh graduate, ready to work"];
const typed = document.getElementById("typed");
let ri = 0, ci = 0, del = false;
function typeLoop() {
  if (reduced) { typed.textContent = roles[0]; return; }
  const word = roles[ri];
  typed.textContent = word.slice(0, ci);
  if (!del && ci === word.length) { del = true; return setTimeout(typeLoop, 1600); }
  if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; }
  ci += del ? -1 : 1;
  setTimeout(typeLoop, del ? 35 : 70);
}

/* ===== Scroll reveal, counters, nav highlight ===== */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("visible");
  e.target.querySelectorAll("[data-count]").forEach(countUp);
  io.unobserve(e.target);
}), { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 80 + "ms";
  io.observe(el);
});

function countUp(el) {
  const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
  if (reduced) { el.textContent = end.toFixed(dec); return; }
  const start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / 1200, 1);
    el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec);
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

const linkMap = {};
navLinks.querySelectorAll("a").forEach(a => (linkMap[a.hash.slice(1)] = a));
const spy = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting && linkMap[e.target.id]) {
    Object.values(linkMap).forEach(l => l.classList.remove("active"));
    linkMap[e.target.id].classList.add("active");
  }
}), { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("main section[id]").forEach(s => spy.observe(s));

/* ===== Scroll progress bar and back-to-top ===== */
const bar = document.getElementById("progress"), toTop = document.getElementById("toTop");
addEventListener("scroll", () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
  toTop.classList.toggle("show", h.scrollTop > 600);
}, { passive: true });
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));

/* ===== Project filter ===== */
const filters = document.querySelectorAll(".filter");
filters.forEach(btn => btn.addEventListener("click", () => {
  filters.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".project").forEach(p => {
    const show = btn.dataset.filter === "all" || p.dataset.cat === btn.dataset.filter;
    p.classList.toggle("hide", !show);
    if (show) { p.classList.remove("pop"); void p.offsetWidth; p.classList.add("pop"); }
  });
}));

/* ===== Card tilt on hover (desktop only) ===== */
if (!reduced && matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".tilt").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => (card.style.transform = ""));
  });
}

/* ===== Photo blank if image missing; footer year ===== */
const img = document.getElementById("profileImg");
img.addEventListener("error", () => img.classList.add("missing"));
document.getElementById("year").textContent = new Date().getFullYear();