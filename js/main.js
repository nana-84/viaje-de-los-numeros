/* ============================================================
   EL VIAJE DE LOS NÚMEROS — Interactividad
   Dianneth Castrillón Benitez · Universidad de Cartagena · 2026
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initParticles();
  initSoundSystem();
  initMobileMenu();
  initNavbarScroll();
  initSmoothScroll();
});

/* -------------------------------------------------------
   1. SCROLL REVEAL (Intersection Observer)
   ------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right",
  );

  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------
   2. PARTÍCULAS FLOTANTES (números y símbolos matemáticos)
   ------------------------------------------------------- */
function initParticles() {
  const container = document.getElementById("particles-container");
  if (!container) return;

  const symbols = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "−",
    "×",
    "÷",
    "=",
    "π",
    "%",
    "∞",
  ];
  const colors = [
    "#a855f7",
    "#f97316",
    "#eab308",
    "#38bdf8",
    "#84cc16",
    "#ec4899",
    "#06b6d4",
  ];
  const count = 28;

  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.className = "particle";
    span.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const left = Math.random() * 100;
    const size = 14 + Math.random() * 28;
    const duration = 10 + Math.random() * 18;
    const delay = Math.random() * duration;
    const maxOpacity = 0.08 + Math.random() * 0.1;
    const color = colors[Math.floor(Math.random() * colors.length)];

    span.style.cssText = `
      left: ${left}%;
      font-size: ${size}px;
      color: ${color};
      --duration: ${duration}s;
      --delay: -${delay}s;
      --max-opacity: ${maxOpacity};
    `;

    container.appendChild(span);
  }
}

/* -------------------------------------------------------
   3. SISTEMA DE SONIDOS (Web Audio API)
   ------------------------------------------------------- */
let soundEnabled = true;
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(frequency, duration, type = "sine", volume = 0.1) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + duration,
    );

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    // Silently fail if audio is not available
  }
}

function playHoverSound() {
  playTone(880, 0.08, "sine", 0.06);
}

function playClickSound() {
  playTone(660, 0.12, "triangle", 0.1);
  setTimeout(() => playTone(880, 0.15, "triangle", 0.08), 60);
}

function initSoundSystem() {
  const muteBtn = document.getElementById("btn-mute");
  const muteBtnMobile = document.getElementById("btn-mute-mobile");

  function toggleMute() {
    soundEnabled = !soundEnabled;
    const icon = soundEnabled ? "🔊" : "🔇";
    if (muteBtn) muteBtn.textContent = icon;
    if (muteBtnMobile) muteBtnMobile.textContent = icon;
    if (soundEnabled) playClickSound();
  }

  if (muteBtn) muteBtn.addEventListener("click", toggleMute);
  if (muteBtnMobile) muteBtnMobile.addEventListener("click", toggleMute);

  // Hover sounds on interactive elements
  document
    .querySelectorAll(".card-hover, .btn-activity, .nav-link, .hero-cta")
    .forEach((el) => {
      el.addEventListener("mouseenter", playHoverSound);
    });

  // Click sounds on buttons
  document.querySelectorAll(".btn-activity, .hero-cta").forEach((el) => {
    el.addEventListener("click", playClickSound);
  });
}

/* -------------------------------------------------------
   4. MENÚ HAMBURGUESA
   ------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("mobile-menu-overlay");

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add("active");
    mobileMenu.classList.add("open");
    if (overlay) overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", () => {
    mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
  });

  if (overlay) overlay.addEventListener("click", closeMenu);

  // Close menu on nav link click
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

/* -------------------------------------------------------
   5. NAVBAR DINÁMICA (cambia al hacer scroll)
   ------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 80) {
          navbar.classList.add("navbar-scrolled");
        } else {
          navbar.classList.remove("navbar-scrolled");
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* -------------------------------------------------------
   6. SCROLL SUAVE con offset para navbar
   ------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight =
        document.getElementById("navbar")?.offsetHeight || 70;
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - navbarHeight - 10;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });
}
