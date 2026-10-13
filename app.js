(function(){
  const D = window.HB;
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => [...el.querySelectorAll(s)];
  const money = n => 'Rs. ' + Number(n).toLocaleString('en-PK');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ICONS = {pizza:'🍕',burger:'🍔',fries:'🍟',wings:'🍗',pasta:'🍝',sandwich:'🥪',roll:'🌯',bowl:'🥘',icecream:'🍨',soup:'🍲',fish:'🐟'};

  /* ---------- CART ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('hb_cart') || '[]'); } catch(e){ cart = []; }
  const save = () => { try { localStorage.setItem('hb_cart', JSON.stringify(cart)); } catch(e){} };

  function addToCart(name, detail, price){
    const key = name + '|' + detail;
    const hit = cart.find(i => i.key === key);
    if (hit) hit.qty++; else cart.push({ key, name, detail, price, qty: 1 });
    save(); renderCart(); toast(name + ' added to your order');
    const b = $('#openCart'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  }
  const total = () => cart.reduce((s,i) => s + i.price * i.qty, 0);
  const count = () => cart.reduce((s,i) => s + i.qty, 0);

  function renderCart(){
    $('#cartCount').textContent = count();
    $('#cartTotal').textContent = money(total());
    const body = $('#cartBody');
    if (!cart.length){
      body.innerHTML = '<div class="empty-cart"><b>🍕</b>Your order is empty.<br>Add a deal or something from the menu.</div>';
      return;
    }
    body.innerHTML = cart.map((i, idx) => `
      <div class="ci-row">
        <div class="t">${esc(i.name)}</div><div class="p">${money(i.price * i.qty)}</div>
        ${i.detail ? `<div class="d">${esc(i.detail)}</div>` : ''}
        <div class="qty">
          <button data-act="dec" data-i="${idx}" aria-label="Decrease">−</button>
          <b>${i.qty}</b>
          <button data-act="inc" data-i="${idx}" aria-label="Increase">+</button>
          <button class="rm" data-act="rm" data-i="${idx}">Remove</button>
        </div>
      </div>`).join('');
  }

  $('#cartBody').addEventListener('click', e => {
    const b = e.target.closest('button[data-act]'); if (!b) return;
    const i = +b.dataset.i, a = b.dataset.act;
    if (a === 'inc') cart[i].qty++;
    if (a === 'dec') { cart[i].qty--; if (cart[i].qty <= 0) cart.splice(i,1); }
    if (a === 'rm') cart.splice(i,1);
    save(); renderCart();
  });

  const drawer = $('#drawer'), overlay = $('#overlay');
  function openDrawer(){ drawer.classList.add('open'); overlay.classList.add('show'); drawer.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
  function closeDrawer(){ drawer.classList.remove('open'); overlay.classList.remove('show'); drawer.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  $('#openCart').onclick = openDrawer;
  $('#closeCart').onclick = closeDrawer;
  overlay.onclick = closeDrawer;

  /* ---------- WHATSAPP ---------- */
  const waLink = text => `https://wa.me/${D.whatsapp}?text=${encodeURIComponent(text)}`;
  const greet = 'Assalam o Alaikum Heavybites Havelian! I would like to place an order.';
  $('#fabWa').href = waLink(greet);
  $('#waDirect').href = waLink(greet);

  $('#orderForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!cart.length){ toast('Add something to your order first'); return; }
    const name = $('#custName').value.trim(), tel = $('#custPhone').value.trim();
    const addr = $('#custAddr').value.trim(), note = $('#custNote').value.trim();
    let msg = `*New Order – Heavybites Havelian*\n\n`;
    cart.forEach((i, n) => {
      msg += `${n+1}. ${i.name}${i.detail ? ' (' + i.detail + ')' : ''} x${i.qty} – ${money(i.price * i.qty)}\n`;
    });
    msg += `\n*Total: ${money(total())}*\nDelivery: FREE (Havelian)\n\n`;
    msg += `*Name:* ${name}\n*Phone:* ${tel}\n*Address:* ${addr}`;
    if (note) msg += `\n*Note:* ${note}`;
    window.open(waLink(msg), '_blank', 'noopener');
  });

  /* ---------- DEALS ---------- */
  let activeDeal = D.dealGroups[0].id;
  function renderDealTabs(){
    $('#dealTabs').innerHTML = D.dealGroups.map(g =>
      `<button class="tab ${g.id===activeDeal?'active':''}" role="tab" data-id="${g.id}">${esc(g.title)}</button>`).join('');
  }
  function renderDeals(){
    const g = D.dealGroups.find(x => x.id === activeDeal);
    $('#dealGrid').innerHTML = g.deals.map((d, i) => `
      <article class="deal" style="animation-delay:${i*60}ms">
        <span class="deal-tag">${esc(g.badge)}</span>
        <h4>${esc(d.name)}</h4>
        <p>${esc(d.items)}</p>
        <div class="deal-foot">
          <div class="price">${money(d.price)}</div>
          <button class="add" data-g="${g.id}" data-i="${i}">Add +</button>
        </div>
      </article>`).join('');
  }
  $('#dealTabs').addEventListener('click', e => {
    const t = e.target.closest('.tab'); if (!t) return;
    activeDeal = t.dataset.id; renderDealTabs(); renderDeals();
  });
  $('#dealGrid').addEventListener('click', e => {
    const b = e.target.closest('.add'); if (!b) return;
    const g = D.dealGroups.find(x => x.id === b.dataset.g);
    const d = g.deals[+b.dataset.i];
    addToCart(d.name, g.title.includes('HB') ? d.items : g.title + ': ' + d.items, d.price);
    b.classList.add('added'); b.textContent = 'Added ✓';
    setTimeout(() => { b.classList.remove('added'); b.textContent = 'Add +'; }, 1200);
  });

  /* deal posters */
  const posters = [
    ['assets/deals/deals-999.jpg', 'Deals 999 poster'],
    ['assets/deals/cafe-1250.jpg', 'Food Cafe deals 1250 poster'],
    ['assets/deals/feast-1499.jpg', 'Special Feast Deals 1499 poster'],
    ['assets/deals/special-1500.jpg', 'Special Deals 1500 poster']
  ];
  $('#posterRow').innerHTML = posters.map(p =>
    `<button data-src="${p[0]}" data-alt="${p[1]}" aria-label="View ${p[1]}"><img src="${p[0]}" alt="${p[1]}" loading="lazy"></button>`).join('');

  /* ---------- MENU ---------- */
  let activeCat = 'all', query = '';
  function renderChips(){
    $('#menuChips').innerHTML = [{id:'all',title:'All'}, ...D.menu].map(c =>
      `<button class="chip ${c.id===activeCat?'active':''}" data-id="${c.id}">${esc(c.title)}</button>`).join('');
  }
  function catHTML(c, items){
    let h = `<section class="cat"><div class="cat-head"><div class="ci">${ICONS[c.icon]||'🍽️'}</div><h3>${esc(c.title)}</h3></div>`;
    if (c.note) h += `<div class="cat-note">${esc(c.note)}</div>`;
    if (c.type === 'sizes'){
      const cols = `1.4fr repeat(${c.sizes.length}, 1fr)`;
      h += `<div class="sizes-head" style="grid-template-columns:${cols}"><span></span>${c.sizes.map(s=>`<span>${esc(s)}</span>`).join('')}</div>`;
      items.forEach(it => {
        h += `<div class="row sz" style="grid-template-columns:${cols}"><div class="nm">${esc(it.name)}</div>`;
        it.prices.forEach((p, si) => {
          h += p == null
            ? `<div class="pr"><span class="na">–</span></div>`
            : `<div class="pr"><button data-c="${c.id}" data-n="${esc(it.name)}" data-s="${esc(c.sizes[si])}" data-p="${p}">${p}</button></div>`;
        });
        h += `</div>`;
      });
      if (c.extra){
        h += `<div class="extra"><b>${esc(c.extra.title)}</b>` +
          c.extra.sizes.map((s,i)=>`<div><span>${esc(s)}</span><span><b>Rs. ${c.extra.prices[i]}</b></span></div>`).join('') + `</div>`;
      }
    } else {
      items.forEach(it => {
        const priceTxt = it.price != null ? it.price : it.priceText;
        const addable = it.price != null;
        h += `<div class="row one"><div class="nm">${esc(it.name)}</div><div class="pr">Rs. ${priceTxt}</div>` +
          (addable ? `<button class="plus" data-c="${c.id}" data-n="${esc(it.name)}" data-p="${it.price}" aria-label="Add ${esc(it.name)}">+</button>` : `<span></span>`) + `</div>`;
      });
    }
    return h + `</section>`;
  }
  function renderMenu(){
    const q = query.toLowerCase();
    let out = '';
    D.menu.forEach((c, ci) => {
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

  /* size picker (only used when one-tap isn't enough, kept for keyboard users) */
  $('#menuGrid').addEventListener('click', e => {
    const b = e.target.closest('button[data-p]'); if (!b) return;
    const n = b.dataset.n, p = +b.dataset.p, s = b.dataset.s;
    addToCart(n, s ? 'Size ' + s : '', p);
  });

  /* ---------- LIGHTBOX ---------- */
  const lb = $('#lightbox');
  function openLB(src, alt){ $('#lbImg').src = src; $('#lbImg').alt = alt || ''; lb.classList.add('show'); lb.setAttribute('aria-hidden','false'); }
  function closeLB(){ lb.classList.remove('show'); lb.setAttribute('aria-hidden','true'); }
  $('#posterRow').addEventListener('click', e => { const b = e.target.closest('button'); if (b) openLB(b.dataset.src, b.dataset.alt); });
  $('#openMenuCard').onclick = () => openLB('assets/full-menu.jpg', 'Heavybites Havelian full menu card');
  $('#lbClose').onclick = closeLB;
  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape'){ closeLB(); closeDrawer(); } });

  /* ---------- MISC ---------- */
  function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 1800); }
  window.addEventListener('scroll', () => $('#nav').classList.toggle('scrolled', scrollY > 30), { passive: true });
  $('#yr').textContent = new Date().getFullYear();

  // embers
  const em = $('.embers');
  for (let i = 0; i < 22; i++){
    const s = document.createElement('i'); s.className = 'ember';
    s.style.left = Math.random()*100 + '%';
    s.style.animationDuration = (6 + Math.random()*7) + 's';
    s.style.animationDelay = (-Math.random()*10) + 's';
    em.appendChild(s);
  }

  renderDealTabs(); renderDeals(); renderChips(); renderMenu(); renderCart();
})();
