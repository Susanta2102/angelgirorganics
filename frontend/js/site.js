/* =========================================================
   Angel Organics — site behaviour
   ========================================================= */
(function () {
    'use strict';

    const WHATSAPP_NUMBER = '918811013758';
    const PHONE_DISPLAY = '+91 8811013758';
    const MAPS_URL = 'https://maps.app.goo.gl/293WBoybHLjSEcer7';
    const BULK_THRESHOLD = 2000;
    const BULK_PERCENT = 5;
    const OPEN_HOUR = 6;   // Daily: 6:00 AM - 8:00 PM
    const CLOSE_HOUR = 20;

    const PRODUCTS = {
        milk:       { name: 'Fresh Gir Cow A2 Milk', price: 75,   unit: 'Liter', step: 0.5 },
        ghee:       { name: 'Golden A2 Ghee',        price: 2500, unit: 'Kg',    step: 0.5 },
        ghee500:    { name: 'Golden A2 Ghee',        price: 1300, unit: '500g',  step: 1 },
        butter:     { name: 'Fresh Butter',          price: 1200, unit: 'Kg',    step: 0.5 },
        buttermilk: { name: 'Probiotic Buttermilk',  price: 30,   unit: 'Liter', step: 0.5 },
        curd:       { name: 'Thick Curd',            price: 100,  unit: 'Kg',    step: 0.5 }
    };

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const rupees = (n) => '₹' + n.toFixed(2);
    const rupeesShort = (n) => '₹' + (Number.isInteger(n) ? n : n.toFixed(2));
    const fmtQty = (n) => (Math.round(n * 100) / 100).toString();
    // "1.5 Liter", but "2 × 500g" for pack-sized units
    const qtyLabel = (n, unit) => /^\d/.test(unit) ? `${fmtQty(n)} × ${unit}` : `${fmtQty(n)} ${unit}`;
    const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function openWhatsApp(text) {
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
        const win = window.open(url, '_blank', 'noopener');
        if (!win) window.location.href = url;
    }

    /* ---------------- Toasts ---------------- */
    const toastStack = $('#toastStack');
    function toast(message, type = 'info', ms = 3200) {
        const icons = { success: 'check-circle', warning: 'exclamation-triangle', info: 'info-circle' };
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        el.setAttribute('role', type === 'warning' ? 'alert' : 'status');
        el.innerHTML = `<i class="fas fa-${icons[type] || icons.info}"></i><div>${escapeHtml(message)}</div>`;
        toastStack.appendChild(el);
        while (toastStack.children.length > 3) toastStack.firstElementChild.remove();
        setTimeout(() => {
            el.classList.add('out');
            el.addEventListener('animationend', () => el.remove(), { once: true });
            setTimeout(() => el.remove(), 600);
        }, ms);
    }

    async function copyText(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            }
        } catch (e) { /* fall through to legacy copy */ }
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
        document.body.appendChild(ta);
        ta.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        ta.remove();
        return ok;
    }

    /* ---------------- Header, nav, scroll ---------------- */
    const header = $('#siteHeader');
    const nav = $('#mainNav');
    const menuToggle = $('#menuToggle');
    const progress = $('#scrollProgress');
    const backToTop = $('#backToTop');
    const ring = $('#backToTopRing');
    const RING_LEN = 125.66;

    function setMenu(open) {
        nav.classList.toggle('open', open);
        document.body.classList.toggle('menu-open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    menuToggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    $$('.nav-link', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && !nav.contains(e.target) && !menuToggle.contains(e.target)) setMenu(false);
    });

    let ticking = false;
    function onScroll() {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, y / max) : 0;
        header.classList.toggle('scrolled', y > 40);
        progress.style.transform = `scaleX(${p})`;
        backToTop.classList.toggle('show', y > 500);
        ring.style.strokeDashoffset = String(RING_LEN * (1 - p));
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

    // Highlight the nav link for the section in view
    const navLinks = $$('.nav-link', nav);
    const spyTargets = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
    if ('IntersectionObserver' in window) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        spyTargets.forEach((t) => spy.observe(t));
    }

    /* ---------------- Reveal on scroll ---------------- */
    const revealEls = $$('[data-reveal]');
    if ('IntersectionObserver' in window && !reducedMotion) {
        const revealer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const siblings = $$('[data-reveal]', entry.target.parentElement).filter((el) => !el.classList.contains('in'));
                const delay = Math.max(0, siblings.indexOf(entry.target)) * 80;
                setTimeout(() => entry.target.classList.add('in'), Math.min(delay, 400));
                revealer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach((el) => revealer.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('in'));
    }

    /* ---------------- Stats count-up ---------------- */
    const counters = $$('[data-count]');
    function runCounters() {
        counters.forEach((el) => {
            const end = parseInt(el.dataset.count, 10);
            if (reducedMotion) { el.textContent = end; return; }
            const start = performance.now();
            const dur = 1800;
            (function tick(now) {
                const t = Math.min(1, (now - start) / dur);
                el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3)));
                if (t < 1) requestAnimationFrame(tick);
            })(start);
        });
    }
    const statsEl = $('#statsSection');
    if (statsEl && 'IntersectionObserver' in window) {
        const so = new IntersectionObserver((entries) => {
            if (entries.some((e) => e.isIntersecting)) { runCounters(); so.disconnect(); }
        }, { threshold: 0.3 });
        so.observe(statsEl);
    } else {
        runCounters();
    }

    /* ---------------- Open now (Daily 6 AM – 8 PM, India time) ---------------- */
    function updateOpenStatus() {
        let hour;
        try {
            hour = parseInt(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Asia/Kolkata' }).format(new Date()), 10);
        } catch (e) {
            hour = new Date().getHours();
        }
        const open = hour >= OPEN_HOUR && hour < CLOSE_HOUR;
        $$('[data-open-status]').forEach((el) => {
            el.classList.toggle('is-open', open);
            el.classList.toggle('is-closed', !open);
            $('.label', el).textContent = open ? 'Open now · until 8:00 PM' : 'Closed now · opens 6:00 AM';
        });
    }
    updateOpenStatus();
    setInterval(updateOpenStatus, 60 * 1000);

    /* ---------------- Cart / Bill calculator ---------------- */
    const STORAGE_KEY = 'angelOrganicsCart';
    let cart = [];
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (Array.isArray(saved)) cart = saved.filter((i) => PRODUCTS[i.id] && i.quantity > 0);
    } catch (e) { cart = []; }

    function saveCart() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable */ }
    }

    function totals() {
        const subtotal = cart.reduce((s, i) => s + PRODUCTS[i.id].price * i.quantity, 0);
        const discount = subtotal >= BULK_THRESHOLD ? subtotal * BULK_PERCENT / 100 : 0;
        return { subtotal, discount, total: subtotal - discount };
    }

    function addToCart(id, qty) {
        const p = PRODUCTS[id];
        if (!p || !(qty > 0)) return;
        const line = cart.find((i) => i.id === id);
        if (line) line.quantity = Math.round((line.quantity + qty) * 100) / 100;
        else cart.push({ id, quantity: qty });
        saveCart();
        renderCart(true);
        toast(`${p.name} (${qtyLabel(qty, p.unit)}) added to cart!`, 'success');
    }

    function setQuantity(id, qty) {
        const line = cart.find((i) => i.id === id);
        if (!line) return;
        if (qty <= 0) return removeFromCart(id);
        line.quantity = Math.round(qty * 100) / 100;
        saveCart();
        renderCart(true);
    }

    function removeFromCart(id) {
        const p = PRODUCTS[id];
        cart = cart.filter((i) => i.id !== id);
        saveCart();
        renderCart(true);
        toast(`${p ? p.name : 'Item'} removed from cart`, 'info');
    }

    const cartList = $('#cartList');
    const cartItems = $('#cartItems');
    const cartEmpty = $('#cartEmpty');
    const summary = $('#billSummary');
    const cartPill = $('#cartPill');
    const totalEl = $('#totalAmount');

    function renderCart(changed) {
        const { subtotal, discount, total } = totals();
        const count = cart.length;

        cartItems.hidden = count === 0;
        cartEmpty.hidden = count > 0;
        summary.classList.toggle('is-empty', count === 0);

        cartList.innerHTML = cart.map((i) => {
            const p = PRODUCTS[i.id];
            return `
                <li class="cart-row" data-id="${i.id}">
                    <div><strong>${escapeHtml(p.name)}</strong><small>${rupees(p.price)} / ${p.unit}</small></div>
                    <div class="mini-stepper">
                        <button type="button" data-cart-step="-1" aria-label="Decrease ${escapeHtml(p.name)}"><i class="fas fa-minus"></i></button>
                        <span>${qtyLabel(i.quantity, p.unit)}</span>
                        <button type="button" data-cart-step="1" aria-label="Increase ${escapeHtml(p.name)}"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="amount">${rupees(p.price * i.quantity)}</div>
                    <button type="button" class="remove-btn" data-cart-remove aria-label="Remove ${escapeHtml(p.name)}"><i class="fas fa-trash"></i></button>
                </li>`;
        }).join('');

        $('#subtotal').textContent = rupees(subtotal);
        $('#discountRow').hidden = discount === 0;
        $('#discountAmount').textContent = '-' + rupees(discount);
        totalEl.textContent = rupees(total);
        if (changed && !reducedMotion) {
            totalEl.classList.remove('flash');
            void totalEl.offsetWidth;
            totalEl.classList.add('flash');
        }

        // Bulk discount progress
        const meter = $('#discountMeter');
        meter.hidden = count === 0;
        meter.classList.toggle('done', discount > 0);
        $('#meterFill').style.width = Math.min(100, (subtotal / BULK_THRESHOLD) * 100) + '%';
        $('#meterText').textContent = discount > 0
            ? `🎉 Bulk Discount Applied! You saved ${rupees(discount)} (5% off)`
            : `Add ${rupees(BULK_THRESHOLD - subtotal)} more for 5% bulk discount!`;

        // Header badge, floating pill, order form link
        $$('[data-cart-count]').forEach((el) => {
            el.textContent = count;
            el.hidden = count === 0;
            if (changed && el.classList.contains('cart-count')) {
                el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
            }
        });
        $$('[data-cart-total]').forEach((el) => { el.textContent = rupeesShort(total); });
        $$('[data-cart-summary]').forEach((el) => { el.textContent = `${count} item${count === 1 ? '' : 's'} · ${rupees(total)}`; });
        $('#attachBillWrap').hidden = count === 0;
        updatePill();
    }

    // Show the floating bill pill only when the calculator itself is off-screen
    let calcVisible = false;
    function updatePill() {
        cartPill.hidden = cart.length === 0 || calcVisible;
    }
    if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
            calcVisible = entries[0].isIntersecting;
            updatePill();
        }, { threshold: 0.05 }).observe($('#calculator'));
    }

    cartList.addEventListener('click', (e) => {
        const row = e.target.closest('.cart-row');
        if (!row) return;
        const id = row.dataset.id;
        const line = cart.find((i) => i.id === id);
        if (!line) return;
        const stepBtn = e.target.closest('[data-cart-step]');
        if (stepBtn) setQuantity(id, line.quantity + PRODUCTS[id].step * parseInt(stepBtn.dataset.cartStep, 10));
        if (e.target.closest('[data-cart-remove]')) removeFromCart(id);
    });

    // Calculator form
    const productSelect = $('#productSelect');
    const qtyInput = $('#quantityInput');
    const unitDisplay = $('#unitDisplay');

    productSelect.addEventListener('change', () => {
        const p = PRODUCTS[productSelect.value];
        unitDisplay.textContent = p ? p.unit : '';
        qtyInput.step = p ? p.step : 0.5;
        qtyInput.min = p ? p.step : 0.5;
        productSelect.classList.remove('invalid');
    });
    qtyInput.addEventListener('input', () => qtyInput.classList.remove('invalid'));

    $$('[data-qty-step]').forEach((b) => b.addEventListener('click', () => {
        const step = (PRODUCTS[productSelect.value] || { step: 0.5 }).step;
        const next = Math.max(0, (parseFloat(qtyInput.value) || 0) + step * parseInt(b.dataset.qtyStep, 10));
        qtyInput.value = next ? fmtQty(next) : '';
        qtyInput.classList.remove('invalid');
    }));
    $$('[data-qty-set]').forEach((b) => b.addEventListener('click', () => {
        qtyInput.value = b.dataset.qtySet;
        qtyInput.classList.remove('invalid');
    }));

    $('#calculatorForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = productSelect.value;
        const qty = parseFloat(qtyInput.value);
        productSelect.classList.toggle('invalid', !id);
        qtyInput.classList.toggle('invalid', !(qty > 0));
        if (!id || !(qty > 0)) {
            toast('Please select a product and enter quantity', 'warning');
            return;
        }
        addToCart(id, qty);
        productSelect.value = '';
        qtyInput.value = '';
        unitDisplay.textContent = '';
    });

    // "Add to Bill" buttons on product cards
    $$('[data-add]').forEach((btn) => btn.addEventListener('click', () => {
        let id = btn.dataset.add;
        if (btn.dataset.sizeGroup) {
            const checked = $(`input[name="${btn.dataset.sizeGroup}"]:checked`);
            if (checked) id = checked.value;
        }
        addToCart(id, 1);
        const html = btn.innerHTML;
        btn.classList.add('added');
        btn.innerHTML = '<i class="fas fa-check"></i>Added';
        setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = html; }, 1400);
    }));

    // Quick order via WhatsApp
    $$('[data-quick-order]').forEach((btn) => btn.addEventListener('click', () => {
        openWhatsApp(`Hello Angel Organics! I want to order ${btn.dataset.quickOrder}. Please send me details about availability and delivery.`);
    }));

    function orderSummaryText() {
        const { subtotal, discount, total } = totals();
        const now = new Date();
        const line = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        let t = '🧾 *ANGEL ORGANICS ORDER REQUEST*\n';
        t += `📅 Date: ${now.toLocaleDateString()}\n`;
        t += `⏰ Time: ${now.toLocaleTimeString()}\n\n`;
        t += '🛒 *CUSTOMER ORDER DETAILS:*\n' + line;
        cart.forEach((i, idx) => {
            const p = PRODUCTS[i.id];
            t += `${idx + 1}. *${p.name}*\n`;
            t += `   📦 Quantity: ${qtyLabel(i.quantity, p.unit)}\n`;
            t += `   💰 Rate: ${rupees(p.price)} per ${p.unit}\n`;
            t += `   💵 Amount: ${rupees(p.price * i.quantity)}\n\n`;
        });
        t += line + '📋 *BILL BREAKDOWN:*\n';
        t += `💰 Subtotal: ${rupees(subtotal)}\n`;
        if (discount > 0) {
            t += `🎉 Bulk Discount (5%): -${rupees(discount)}\n`;
            t += `💡 *Customer saved ${rupees(discount)}!*\n`;
        }
        t += '🚚 Delivery: FREE\n' + line;
        t += `🔥 *TOTAL AMOUNT: ${rupees(total)}*\n` + line + '\n';
        t += '📝 *ORDER SUMMARY:*\n';
        t += `• Total Items: ${cart.length}\n`;
        t += `• Payment Amount: ${rupees(total)}\n\n`;
        t += '🏠 *DELIVERY REQUEST:*\nPlease confirm this order and let me know:\n• Delivery address\n• Preferred delivery time\n• Payment method\n\n';
        t += '✅ Ready to place this order!\nThank you for choosing Angel Organics! 🌿';
        return t;
    }

    function printBill() {
        const { subtotal, discount, total } = totals();
        const rows = cart.map((i) => {
            const p = PRODUCTS[i.id];
            return `<tr><td>${escapeHtml(p.name)}</td><td>${qtyLabel(i.quantity, p.unit)}</td><td>${rupees(p.price)}</td><td>${rupees(p.price * i.quantity)}</td></tr>`;
        }).join('');
        const w = window.open('', '_blank');
        if (!w) { toast('Please allow pop-ups to print the bill.', 'warning'); return; }
        w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Angel Organics - Bill</title>
            <style>
                body{font-family:Arial,sans-serif;margin:32px;color:#1c2a1f}
                .header{text-align:center;border-bottom:3px solid #1f4d2b;padding-bottom:12px;margin-bottom:20px}
                .logo{color:#1f4d2b;font-size:26px;font-weight:bold}
                table{width:100%;border-collapse:collapse;margin:20px 0}
                th,td{border:1px solid #ddd;padding:10px;text-align:left}
                th{background:#1f4d2b;color:#fff}
                .total-row{background:#fbf7ef;font-weight:bold}
                .footer{text-align:center;margin-top:30px;color:#666}
            </style></head><body>
            <div class="header"><div class="logo">🐄 Angel Organics</div>
                <p>Premium Gir Cow Dairy Farm<br>Ajmer, Rajasthan | Phone: ${PHONE_DISPLAY}</p>
                <p><strong>Bill Date:</strong> ${new Date().toLocaleDateString()}</p></div>
            <table><thead><tr><th>Product</th><th>Quantity</th><th>Rate</th><th>Amount</th></tr></thead><tbody>
                ${rows}
                <tr class="total-row"><td colspan="3">Subtotal</td><td>${rupees(subtotal)}</td></tr>
                ${discount > 0 ? `<tr><td colspan="3">Bulk Discount (5%)</td><td>-${rupees(discount)}</td></tr>` : ''}
                <tr><td colspan="3">Delivery Charges</td><td>FREE</td></tr>
                <tr class="total-row"><td colspan="3"><strong>Total Amount</strong></td><td><strong>${rupees(total)}</strong></td></tr>
            </tbody></table>
            <div class="footer"><p>Thank you for choosing Angel Organics!</p><p>For fresh deliveries, call: ${PHONE_DISPLAY}</p><p>Follow us: @angelorganic_ajmer</p></div>
            </body></html>`);
        w.document.close();
        w.focus();
        w.print();
    }

    $$('[data-bill-action]').forEach((btn) => btn.addEventListener('click', async () => {
        const action = btn.dataset.billAction;
        if (cart.length === 0) {
            toast(action === 'clear' ? 'Cart is already empty!' : 'Please add items to cart first!', action === 'clear' ? 'info' : 'warning');
            return;
        }
        if (action === 'whatsapp') {
            toast('Opening WhatsApp with your bill details...', 'success');
            openWhatsApp(orderSummaryText());
        } else if (action === 'copy') {
            const ok = await copyText(orderSummaryText());
            toast(ok ? 'Bill copied to clipboard! Now you can paste it in WhatsApp.' : 'Copy failed. Please manually copy the bill details.', ok ? 'success' : 'warning');
        } else if (action === 'print') {
            printBill();
        } else if (action === 'clear') {
            if (confirm('Are you sure you want to clear the cart?')) {
                cart = [];
                saveCart();
                renderCart(true);
                toast('Cart cleared successfully!', 'info');
            }
        }
    }));

    renderCart(false);

    /* ---------------- Order request form ---------------- */
    $('#orderForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const fields = ['name', 'phone', 'product'].map((id) => $('#' + id));
        let valid = true;
        fields.forEach((f) => {
            const bad = !f.value.trim();
            f.classList.toggle('invalid', bad);
            if (bad) valid = false;
        });
        if (!valid) {
            toast('Please fill in all required fields!', 'warning');
            fields.find((f) => f.classList.contains('invalid')).focus();
            return;
        }
        let msg = '🐄 *Angel Organics Order Request*\n\n';
        msg += `👤 *Name:* ${$('#name').value.trim()}\n`;
        msg += `📱 *Phone:* ${$('#phone').value.trim()}\n`;
        msg += `🥛 *Product:* ${$('#product').value}\n`;
        msg += `💬 *Message:* ${$('#message').value.trim()}\n`;
        if (cart.length && $('#attachBill').checked) {
            const { total } = totals();
            msg += '\n🛒 *Items from my bill:*\n';
            cart.forEach((i) => {
                const p = PRODUCTS[i.id];
                msg += `• ${p.name} — ${qtyLabel(i.quantity, p.unit)} (${rupees(p.price * i.quantity)})\n`;
            });
            msg += `🔥 *Total: ${rupees(total)}*\n`;
        }
        msg += '\nThank you for choosing Angel Organics! 🌿';
        openWhatsApp(msg);
        toast("Order request sent successfully! We'll contact you soon. 🐄", 'success', 4500);
        this.reset();
        $('#attachBill').checked = true;
    });
    $$('#orderForm input, #orderForm select').forEach((f) => f.addEventListener('input', () => f.classList.remove('invalid')));

    /* ---------------- Testimonials ---------------- */
    const track = $('#testimonialTrack');
    $$('.testimonial-text', track).forEach((q) => {
        q.classList.add('clamped');
        requestAnimationFrame(() => {
            if (q.scrollHeight - q.clientHeight < 4) { q.classList.remove('clamped'); return; }
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'read-more';
            btn.textContent = 'Read more';
            btn.setAttribute('aria-expanded', 'false');
            btn.addEventListener('click', () => {
                const open = q.classList.toggle('clamped') === false;
                btn.textContent = open ? 'Show less' : 'Read more';
                btn.setAttribute('aria-expanded', String(open));
            });
            q.after(btn);
        });
    });
    function slideBy(dir) {
        const card = $('.testimonial-card', track);
        const step = card ? card.getBoundingClientRect().width + 24 : track.clientWidth;
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
        if (dir > 0 && atEnd) track.scrollTo({ left: 0 });
        else if (dir < 0 && track.scrollLeft <= 8) track.scrollTo({ left: track.scrollWidth });
        else track.scrollBy({ left: dir * step });
    }
    $$('[data-slide]').forEach((b) => b.addEventListener('click', () => slideBy(parseInt(b.dataset.slide, 10))));

    /* ---------------- Gallery + lightbox ---------------- */
    const grid = $('#galleryGrid');
    const items = $$('.gallery-item', grid);
    const moreBtn = $('#galleryMore');
    const INITIAL = window.innerWidth < 640 ? 8 : 12;
    if (items.length > INITIAL) {
        items.slice(INITIAL).forEach((el) => el.classList.add('extra'));
        grid.classList.add('collapsed');
        $('span', moreBtn).textContent = `Show all ${items.length} photos`;
        moreBtn.addEventListener('click', () => {
            const collapsed = grid.classList.toggle('collapsed');
            $('span', moreBtn).textContent = collapsed ? `Show all ${items.length} photos` : 'Show fewer photos';
            if (collapsed) grid.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        });
    } else {
        moreBtn.hidden = true;
    }

    const lb = $('#lightbox');
    const lbImg = $('#lightboxImage');
    const lbCounter = $('#lightboxCounter');
    let lbIndex = 0;
    let lastFocus = null;

    function showPhoto(i) {
        lbIndex = (i + items.length) % items.length;
        const img = $('img', items[lbIndex]);
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt;
        lbCounter.textContent = `${lbIndex + 1} / ${items.length}`;
    }
    function openLightbox(i) {
        lastFocus = document.activeElement;
        showPhoto(i);
        lb.hidden = false;
        document.body.style.overflow = 'hidden';
        document.body.classList.add('overlay-open');
        $('.lightbox-close', lb).focus();
    }
    function closeLightbox() {
        lb.hidden = true;
        document.body.style.overflow = '';
        document.body.classList.remove('overlay-open');
        if (lastFocus) lastFocus.focus();
    }
    items.forEach((el, i) => el.addEventListener('click', () => openLightbox(i)));
    lb.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-lb]');
        if (btn) {
            if (btn.dataset.lb === 'close') closeLightbox();
            if (btn.dataset.lb === 'prev') showPhoto(lbIndex - 1);
            if (btn.dataset.lb === 'next') showPhoto(lbIndex + 1);
        } else if (e.target === lb) {
            closeLightbox();
        }
    });
    let touchX = null;
    lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50) showPhoto(lbIndex + (dx < 0 ? 1 : -1));
        touchX = null;
    });

    /* ---------------- Share ---------------- */
    const sheet = $('#shareSheet');
    const shareText = '🐄 Check out Angel Organics - Premium Gir Cow A2 Milk from Ajmer! Fresh daily delivery of pure organic dairy products.';

    function openShareSheet() {
        const url = window.location.href.split('#')[0];
        const enc = encodeURIComponent;
        $('#shareGrid').innerHTML = `
            <a href="https://wa.me/?text=${enc(shareText + ' ' + url)}" target="_blank" rel="noopener"><i class="fab fa-whatsapp" style="color:#1fa855"></i>WhatsApp</a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${enc(url)}" target="_blank" rel="noopener"><i class="fab fa-facebook" style="color:#1877f2"></i>Facebook</a>
            <a href="https://twitter.com/intent/tweet?text=${enc('🐄 Pure A2 Milk from Gir Cows in Ajmer!')}&url=${enc(url)}" target="_blank" rel="noopener"><i class="fab fa-twitter" style="color:#1d9bf0"></i>Twitter</a>
            <button type="button" data-copy-link><i class="fas fa-link" style="color:#1f4d2b"></i>Copy Link</button>
            <a href="sms:?body=${enc('Check out Angel Organics for fresh A2 milk: ' + url)}"><i class="fas fa-sms" style="color:#2f6b3c"></i>SMS</a>
            <a href="mailto:?subject=${enc('Angel Organics - Premium A2 Milk')}&body=${enc('Hi! I wanted to share this amazing organic dairy farm with you: ' + url)}"><i class="fas fa-envelope" style="color:#d38b16"></i>Email</a>`;
        sheet.hidden = false;
        $('[data-close-share]', sheet).focus();
    }
    function closeShareSheet() { sheet.hidden = true; }

    async function shareWebsite() {
        const url = window.location.href.split('#')[0];
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Angel Organics - Premium Gir Cow A2 Milk', text: shareText, url });
                return;
            } catch (err) {
                if (err && err.name === 'AbortError') return;
            }
        }
        openShareSheet();
    }
    $$('[data-share]').forEach((b) => b.addEventListener('click', shareWebsite));
    sheet.addEventListener('click', async (e) => {
        if (e.target === sheet || e.target.closest('[data-close-share]')) closeShareSheet();
        if (e.target.closest('[data-copy-link]')) {
            const ok = await copyText(window.location.href.split('#')[0]);
            toast(ok ? 'Website link copied! 📋' : 'Copy failed. Please copy manually.', ok ? 'success' : 'warning');
            closeShareSheet();
        }
    });

    // Share farm location
    const locBtn = $('[data-share-location]');
    if (locBtn) locBtn.addEventListener('click', async () => {
        const text = '📍 Visit Angel Organics Farm - Premium Gir Cow Dairy in Ajmer\n🥛 Pure A2 Milk & Organic Products';
        if (navigator.share) {
            try { await navigator.share({ title: 'Angel Organics Farm Location', text, url: MAPS_URL }); return; }
            catch (err) { if (err && err.name === 'AbortError') return; }
        }
        const ok = await copyText(`📍 Angel Organics Farm - Ajmer, Rajasthan\n🗺️ Location: ${MAPS_URL}\n📞 Call: ${PHONE_DISPLAY}`);
        toast(ok ? 'Farm location copied! 📍' : 'Copy failed. Please copy manually.', ok ? 'success' : 'warning');
    });

    /* ---------------- Keyboard ---------------- */
    document.addEventListener('keydown', (e) => {
        if (!lb.hidden) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPhoto(lbIndex - 1);
            if (e.key === 'ArrowRight') showPhoto(lbIndex + 1);
            return;
        }
        if (!sheet.hidden && e.key === 'Escape') closeShareSheet();
        if (nav.classList.contains('open') && e.key === 'Escape') { setMenu(false); menuToggle.focus(); }
    });

    /* ---------------- Misc ---------------- */
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
