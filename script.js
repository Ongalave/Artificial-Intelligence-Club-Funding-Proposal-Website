// ===== Navigation visibility on scroll =====
const nav = document.getElementById('nav');
const hero = document.getElementById('hero');
let lastScroll = 0;

function updateNav() {
  const scrollY = window.scrollY;
  const heroHeight = hero.offsetHeight;

  if (scrollY > heroHeight * 0.6) {
    nav.classList.add('visible');
  } else {
    nav.classList.remove('visible');
  }

  lastScroll = scrollY;
}

window.addEventListener('scroll', updateNav, { passive: true });

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('nav-toggle');
const navMobile = document.getElementById('nav-mobile');

navToggle.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});

// Close mobile nav on link click
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
  });
});

// ===== Tier toggle for investment table =====
const tierBtns = document.querySelectorAll('.tier-btn');
const coreEls = document.querySelectorAll('.tier-core');
const accelEls = document.querySelectorAll('.tier-accel');

tierBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tierBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const tier = btn.dataset.tier;
    if (tier === 'core') {
      coreEls.forEach(el => el.style.display = '');
      accelEls.forEach(el => el.style.display = 'none');
    } else {
      coreEls.forEach(el => el.style.display = 'none');
      accelEls.forEach(el => el.style.display = '');
    }
  });
});

// ===== Scroll animations =====
const animateEls = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

animateEls.forEach(el => observer.observe(el));

// ===== Count-up animation for stats =====
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const isDollar = el.classList.contains('stat-dollar');
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    if (isDollar) {
      el.textContent = '$' + current.toLocaleString();
    } else {
      el.textContent = current;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat-number[data-count]');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statsObserver.observe(el));

// ===== Smooth scroll for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = nav.classList.contains('visible') ? 70 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
