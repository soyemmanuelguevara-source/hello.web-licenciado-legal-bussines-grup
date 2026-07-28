document.body.classList.add("loading");

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

const loadingScreen = qs("#loading-screen");
const finishLoading = () => {
  document.body.classList.remove("loading");
  setTimeout(() => {
    if (loadingScreen) loadingScreen.style.display = "none";
  }, 950);
};
window.addEventListener("load", () => setTimeout(finishLoading, 1450));
setTimeout(finishLoading, 2600);

qs("#year").textContent = new Date().getFullYear();

const header = qs("#siteHeader");
const toTop = qs("#toTop");
const navToggle = qs("#navToggle");
const mobileNav = qs("#mobileNav");

function syncHeader() {
  header.classList.toggle("scrolled", window.scrollY > 18);
  toTop.classList.toggle("show", window.scrollY > 700);
}
syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

navToggle.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});

qsa(".mobile-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16, rootMargin: "0px 0px -30px 0px" });

qsa("[data-reveal]").forEach((el) => revealObserver.observe(el));

const counted = new WeakSet();
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || counted.has(entry.target)) return;
    counted.add(entry.target);
    const target = Number(entry.target.dataset.count || 0);
    const suffix = entry.target.dataset.suffix || "";
    const duration = 1300;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      entry.target.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.45 });

qsa("[data-count]").forEach((el) => countObserver.observe(el));

const typeTarget = qs("[data-typewriter]");
if (typeTarget) {
  const text = typeTarget.dataset.typewriter;
  typeTarget.textContent = "";
  typeTarget.classList.add("typing");
  let i = 0;
  const write = () => {
    typeTarget.textContent = text.slice(0, i);
    i += 1;
    if (i <= text.length) setTimeout(write, 54);
    else setTimeout(() => typeTarget.classList.remove("typing"), 900);
  };
  setTimeout(write, 1720);
}

const contactForm = qs("#contactForm");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const nombre = data.get("nombre") || "";
  const telefono = data.get("telefono") || "";
  const area = data.get("area") || "";
  const mensaje = data.get("mensaje") || "";
  const text = [
    "Hola, quiero agendar una consulta legal confidencial con Licenciados | Legal & Business Group.",
    `Nombre: ${nombre}`,
    `Teléfono: ${telefono}`,
    `Área legal: ${area}`,
    `Mensaje: ${mensaje || "Pendiente de compartir en consulta."}`
  ].join("\n");
  window.open(`https://wa.me/523121162476?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

class Particles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.points = [];
    this.tone = canvas.dataset.particles === "hero" ? "hero" : "soft";
    this.resize = this.resize.bind(this);
    this.draw = this.draw.bind(this);
    window.addEventListener("resize", this.resize);
    this.resize();
    requestAnimationFrame(this.draw);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(90, Math.max(34, Math.floor(rect.width / 18)));
    this.points = Array.from({ length: count }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      r: Math.random() * 1.8 + .6,
      vx: (Math.random() - .5) * .22,
      vy: (Math.random() - .5) * .22,
      a: Math.random() * .44 + .18
    }));
  }

  draw() {
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);
    const fill = this.tone === "hero" ? "212,175,55" : "10,31,61";
    const line = this.tone === "hero" ? "212,175,55" : "212,175,55";
    this.points.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > rect.width) p.vx *= -1;
      if (p.y < 0 || p.y > rect.height) p.vy *= -1;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${fill},${p.a})`;
      this.ctx.fill();
      for (let j = index + 1; j < this.points.length; j += 1) {
        const q = this.points[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 116) {
          this.ctx.strokeStyle = `rgba(${line},${(1 - dist / 116) * .14})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(q.x, q.y);
          this.ctx.stroke();
        }
      }
    });
    requestAnimationFrame(this.draw);
  }
}

qsa(".particle-canvas").forEach((canvas) => new Particles(canvas));
