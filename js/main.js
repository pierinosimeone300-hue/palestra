/* =========================================================
   PEGASO GYM — main.js
   Nav mobile + vetrina abbigliamento (in vendita solo in palestra, no carrello online)
   ========================================================= */

const PRODUCTS = [
  {
    id: "borsa-pegaso",
    name: "Borsa Pegaso Gym",
    category: "accessori",
    price: 49,
    img: "img/lux-bag-hip.jpg",
    desc: "Borsone in eco-pelle con logo Pegaso ricamato. Il classico da portare in palestra."
  },
  {
    id: "crop-workin-heroes",
    name: "Crop Top \"Workin' Out Class Heroes\"",
    category: "abbigliamento",
    price: 32,
    img: "img/lux-croptop-back.jpg",
    desc: "Crop top a maniche lunghe, grafica Pegaso con cavallo alato sul retro."
  },
  {
    id: "tee-new-drop",
    name: "T-Shirt Pegaso \"New Drop\"",
    category: "abbigliamento",
    price: 28,
    img: "img/lux-tee-yellow.jpg",
    desc: "T-shirt oversize edizione limitata, piccolo logo Pegaso sul petto."
  },
  {
    id: "telo-pegaso",
    name: "Telo Palestra Pegaso",
    category: "accessori",
    price: 22,
    img: "img/lux-towel-moto.jpg",
    desc: "Telo in microfibra con logo Pegaso, leggero e compatto per l'allenamento."
  }
];

/* ---------------- galleria abbigliamento (pura vetrina fotografica, stesso stile della collezione sopra) ---------------- */
function renderShopGrid() {
  const grid = document.getElementById("shopGrid");
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map((p, i) => `
    <div class="lookbook-item${i % 2 === 1 ? " offset" : ""}">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
    </div>
  `).join("");
}

/* ---------------- hero video ---------------- */
function initHeroVideo() {
  const video = document.querySelector(".hero-video");
  if (!video) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    video.removeAttribute("autoplay");
    video.pause();
    return;
  }
  const hero = video.closest(".hero");
  const hint = document.getElementById("heroPlayHint");
  const tryPlay = () => video.play().catch(() => {});
  const showHint = () => hint?.classList.add("show");
  const hideHint = () => hint?.classList.remove("show");

  tryPlay();
  // molti browser mobile (in particolare dentro iframe/contesti embedded)
  // bloccano l'autoplay finché non c'è un'interazione dell'utente: se dopo
  // poco è ancora in pausa mostriamo un invito, ben visibile, a toccare
  // per avviarlo. Ci riproviamo anche più volte, non solo una.
  setTimeout(() => { if (video.paused) showHint(); }, 400);
  [1500, 3000, 5000].forEach(delay => {
    setTimeout(() => { if (video.paused) { tryPlay(); showHint(); } }, delay);
  });

  video.addEventListener("playing", hideHint);
  video.addEventListener("canplay", tryPlay);
  hint?.addEventListener("click", () => { tryPlay(); });
  // toccare/cliccare ovunque sull'hero (non solo sul pulsante) avvia il video
  hero?.addEventListener("click", () => { if (video.paused) tryPlay(); });
  hero?.addEventListener("touchstart", () => { if (video.paused) tryPlay(); }, { passive: true });

  const resumeOnGesture = () => { if (video.paused) tryPlay(); };
  ["click", "touchstart", "scroll", "keydown", "pointerdown"].forEach(evt =>
    window.addEventListener(evt, resumeOnGesture, { once: true, passive: true })
  );
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && video.paused) tryPlay();
  });
}

/* ---------------- carousel (galleria palestra) ---------------- */
function initCarousel(carouselId, dotsId, prevId, nextId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;
  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const dotsWrap = document.getElementById(dotsId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  if (!track || slides.length === 0) return;

  let index = 0;
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Vai alla slide " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsWrap?.appendChild(dot);
  });
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }
  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
    resetAutoplay();
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));

  let autoplayTimer;
  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goTo(index + 1), 5000);
  }

  let startX = null;
  track.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });

  update();
  resetAutoplay();
}

/* ---------------- header on scroll ---------------- */
function initHeaderScroll() {
  const header = document.querySelector("header.site");
  if (!header) return;

  const setHeaderHeight = () => {
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  };
  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight);

  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------------- scroll reveal ---------------- */
function initReveal() {
  const targets = document.querySelectorAll(
    ".section-head, .feature-row, .carousel, .lookbook-item, .editorial-statement .container, .lux-grid, .grid.grid-3, .info-strip"
  );
  if (!targets.length) return;

  const groups = new Map();
  targets.forEach(el => {
    el.classList.add("reveal");
    if (el.classList.contains("lookbook-item")) {
      const parent = el.parentElement;
      const idx = groups.get(parent) || 0;
      el.style.transitionDelay = (idx * 0.08) + "s";
      groups.set(parent, idx + 1);
    }
  });

  if (!("IntersectionObserver" in window)) {
    targets.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .15, rootMargin: "0px 0px -60px 0px" });
  targets.forEach(el => io.observe(el));

  // rete di sicurezza: se per qualche motivo (scroll molto rapido, salto
  // diretto in una sezione, ecc.) un elemento non viene mai intercettato
  // dall'observer, lo rendiamo comunque visibile controllando la sua
  // posizione reale.
  const revealIfInView = () => {
    targets.forEach(el => {
      if (el.classList.contains("is-visible")) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add("is-visible");
        io.unobserve(el);
      }
    });
  };
  let revealTimer;
  const debouncedReveal = () => { clearTimeout(revealTimer); revealTimer = setTimeout(revealIfInView, 150); };
  window.addEventListener("scroll", debouncedReveal, { passive: true });
  window.addEventListener("resize", debouncedReveal);
  window.addEventListener("load", revealIfInView);
}

/* ---------------- nav / init ---------------- */
function initNav() {
  const btn = document.getElementById("hamburger");
  const nav = document.getElementById("mainNav");
  if (btn && nav) {
    btn.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav.main-nav a").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initHeaderScroll();
  initHeroVideo();
  initCarousel("gymCarousel", "carouselDots", "carouselPrev", "carouselNext");

  // la griglia abbigliamento va popolata PRIMA di initReveal(), altrimenti
  // le sue card (create dopo) non vengono mai osservate per l'animazione
  // di comparsa allo scroll.
  if (document.getElementById("shopGrid")) {
    renderShopGrid();
  }

  initReveal();
});
