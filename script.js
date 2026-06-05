/* ============================================================
   SURYA ROCHIH SAMADDAR MIHIKA — PORTFOLIO v2
   script.js
   ============================================================ */

'use strict';

/* ════════════════════════════════════════
   THEME
════════════════════════════════════════ */
const Theme = {
  KEY: 'mihika-theme',
  init() {
    const saved = localStorage.getItem(this.KEY) || 'light';
    this.apply(saved);
  },
  apply(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(this.KEY, t);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
    Canvas.reinit();
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

/* ════════════════════════════════════════
   CANVAS BACKGROUND (particle network)
════════════════════════════════════════ */
const Canvas = {
  el: null, ctx: null, nodes: [], raf: null,
  init() {
    this.el = document.getElementById('bg-canvas');
    if (!this.el) return;
    this.ctx = this.el.getContext('2d');
    this.resize();
    this.build();
    this.animate();
    window.addEventListener('resize', () => this.resize());
  },
  reinit() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.build();
    this.animate();
  },
  resize() {
    if (!this.el) return;
    this.el.width  = window.innerWidth;
    this.el.height = window.innerHeight;
  },
  colors() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return dark
      ? ['rgba(164,198,57,0.35)', 'rgba(76,175,80,0.25)', 'rgba(198,224,72,0.18)']
      : ['rgba(124,92,191,0.28)', 'rgba(179,157,219,0.20)', 'rgba(213,200,238,0.16)'];
  },
  build() {
    const n = Math.min(55, Math.floor(window.innerWidth / 24));
    this.nodes = Array.from({ length: n }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r:  Math.random() * 2.2 + 0.8
    }));
  },
  animate() {
    const { ctx, el, nodes } = this;
    if (!ctx) return;
    const cols = this.colors();
    ctx.clearRect(0, 0, el.width, el.height);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.strokeStyle = cols[0];
          ctx.lineWidth = (1 - d / 130) * 0.8;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      const n = nodes[i];
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = cols[i % cols.length];
      ctx.fill();
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > el.width)  n.vx *= -1;
      if (n.y < 0 || n.y > el.height) n.vy *= -1;
    }
    this.raf = requestAnimationFrame(() => this.animate());
  }
};

/* ════════════════════════════════════════
   SIDEBAR
════════════════════════════════════════ */
const Sidebar = {
  open: true,
  init() {
    if (window.innerWidth < 900) this.collapse();
    document.getElementById('sb-toggle')
      ?.addEventListener('click', () => this.toggle());
  },
  toggle() { this.open ? this.collapse() : this.expand(); },
  collapse() {
    this.open = false;
    document.getElementById('sidebar')?.classList.add('collapsed');
    document.getElementById('topbar')?.classList.add('collapsed');
    document.getElementById('main')?.classList.add('collapsed');
  },
  expand() {
    this.open = true;
    document.getElementById('sidebar')?.classList.remove('collapsed');
    document.getElementById('topbar')?.classList.remove('collapsed');
    document.getElementById('main')?.classList.remove('collapsed');
  }
};

/* ════════════════════════════════════════
   NAVIGATION
════════════════════════════════════════ */
const Nav = {
  current: 'home',
  currentSub: null,

  LABELS: {
    home: 'Home', profile: 'Profile',
    projects: 'Projects', 'projects-undergrad': 'Bachelor\'s', 'projects-grad': 'Master\'s',
    internships: 'Internships', 'internships-undergrad': 'Bachelor\'s', 'internships-grad': 'Master\'s',
    marketing: 'Marketing Analytics',
    consumer: 'Consumer Analytical Insights',
    analytical: 'Analytical Breakdown',
    ventures: 'Ventures',
    academics: 'Academics', 'academics-hs': 'High School', 'academics-undergrad': 'Bachelor\'s', 'academics-grad': 'Master\'s',
    impressions: 'Impressions'
  },

  init() {
    // Nav links
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', () => {
        const sec = el.dataset.nav;
        const sub = el.dataset.sub || null;
        this.go(sec, sub);
        if (window.innerWidth < 900) Sidebar.collapse();
      });
    });

    // Expandable nav items
    document.querySelectorAll('[data-expand]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.expand;
        const subNav = document.getElementById(`subnav-${id}`);
        el.classList.toggle('open');
        subNav?.classList.toggle('open');
        // Also navigate to section
        const sectionMap = { projects: 'projects', internships: 'internships', academics: 'academics' };
        if (sectionMap[id]) this.go(sectionMap[id]);
      });
    });

    this.go('home');
  },

  go(section, sub = null) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show target
    const pageId = `page-${section}`;
    const page = document.getElementById(pageId);
    if (page) page.classList.add('active');

    // Update active nav
    document.querySelectorAll('[data-nav]').forEach(el => el.classList.remove('active'));
    document.querySelectorAll(`[data-nav="${section}"]`).forEach(el => el.classList.add('active'));

    this.current = section;
    this.currentSub = sub;

    // Activate subtab if sub specified
    if (sub) {
      this.activateSubtab(section, sub);
    } else {
      // Activate first subtab by default
      const firstSubtab = document.querySelector(`.subtab-btn[data-group="${section}"]`);
      if (firstSubtab && !document.querySelector(`.subtab-btn[data-group="${section}"].active`)) {
        firstSubtab.click();
      }
    }

    this.updateBreadcrumb(section, sub);
    this.triggerReveal();

    // Scroll main to top
    const main = document.getElementById('main');
    if (main) main.scrollTo(0, 0);
    window.scrollTo(0, 0);
  },

  activateSubtab(group, tab) {
    document.querySelectorAll(`.subtab-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
    document.querySelectorAll(`.subtab-pane[data-group="${group}"]`).forEach(p => p.classList.remove('active'));
    const btn = document.querySelector(`.subtab-btn[data-group="${group}"][data-tab="${tab}"]`);
    const pane = document.querySelector(`.subtab-pane[data-group="${group}"][data-tab="${tab}"]`);
    btn?.classList.add('active');
    pane?.classList.add('active');
  },

  updateBreadcrumb(section, sub) {
    const bc = document.getElementById('breadcrumb');
    if (!bc) return;
    const items = [{ label: 'Home', section: 'home', sub: null }];
    if (section !== 'home') {
      items.push({ label: this.LABELS[section] || section, section, sub: null });
      if (sub) items.push({ label: this.LABELS[`${section}-${sub}`] || sub, section, sub });
    }
    bc.innerHTML = items.map((item, i) => {
      const isLast = i === items.length - 1;
      const cls = isLast ? 'bc-item current' : 'bc-item';
      const click = isLast ? '' : `onclick="Nav.go('${item.section}', ${item.sub ? `'${item.sub}'` : 'null'})"`;
      return `<span class="${cls}" ${click}>${item.label}</span>${!isLast ? '<span class="bc-sep">›</span>' : ''}`;
    }).join('');
  },

  triggerReveal() {
    setTimeout(() => {
      document.querySelectorAll('.page.active .reveal').forEach(el => {
        el.classList.add('visible');
      });
    }, 80);
  }
};

/* ════════════════════════════════════════
   SUBTABS
════════════════════════════════════════ */
const SubTabs = {
  init() {
    document.querySelectorAll('.subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.dataset.group;
        const tab   = btn.dataset.tab;
        document.querySelectorAll(`.subtab-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
        document.querySelectorAll(`.subtab-pane[data-group="${group}"]`).forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.querySelector(`.subtab-pane[data-group="${group}"][data-tab="${tab}"]`)?.classList.add('active');
      });
    });
    // Activate first in each group
    const seen = new Set();
    document.querySelectorAll('.subtab-btn').forEach(btn => {
      const g = btn.dataset.group;
      if (!seen.has(g)) { seen.add(g); btn.click(); }
    });
  }
};

/* ════════════════════════════════════════
   CAROUSEL
════════════════════════════════════════ */
class Carousel {
  constructor(el) {
    this.el      = el;
    this.track   = el.querySelector('.carousel-track');
    this.slides  = el.querySelectorAll('.carousel-slide');
    this.dotsEl  = el.querySelector('.carousel-dots');
    this.cur     = 0;
    this.total   = this.slides.length;
    this.timer   = null;
    if (!this.total) return;
    this.buildDots();
    el.querySelector('.carousel-prev')?.addEventListener('click', () => { this.prev(); this.resetTimer(); });
    el.querySelector('.carousel-next')?.addEventListener('click', () => { this.next(); this.resetTimer(); });
    this.startTimer();
  }
  buildDots() {
    if (!this.dotsEl) return;
    this.dotsEl.innerHTML = Array.from({ length: this.total }, (_, i) =>
      `<span class="carousel-dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`
    ).join('');
    this.dotsEl.querySelectorAll('.carousel-dot').forEach(d =>
      d.addEventListener('click', () => { this.go(+d.dataset.i); this.resetTimer(); })
    );
  }
  go(i) {
    this.cur = ((i % this.total) + this.total) % this.total;
    this.track.style.transform = `translateX(-${this.cur * 100}%)`;
    this.dotsEl?.querySelectorAll('.carousel-dot').forEach((d, idx) =>
      d.classList.toggle('active', idx === this.cur)
    );
  }
  next() { this.go(this.cur + 1); }
  prev() { this.go(this.cur - 1); }
  startTimer()  { this.timer = setInterval(() => this.next(), 8000); }
  resetTimer()  { clearInterval(this.timer); this.startTimer(); }
}

/* ════════════════════════════════════════
   COLLAPSIBLES
════════════════════════════════════════ */
const Collapsibles = {
  init() {
    document.querySelectorAll('.collapsible-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        trigger.classList.toggle('open');
        const body = trigger.nextElementSibling;
        body?.classList.toggle('open');
      });
    });
  }
};

/* ════════════════════════════════════════
   MODALS
════════════════════════════════════════ */
const Modal = {
  init() {
    document.querySelectorAll('[data-modal]').forEach(el =>
      el.addEventListener('click', () => this.open(el.dataset.modal))
    );
    document.querySelectorAll('.modal-close, .modal-overlay').forEach(el =>
      el.addEventListener('click', (e) => { if (e.target === el) this.closeAll(); })
    );
    document.addEventListener('keydown', e => { if (e.key === 'Escape') this.closeAll(); });
  },
  open(id) {
    const overlay = document.getElementById(`modal-${id}`);
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  },
  closeAll() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
  }
};

/* ════════════════════════════════════════
   SEARCH
════════════════════════════════════════ */
const Search = {
  INDEX: [
    { title: 'Home', path: 'Home', nav: 'home', sub: null, kw: 'mihika surya rochih samaddar portfolio', snip: 'Welcome — MBA candidate at Lehigh University.' },
    { title: 'Profile & About', path: 'Profile', nav: 'profile', sub: null, kw: 'about profile skills experience resume download cv cognizant shift4 lehigh', snip: 'Professional background, skills, and experience.' },
    { title: 'Projects — Bachelor\'s', path: 'Projects › Bachelor\'s', nav: 'projects', sub: 'undergrad', kw: 'undergrad bachelor lucy tysis riscv road monitoring hackathon', snip: 'Undergraduate engineering and tech projects.' },
    { title: 'Projects — Master\'s', path: 'Projects › Master\'s', nav: 'projects', sub: 'grad', kw: 'graduate masters roar whisper heart disease analytics bark boujee', snip: 'Graduate marketing and analytics projects.' },
    { title: 'Internships — Bachelor\'s', path: 'Internships › Bachelor\'s', nav: 'internships', sub: 'undergrad', kw: 'internship cdac nit mnnit gnit hpc arduino android', snip: 'Undergraduate research and industrial training.' },
    { title: 'Internships — Master\'s', path: 'Internships › Master\'s', nav: 'internships', sub: 'grad', kw: 'internship shift4 lehigh graduate student engineer', snip: 'Graduate internship experience.' },
    { title: 'Marketing Analytics', path: 'Marketing Analytics', nav: 'marketing', sub: null, kw: 'marketing analytics pulsemart pulseplus loyalty didid pricing priceiq inflation', snip: 'Data-driven marketing and analytics projects.' },
    { title: 'Consumer Insights', path: 'Consumer Analytical Insights', nav: 'consumer', sub: null, kw: 'consumer insights analysis segmentation behaviour survey', snip: 'Consumer research and analytical insights.' },
    { title: 'Analytical Breakdown', path: 'Analytical Breakdown', nav: 'analytical', sub: null, kw: 'analytical breakdown marketing consumer quantitative regression', snip: 'Deep-dive analytical breakdowns.' },
    { title: 'Ventures', path: 'Ventures', nav: 'ventures', sub: null, kw: 'venture startup entrepreneurship lehigh ai', snip: 'Start-up and entrepreneurial projects.' },
    { title: 'Academics', path: 'Academics', nav: 'academics', sub: null, kw: 'academics high school undergrad grad lehigh gpa gnit degree', snip: 'Academic record from school through Lehigh.' },
    { title: 'Impressions', path: 'Impressions', nav: 'impressions', sub: null, kw: 'contact email linkedin guestbook comment connect', snip: 'Leave a comment or get in touch.' },
  ],

  init() {
    const input   = document.getElementById('search-input');
    const results = document.getElementById('search-results');
    if (!input || !results) return;

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { results.classList.remove('open'); return; }
      const hits = this.INDEX
        .map(item => {
          let score = 0;
          if (item.title.toLowerCase().includes(q)) score += 10;
          if (item.kw.includes(q)) score += 5;
          q.split(' ').forEach(w => w && item.kw.includes(w) && (score += 2));
          return { ...item, score };
        })
        .filter(i => i.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 7);

      results.innerHTML = hits.length
        ? hits.map(h => `
            <div class="sr-item" onclick="Nav.go('${h.nav}', ${h.sub ? `'${h.sub}'` : 'null'}); document.getElementById('search-input').value=''; document.getElementById('search-results').classList.remove('open');">
              <div class="sr-title">${h.title}</div>
              <div class="sr-path">${h.path}</div>
              <div class="sr-snip">${h.snip}</div>
            </div>`).join('')
        : '<div class="sr-item"><div class="sr-title" style="color:var(--text-muted)">No results found.</div></div>';

      results.classList.add('open');
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.search-wrap')) results.classList.remove('open');
    });
  }
};

/* ════════════════════════════════════════
   GUESTBOOK (localStorage)
════════════════════════════════════════ */
const Guestbook = {
  KEY: 'mihika-comments',
  comments: [],

  init() {
    const saved = localStorage.getItem(this.KEY);
    if (saved) this.comments = JSON.parse(saved);
    this.render();

    document.getElementById('gb-submit')?.addEventListener('click', () => this.submit());
  },

  submit() {
    const name = document.getElementById('gb-name')?.value.trim();
    const text = document.getElementById('gb-text')?.value.trim();
    if (!name || !text) { alert('Please fill in both fields.'); return; }
    const comment = {
      name,
      text,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    this.comments.unshift(comment);
    localStorage.setItem(this.KEY, JSON.stringify(this.comments));
    document.getElementById('gb-name').value = '';
    document.getElementById('gb-text').value = '';
    this.render();
  },

  render() {
    const list = document.getElementById('gb-list');
    if (!list) return;
    if (!this.comments.length) {
      list.innerHTML = '<p class="text-muted italic" style="padding:10px 0">Be the first to leave a comment!</p>';
      return;
    }
    list.innerHTML = this.comments.map(c => `
      <div class="comment-card">
        <div class="comment-name">${c.name}</div>
        <div class="comment-date">${c.date}</div>
        <div class="comment-text">${c.text}</div>
      </div>`).join('');
  }
};

/* ════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════ */
const Reveal = {
  observer: null,
  init() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          this.observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    this.observe();

    // Re-observe on page change
    const main = document.getElementById('main');
    if (main) {
      new MutationObserver(() => this.observe()).observe(main, { childList: true, subtree: true });
    }
  },
  observe() {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => this.observer.observe(el));
  }
};

/* ════════════════════════════════════════
   INIT
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  Canvas.init();
  Sidebar.init();
  Nav.init();
  SubTabs.init();
  Collapsibles.init();
  Modal.init();
  Search.init();
  Guestbook.init();
  Reveal.init();

  // Theme toggle
  document.getElementById('theme-toggle')
    ?.addEventListener('click', () => Theme.toggle());

  // Home button
  document.getElementById('home-btn')
    ?.addEventListener('click', () => Nav.go('home'));

  // Init all carousels
  document.querySelectorAll('.carousel-container').forEach(el => new Carousel(el));

  // Back buttons
  document.querySelectorAll('.back-btn[data-back]').forEach(btn =>
    btn.addEventListener('click', () => {
      const [sec, sub] = (btn.dataset.back || 'home').split(':');
      Nav.go(sec, sub || null);
    })
  );
});
