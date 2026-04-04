/* ─────────────────────────────────────────────
   Daniel Raj V Portfolio — script.js
   Cursor · Nav · Scroll Reveal
───────────────────────────────────────────── */

/* ── Custom Cursor ─────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = -200, mouseY = -200;
let ringX  = -200, ringY  = -200;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

(function animateCursor() {
  // Dot snaps instantly
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';

  // Ring lags slightly for a trailing feel
  ringX += (mouseX - ringX) * 0.13;
  ringY += (mouseY - ringY) * 0.13;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';

  requestAnimationFrame(animateCursor);
})();

// Expand cursor on interactive elements
const interactiveEls = document.querySelectorAll(
  'a, button, .btn, .meta-row, .contact-row, .tag, .skill-list li, .card-hoverable'
);

interactiveEls.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ── Nav: scroll shadow + active link ──────── */
const nav   = document.getElementById('main-nav');
const navAs = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

const sectionEls = document.querySelectorAll('div[id], section[id]');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAs.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sectionEls.forEach(s => navObserver.observe(s));

/* ── Scroll Reveal ─────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealEls.forEach(el => revealObserver.observe(el));