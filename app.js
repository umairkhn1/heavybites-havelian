/* ============================================================
   HEAVYBITES HAVELIAN — UI logic
   Cart, deals, menu, lightbox, drawer, nav + motion.
   ============================================================ */
(function () {
  const D = window.HB;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = n => 'Rs. ' + Number(n).toLocaleString('en-PK');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ICONS = { pizza: '🍕', burger: '🍔', fries: '🍟', wings: '🍗', pasta: '🍝', sandwich: '🥪', roll: '🌯', bowl: '🥘', icecream: '🍨', soup: '🍲', fish: '🐟' };
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- CART ---------------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('hb_cart') || '[]'); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem('hb_cart', JSON.stringify(cart)); } catch (e) {} };
  const total = () => cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = () => cart.reduce((s, i) => s + i.qty, 0);

  function addToCart(name, detail, price) {
    const key = name + '|' + detail;
    const hit = cart.find(i => i.key === key);
    if (hit) hit.qty++; else cart.push({ key, name, detail, price, qty: 1 });
    save(); renderCart();
    toast(name + ' added to your order');
    const b = $('#openCart');
    b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  }

  function renderCart() {
    $('#cartCount').textContent = count();
    $('#cartTotal').textContent = money(total());
    const mb = $('#mbTotal'); if (mb) mb.textContent = money(total());

    const body = $('#cartBody');
    if (!cart.length) {
      body.innerHTML = '<div class="empty-cart"><b>🍕</b>Your order is empty.<br>Add a deal or something from the menu.</div>';
      return;
    }
    body.innerHTML = cart.map((i, idx) => `
      <div class="ci-row">
        <div class="t">${esc(i.name)}</div>
        <div class="p">${money(i.price * i.qty)}</div>
        ${i.detail ? `<div class="d">${esc(i.detail)}</div>` : ''}
        <div class="qty">
          <button data-act="dec" data-i="${idx}" aria-label="Decrease quantity">−</button>
          <b>${i.qty}</b>
          <button data-act="inc" data-i="${idx}" aria-label="Increase quantity">+</button>
          <button class="rm" data-act="rm" data-i="${idx}">Remove</button>
        </div>
      </div>`).join('');
  }

  $('#cartBody').addEventListener('click', e => {
    const b = e.target.closest('button[data-act]'); if (!b) return;
    const i = +b.dataset.i, a = b.dataset.act;
    if (a === 'inc') cart[i].qty++;
    if (a === 'dec') { cart[i].qty--; if (cart[i].qty <= 0) cart.splice(i, 1); }
    if (a === 'rm') cart.splice(i, 1);
    save(); renderCart();
  });

  /* ---------------- DRAWER ---------------- */
  const drawer = $('#drawer'), overlay = $('#overlay');
  let lastFocus = null;
  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.classList.add('open'); overlay.classList.add('show');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#closeCart').focus(), 120);
  }
  function closeDrawer() {
    drawer.classList.remove('open'); overlay.classList.remove('show');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  $('#openCart').onclick = openDrawer;
  const mbOpen = $('#mbOpen'); if (mbOpen) mbOpen.onclick = openDrawer;
  $('#closeCart').onclick = closeDrawer;
  overlay.onclick = closeDrawer;

  /* ---------------- WHATSAPP ---------------- */
  const waLink = text => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(text)}`;
  $('#orderForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!cart.length) { toast('Add something to your order first'); return; }
    const name = $('#custName').value.trim(), tel = $('#custPhone').value.trim();
    const addr = $('#custAddr').value.trim(), note = $('#custNote').value.trim();
    let msg = `*New Order – Heavybites Havelian*\n\n`;
    cart.forEach((i, n) => {
      msg += `${n + 1}. ${i.name}${i.detail ? ' (' + i.detail + ')' : ''} x${i.qty} – ${money(i.price * i.qty)}\n`;
    });
    msg += `\n*Total: ${money(total())}*\nDelivery: FREE (Havelian)\n\n`;
    msg += `*Name:* ${name}\n*Phone:* ${tel}\n*Address:* ${addr}`;
    if (note) msg += `\n*Note:* ${note}`;
    window.open(waLink(msg), '_blank', 'noopener');
  });

  /* ---------------- DEALS ---------------- */
  let activeDeal = D.dealGroups[0].id;

  function renderDealTabs() {
    $('#dealTabs').innerHTML = D.dealGroups.map(g =>
      `<button class="tab ${g.id === activeDeal ? 'active' : ''}" role="tab" aria-selected="${g.id === activeDeal}" data-id="${g.id}">${esc(g.title)}</button>`).join('');
  }

  function renderDeals() {
    const g = D.dealGroups.find(x => x.id === activeDeal);
    $('#dealGrid').innerHTML = g.deals.map((d, i) => `
      <article class="deal" style="animation-delay:${i * 55}ms">
        <div class="deal-top">
          <span class="deal-no">${String(i + 1).padStart(2, '0')} · ${esc(g.badge)}</span>
          <span class="deal-price">${money(d.price)}</span>
        </div>
        <h4>${esc(d.name)}</h4>
        <p>${esc(d.items)}</p>
        <button class="add" data-g="${g.id}" data-i="${i}">Add to order</button>
      </article>`).join('');
    tiltAll($('#dealGrid'));
  }

  $('#dealTabs').addEventListener('click', e => {
    const t = e.target.closest('.tab'); if (!t) return;
    activeDeal = t.dataset.id; renderDealTabs(); renderDeals();
  });

  $('#dealGrid').addEventListener('click', e => {
    const b = e.target.closest('.add'); if (!b) return;
    const g = D.dealGroups.find(x => x.id === b.dataset.g);
    const d = g.deals[+b.dataset.i];
    addToCart(d.name, g.title + ': ' + d.items, d.price);
    b.classList.add('added'); b.textContent = 'Added ✓';
    setTimeout(() => { b.classList.remove('added'); b.textContent = 'Add to order'; }, 1300);
  });

  /* posters */
  const posters = [
    ['assets/deals/deals-999.jpg', 'Deals 999 poster'],
    ['assets/deals/cafe-1250.jpg', 'Food Cafe deals 1250 poster'],
    ['assets/deals/feast-1499.jpg', 'Special Feast Deals 1499 poster'],
    ['assets/deals/special-1500.jpg', 'Special Deals 1500 poster']
  ];
  $('#posterRow').innerHTML = posters.map(p =>
    `<button data-src="${p[0]}" data-alt="${p[1]}" aria-label="View ${p[1]}"><img src="${p[0]}" alt="${p[1]}" loading="lazy"></button>`).join('');

  /* ---------------- MENU ---------------- */
  let activeCat = 'all', query = '';

  function renderChips() {
    $('#menuChips').innerHTML = [{ id: 'all', title: 'All' }, ...D.menu].map(c =>
      `<button class="chip ${c.id === activeCat ? 'active' : ''}" role="tab" aria-selected="${c.id === activeCat}" data-id="${c.id}">${esc(c.title)}</button>`).join('');
  }

  function catHTML(c, items) {
    let h = `<section class="cat"><div class="cat-head"><div class="ci">${ICONS[c.icon] || '🍽️'}</div><h3>${esc(c.title)}</h3></div>`;
    if (c.note) h += `<div class="cat-note">${esc(c.note)}</div>`;

    if (c.type === 'sizes') {
      const cols = `1.4fr repeat(${c.sizes.length}, 1fr)`;
      h += `<div class="sizes-head" style="grid-template-columns:${cols}"><span></span>${c.sizes.map(s => `<span>${esc(s)}</span>`).join('')}</div>`;
      items.forEach(it => {
        h += `<div class="row sz" style="grid-template-columns:${cols}">
                <button class="nm" data-sizes="${esc(it.name)}" data-cat="${c.id}" aria-label="Choose size for ${esc(it.name)}">${esc(it.name)}</button>`;
        it.prices.forEach((p, si) => {
          h += p == null
            ? `<div class="pr"><span class="na">–</span></div>`
            : `<div class="pr"><button data-c="${c.id}" data-n="${esc(it.name)}" data-s="${esc(c.sizes[si])}" data-p="${p}" aria-label="Add ${esc(it.name)} ${esc(c.sizes[si])} for ${money(p)}">${p.toLocaleString('en-PK')}</button></div>`;
        });
        h += `</div>`;
      });
      if (c.extra) {
        h += `<div class="extra"><b>${esc(c.extra.title)}</b>` +
          c.extra.sizes.map((s, i) => `<div><span>${esc(s)}</span><span><b>Rs. ${c.extra.prices[i]}</b></span></div>`).join('') + `</div>`;
      }
    } else {
      items.forEach(it => {
        const priceTxt = it.price != null ? Number(it.price).toLocaleString('en-PK') : it.priceText;
        const addable = it.price != null;
        h += `<div class="row one">
                <div class="nm">${esc(it.name)}</div>
                <div class="pr">Rs. ${priceTxt}</div>` +
          (addable
            ? `<button class="plus" data-c="${c.id}" data-n="${esc(it.name)}" data-p="${it.price}" aria-label="Add ${esc(it.name)}">+</button>`
            : `<span></span>`) + `</div>`;
      });
    }
    return h + `</section>`;
  }

  function renderMenu() {
    const q = query.toLowerCase();
    let out = '';
    D.menu.forEach(c => {
      if (activeCat !== 'all' && activeCat !== c.id) return;
      const items = c.items.filter(it => !q || it.name.toLowerCase().includes(q) || c.title.toLowerCase().includes(q));
      if (items.length) out += catHTML(c, items);
    });
    $('#menuGrid').innerHTML = out || '<div class="empty">Nothing matches that search. Try another word.</div>';
  }

  $('#menuChips').addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    activeCat = c.dataset.id; renderChips(); renderMenu();
  });
  $('#menuSearch').addEventListener('input', e => { query = e.target.value.trim(); renderMenu(); });

  /* size picker */
  const sizeModal = $('#sizeModal');
  function openSizes(name, catId) {
    const cat = D.menu.find(c => c.id === catId);
    const item = cat.items.find(i => i.name === name);
    $('#sizeTitle').textContent = name;
    $('#sizeOpts').innerHTML = cat.sizes.map((s, si) => {
      const p = item.prices[si];
      return p == null
        ? `<button disabled style="opacity:.4">${esc(s)} <span>Not available</span></button>`
        : `<button data-n="${esc(name)}" data-s="${esc(s)}" data-p="${p}"><span>${esc(s)}</span><b>${money(p)}</b></button>`;
    }).join('');
    sizeModal.classList.add('show');
    sizeModal.setAttribute('aria-hidden', 'false');
  }
  function closeSizes() { sizeModal.classList.remove('show'); sizeModal.setAttribute('aria-hidden', 'true'); }
  $('#sizeClose').onclick = closeSizes;
  sizeModal.addEventListener('click', e => {
    if (e.target === sizeModal) return closeSizes();
    const b = e.target.closest('button[data-p]'); if (!b) return;
    addToCart(b.dataset.n, 'Size ' + b.dataset.s, +b.dataset.p);
    closeSizes();
  });

  $('#menuGrid').addEventListener('click', e => {
    const sz = e.target.closest('button[data-sizes]');
    if (sz) { openSizes(sz.dataset.sizes, sz.dataset.cat); return; }
    const b = e.target.closest('button[data-p]'); if (!b) return;
    addToCart(b.dataset.n, b.dataset.s ? 'Size ' + b.dataset.s : '', +b.dataset.p);
  });

  /* ---------------- LIGHTBOX ---------------- */
  const lb = $('#lightbox');
  function openLB(src, alt) {
    $('#lbImg').src = src; $('#lbImg').alt = alt || '';
    lb.classList.add('show'); lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLB() {
    lb.classList.remove('show'); lb.setAttribute('aria-hidden', 'true');
    if (!drawer.classList.contains('open')) document.body.style.overflow = '';
  }
  $('#posterRow').addEventListener('click', e => {
    const b = e.target.closest('button'); if (b) openLB(b.dataset.src, b.dataset.alt);
  });
  $('#openMenuCard').onclick = () => openLB('assets/full-menu.jpg', 'Heavybites Havelian full menu card');
  $('#lbClose').onclick = closeLB;
  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeLB(); closeSizes(); closeDrawer(); closeMenu(); }
  });

  /* ---------------- MOBILE NAV ---------------- */
  const burger = $('#burger'), mMenu = $('#mobileMenu');
  function openMenu() {
    mMenu.classList.add('open'); mMenu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mMenu.classList.remove('open'); mMenu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    if (!drawer.classList.contains('open') && !lb.classList.contains('show')) document.body.style.overflow = '';
  }
  burger.onclick = () => (mMenu.classList.contains('open') ? closeMenu() : openMenu());
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------------- MOTION ---------------- */
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 1900);
  }

  /* scroll reveal */
  if ('IntersectionObserver' in window && !REDUCED) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    $$('.reveal').forEach(el => io.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }

  /* counters */
  function runCounter(el) {
    const target = +el.dataset.count;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (!target) return;
    const dur = 1100, t0 = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased).toLocaleString('en-PK') + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  if ('IntersectionObserver' in window && !REDUCED) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.5 });
    $$('[data-count]').forEach(el => co.observe(el));
  }

  /* 3D tilt */
  function tiltAll(root) {
    if (REDUCED || window.matchMedia('(hover: none)').matches) return;
    $$('.deal', root).forEach(card => {
      if (card.dataset.tilt) return;
      card.dataset.tilt = '1';
      card.addEventListener('pointermove', ev => {
        const r = card.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width;
        const py = (ev.clientY - r.top) / r.height;
        card.style.setProperty('--ry', ((px - .5) * 9).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((.5 - py) * 9).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    });
  }

  /* magnetic buttons */
  if (!REDUCED && !window.matchMedia('(hover: none)').matches) {
    $$('.btn-primary, .btn-wa').forEach(btn => {
      btn.addEventListener('pointermove', ev => {
        const r = btn.getBoundingClientRect();
        const x = (ev.clientX - r.left - r.width / 2) / r.width;
        const y = (ev.clientY - r.top - r.height / 2) / r.height;
        btn.style.transform = `translate(${(x * 6).toFixed(1)}px,${(y * 4 - 2).toFixed(1)}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  /* nav + progress */
  const nav = $('#nav'), progress = $('#progress');
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 24);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* footer year */
  $('#yr').textContent = new Date().getFullYear();

  /* init */
  renderDealTabs(); renderDeals(); renderChips(); renderMenu(); renderCart();
  tiltAll(document);
})();
