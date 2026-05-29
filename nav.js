// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});
 
// ── Mobile nav ──
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle) {
  toggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '72px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(7,8,13,0.98)';
    navLinks.style.padding = '1rem 2rem 2rem';
    navLinks.style.borderBottom = '1px solid #1c2035';
  });
}
 
// ── Reveal on scroll ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
reveals.forEach(r => observer.observe(r));
 
// ── Animated counters ──
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const start = performance.now();
  const isDecimal = target % 1 !== 0;
  const update = (time) => {
    const elapsed = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    const current = isDecimal ? (eased * target).toFixed(1) : Math.floor(eased * target);
    el.textContent = prefix + current + suffix;
    if (elapsed < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));
 
// ── Active nav link ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});
 
// ── Contact form — AJAX submission ──
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        // Show success popup
        const popup = document.createElement('div');
        popup.style.cssText = `
          position:fixed;top:0;left:0;right:0;bottom:0;
          background:rgba(0,0,0,0.85);z-index:9999;
          display:flex;align-items:center;justify-content:center;
          animation:fadeIn 0.3s ease;
        `;
        popup.innerHTML = `
          <div style="
            background:linear-gradient(135deg,#111420,#0a1628);
            border:1px solid #c9a84c;border-radius:20px;
            padding:3rem 2.5rem;text-align:center;max-width:480px;width:90%;
            box-shadow:0 30px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(201,168,76,0.2);
            animation:slideUp 0.4s cubic-bezier(0.16,1,0.3,1);
          ">
            <div style="font-size:3rem;margin-bottom:1rem">✅</div>
            <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:#F5E27A;margin-bottom:0.8rem">Message Sent!</h3>
            <p style="color:#7a8199;font-size:1rem;line-height:1.7;margin-bottom:2rem">
              Thank you for reaching out to OS World Solutions.<br>
              We'll get back to you within <strong style="color:#c9a84c">24 business hours</strong>.
            </p>
            <button onclick="this.closest('div').parentElement.remove();document.getElementById('contactForm').reset();" style="
              background:linear-gradient(135deg,#c9a84c,#e8c97a);
              color:#07080d;border:none;border-radius:10px;
              padding:0.85rem 2.5rem;font-size:0.95rem;font-weight:700;
              cursor:pointer;font-family:'DM Sans',sans-serif;
            ">Close</button>
          </div>
        `;
        document.body.appendChild(popup);
        form.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      btn.innerHTML = 'Error — Try Again';
      btn.style.background = 'linear-gradient(135deg,#8B0000,#a00000)';
      btn.disabled = false;
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.opacity = '1';
      }, 3000);
    }
  });
}
 
