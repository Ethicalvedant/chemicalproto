/**
 * ==========================================================================
 * ROSEBLOOM — Natural Rose Flower Perfume
 * Interactive Application & E-Commerce Logic
 * ==========================================================================
 */

// 1. Global State
const state = {
  currency: '$',
  currencyCode: 'USD',
  prices: {
    '30ml': 18.00,
    '50ml': 28.00,
  },
  selectedSize: '50ml',
  selectedQty: 1,
  cart: [
    {
      id: 'rb-50ml',
      name: 'RoseBloom Eau de Parfum (Prototype)',
      size: '50ml',
      price: 28.00,
      qty: 1,
      image: 'assets/images/rosebloom-hero.jpg'
    }
  ],
  appliedCoupon: null,
  activeStep: 1,
  stepsData: [
    {
      step: 1,
      name: "Harvesting",
      title: "1. Fresh Rose Petal Harvesting",
      desc: "Fresh Rosa Damascena and garden rose petals are gently hand-picked at early dawn, before the morning sun evaporates the delicate volatile essential oil compounds within the petals.",
      temp: "Ambient (18°C - 22°C)",
      duration: "Early Morning (6:00 - 8:00 AM)",
      equipment: "Breathable wicker baskets & soft linen cloths",
      image: "assets/images/rose-petals.jpg"
    },
    {
      step: 2,
      name: "Cleaning",
      title: "2. Gentle Cleaning & Petal Crushing",
      desc: "Petals are carefully inspected and rinsed in cold distilled water to remove pollen dust and outdoor debris, then gently bruised and crushed using a clean porcelain mortar to rupture the aromatic gland cells without thermal degradation.",
      temp: "Room Temperature (20°C)",
      duration: "45 Minutes",
      equipment: "Laboratory glass wash basin, porcelain pestle & mortar",
      image: "assets/images/rose-petals.jpg"
    },
    {
      step: 3,
      name: "Extraction",
      title: "3. Fragrance Extraction (Maceration)",
      desc: "The bruised rose petals are immersed in a balanced aqueous-hydroethanolic extraction medium. Slow maceration and gentle hydro-distillation release both the light floral top notes and deeper rose hydrosol volatiles.",
      temp: "Controlled Low Heat (38°C - 42°C)",
      duration: "4 to 6 Hours Infusion",
      equipment: "Borosilicate reaction flask & condenser coil",
      image: "assets/images/lab-extraction.jpg"
    },
    {
      step: 4,
      name: "Filtration",
      title: "4. Multi-Stage Precision Filtration",
      desc: "The crude aromatic extract is drawn through fine grade Whatman filter paper and a clean sintered glass funnel to eliminate all microscopic plant fibers, leaving a clear, luminous, rose-tinted botanical aromatic liquid.",
      temp: "20°C (Chilled Filtration)",
      duration: "30 Minutes",
      equipment: "Buchner funnel, vacuum flask & micro-pore filter paper",
      image: "assets/images/lab-extraction.jpg"
    },
    {
      step: 5,
      name: "Blending",
      title: "5. Cosmetic-Grade Ethanol Blending",
      desc: "The pure rose extract is formulated with measured cosmetic-grade ethanol. The alcohol acts as an organic solvent to hold the aromatic essential molecules in uniform suspension and facilitate aerosol atomization when sprayed.",
      temp: "Room Temperature (21°C)",
      duration: "20 Minutes Homogenization",
      equipment: "Volumetric pipettes, magnetic laboratory stirrer",
      image: "assets/images/ingredients-still.jpg"
    },
    {
      step: 6,
      name: "Fixation",
      title: "6. Measured Glycerin Addition",
      desc: "A carefully weighed micro-dose of pure vegetable glycerin is introduced. This natural humectant bonds with the rose aroma volatiles, slowing their evaporation on human skin and providing a smooth, non-drying skin contact feel.",
      temp: "Room Temperature (21°C)",
      duration: "15 Minutes Gradual Blending",
      equipment: "Analytical balance (±0.01g), precision dropper",
      image: "assets/images/ingredients-still.jpg"
    },
    {
      step: 7,
      name: "Maturation",
      title: "7. Maturation & Olfactory Harmonization",
      desc: "The final blended perfume is stored in amber glass bottles in a dark, temperature-controlled curing chamber. Over a 14-day resting phase, ethanol sharpness diminishes, and the natural rose notes harmonize into a cohesive, velvety fragrance.",
      temp: "Cool Curing (15°C - 18°C)",
      duration: "14 Days Minimum Maturation",
      equipment: "UV-protected amber storage vessels, dark curing closet",
      image: "assets/images/sustainable-box.jpg"
    }
  ]
};

// 2. Helper Functions
function formatPrice(amount) {
  return `${state.currency}${Number(amount).toFixed(2)}`;
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// 3. UI Update Functions
function updatePriceDisplay() {
  const currentPrice = state.prices[state.selectedSize];
  const priceDisplay = document.getElementById('product-price-display');
  if (priceDisplay) {
    priceDisplay.textContent = formatPrice(currentPrice);
  }

  // Update size option cards
  const card30 = document.getElementById('size-card-30ml');
  const card50 = document.getElementById('size-card-50ml');
  if (card30) {
    const priceTag = card30.querySelector('.size-price-tag');
    if (priceTag) priceTag.textContent = formatPrice(state.prices['30ml']);
  }
  if (card50) {
    const priceTag = card50.querySelector('.size-price-tag');
    if (priceTag) priceTag.textContent = formatPrice(state.prices['50ml']);
  }

  // Also update formula / specs preview if visible
  renderCart();
}

function setProductSize(size) {
  state.selectedSize = size;
  document.querySelectorAll('.size-option-card').forEach(card => {
    card.classList.toggle('active', card.dataset.size === size);
  });
  updatePriceDisplay();
}

// 4. Cart Drawer Logic
function openCart() {
  document.getElementById('cart-drawer')?.classList.add('open');
  document.getElementById('cart-backdrop')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-drawer')?.classList.remove('open');
  document.getElementById('cart-backdrop')?.classList.remove('open');
  document.body.style.overflow = '';
}

function renderCart() {
  const cartList = document.getElementById('cart-items-list');
  const badge = document.getElementById('cart-badge-count');
  const subtotalEl = document.getElementById('cart-subtotal-val');
  const totalEl = document.getElementById('cart-total-val');
  const discountRow = document.getElementById('cart-discount-row');
  const discountVal = document.getElementById('cart-discount-val');

  if (!cartList) return;

  const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  if (badge) badge.textContent = totalCount;

  if (state.cart.length === 0) {
    cartList.innerHTML = `
      <div class="cart-empty-state">
        <div class="cart-empty-icon">🥀</div>
        <p>Your sample cart is currently empty.</p>
        <button class="btn btn-primary btn-sm" style="margin-top: 1rem;" onclick="closeCart(); location.href='#product-showcase'">Select A Sample</button>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = formatPrice(0);
    if (totalEl) totalEl.textContent = formatPrice(0);
    if (discountRow) discountRow.style.display = 'none';
    return;
  }

  let subtotal = 0;
  cartList.innerHTML = state.cart.map((item, idx) => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    return `
      <div class="cart-item-card">
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-size">Size: ${item.size} • Handmade Prototype</div>
          <div class="cart-item-price">${formatPrice(item.price)} each</div>
          <div class="cart-item-footer">
            <div class="cart-mini-qty">
              <button onclick="changeCartQty(${idx}, -1)">−</button>
              <span>${item.qty}</span>
              <button onclick="changeCartQty(${idx}, 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeCartItem(${idx})">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  let discount = 0;
  if (state.appliedCoupon) {
    discount = subtotal * state.appliedCoupon.rate;
    if (discountRow) {
      discountRow.style.display = 'flex';
      discountVal.textContent = `-${formatPrice(discount)} (${state.appliedCoupon.code})`;
    }
  } else {
    if (discountRow) discountRow.style.display = 'none';
  }

  const finalTotal = Math.max(0, subtotal - discount);
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (totalEl) totalEl.textContent = formatPrice(finalTotal);
}

function changeCartQty(index, delta) {
  if (!state.cart[index]) return;
  state.cart[index].qty += delta;
  if (state.cart[index].qty <= 0) {
    state.cart.splice(index, 1);
  }
  renderCart();
}

function removeCartItem(index) {
  state.cart.splice(index, 1);
  renderCart();
  showToast("Item removed from cart");
}

function addToCart() {
  const currentPrice = state.prices[state.selectedSize];
  const sizeName = state.selectedSize;
  const existingIndex = state.cart.findIndex(i => i.size === sizeName);

  if (existingIndex > -1) {
    state.cart[existingIndex].qty += state.selectedQty;
  } else {
    state.cart.push({
      id: `rb-${sizeName}`,
      name: `RoseBloom Eau de Parfum (${sizeName})`,
      size: sizeName,
      price: currentPrice,
      qty: state.selectedQty,
      image: sizeName === '50ml' ? 'assets/images/rosebloom-hero.jpg' : 'assets/images/sustainable-box.jpg'
    });
  }

  renderCart();
  showToast(`Added ${state.selectedQty} × RoseBloom (${sizeName}) to bag!`);
  openCart();
}

function applyCoupon() {
  const input = document.getElementById('coupon-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (code === 'STUDENT10' || code === 'CAMPUS2026' || code === 'ROSE15') {
    const rate = code === 'ROSE15' ? 0.15 : 0.10;
    state.appliedCoupon = { code, rate };
    renderCart();
    showToast(`Coupon applied! Saved ${rate * 100}% on sample`);
    input.value = '';
  } else {
    showToast("Invalid code. Try 'STUDENT10' or 'CAMPUS2026'");
  }
}

// 5. Timeline Logic
function updateTimelineStep(stepNum) {
  state.activeStep = stepNum;
  const stepData = state.stepsData.find(s => s.step === stepNum) || state.stepsData[0];

  // Update indicators
  document.querySelectorAll('.timeline-step-indicator').forEach(ind => {
    ind.classList.toggle('active', Number(ind.dataset.step) === stepNum);
  });

  // Update progress bar
  const progressFill = document.getElementById('timeline-progress-fill');
  if (progressFill) {
    const percentage = ((stepNum - 1) / (state.stepsData.length - 1)) * 100;
    progressFill.style.width = `${Math.max(12, percentage)}%`;
  }

  // Update spotlight card
  const titleEl = document.getElementById('spotlight-title');
  const tagEl = document.getElementById('spotlight-tag');
  const descEl = document.getElementById('spotlight-desc');
  const tempEl = document.getElementById('spotlight-temp');
  const durationEl = document.getElementById('spotlight-duration');
  const equipEl = document.getElementById('spotlight-equipment');
  const imgEl = document.getElementById('spotlight-img');

  if (titleEl) titleEl.textContent = stepData.title;
  if (tagEl) tagEl.textContent = `Step 0${stepData.step} • Artisanal Extraction Phase`;
  if (descEl) descEl.textContent = stepData.desc;
  if (tempEl) tempEl.textContent = stepData.temp;
  if (durationEl) durationEl.textContent = stepData.duration;
  if (equipEl) equipEl.textContent = stepData.equipment;
  if (imgEl) {
    imgEl.style.opacity = '0.4';
    setTimeout(() => {
      imgEl.src = stepData.image;
      imgEl.style.opacity = '1';
    }, 150);
  }
}

function nextTimelineStep() {
  const next = state.activeStep >= state.stepsData.length ? 1 : state.activeStep + 1;
  updateTimelineStep(next);
}

function prevTimelineStep() {
  const prev = state.activeStep <= 1 ? state.stepsData.length : state.activeStep - 1;
  updateTimelineStep(prev);
}

// 6. Price Customizer Modal Logic
function openPriceModal() {
  const modal = document.getElementById('price-settings-modal');
  if (!modal) return;

  document.getElementById('edit-price-30').value = state.prices['30ml'];
  document.getElementById('edit-price-50').value = state.prices['50ml'];
  document.getElementById('edit-currency-select').value = state.currencyCode;

  modal.classList.add('open');
}

function closePriceModal() {
  document.getElementById('price-settings-modal')?.classList.remove('open');
}

function savePriceSettings(e) {
  e?.preventDefault();
  const price30 = parseFloat(document.getElementById('edit-price-30').value);
  const price50 = parseFloat(document.getElementById('edit-price-50').value);
  const currencyCode = document.getElementById('edit-currency-select').value;

  const symbolMap = {
    'USD': '$',
    'INR': '₹',
    'EUR': '€',
    'GBP': '£'
  };

  if (!isNaN(price30) && price30 > 0) state.prices['30ml'] = price30;
  if (!isNaN(price50) && price50 > 0) state.prices['50ml'] = price50;
  state.currencyCode = currencyCode;
  state.currency = symbolMap[currencyCode] || '$';

  // update cart items with new prices
  state.cart.forEach(item => {
    if (item.size === '30ml') item.price = state.prices['30ml'];
    if (item.size === '50ml') item.price = state.prices['50ml'];
  });

  updatePriceDisplay();
  closePriceModal();
  showToast("Sample pricing & currency updated successfully!");
}

// 7. Simulated Checkout Modal
function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast("Your cart is empty. Add a sample bottle first!");
    return;
  }
  closeCart();
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;

  const orderNum = 'RB-' + Math.floor(100000 + Math.random() * 900000);
  document.getElementById('checkout-order-number').textContent = orderNum;
  document.getElementById('checkout-summary-total').textContent = document.getElementById('cart-total-val').textContent;

  modal.classList.add('open');
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal')?.classList.remove('open');
}

function submitDemonstrationOrder(e) {
  e.preventDefault();
  const name = document.getElementById('checkout-name')?.value || 'Student Evaluator';
  const email = document.getElementById('checkout-email')?.value || 'evaluator@college.edu';
  
  closeCheckoutModal();
  state.cart = [];
  renderCart();
  
  showToast(`Prototype sample order confirmed for ${name}! Receipt sent to ${email}`);
}

// 8. Gallery Thumbnail Switcher
function setupGallery() {
  const mainImg = document.getElementById('product-main-image');
  const thumbs = document.querySelectorAll('.thumb-btn');

  thumbs.forEach(btn => {
    btn.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const newSrc = btn.dataset.full;
      if (mainImg && newSrc) {
        mainImg.style.opacity = '0.3';
        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.style.opacity = '1';
        }, 120);
      }
    });
  });
}

// 9. FAQ Accordions
function setupFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });
}

// 10. Scent Finder Quiz Modal
function openQuizModal() {
  document.getElementById('quiz-modal')?.classList.add('open');
}

function closeQuizModal() {
  document.getElementById('quiz-modal')?.classList.remove('open');
}

function answerQuiz(option) {
  const resultBox = document.getElementById('quiz-result');
  const questionsBox = document.getElementById('quiz-questions');
  if (questionsBox) questionsBox.style.display = 'none';
  if (resultBox) {
    resultBox.style.display = 'block';
    const noteMap = {
      day: "Morning Dew & Rosebud: Perfect for study sessions, fresh mornings, and subtle botanical radiance.",
      evening: "Velvet Petal & Deep Rose: Beautiful for quiet evenings, calm focus, and elegant gatherings.",
      all: "Pure Clean Damask: An intimate skin scent that complements any mood without overwhelming the room."
    };
    document.getElementById('quiz-recommendation-text').textContent = noteMap[option] || noteMap.all;
  }
}

function resetQuiz() {
  const resultBox = document.getElementById('quiz-result');
  const questionsBox = document.getElementById('quiz-questions');
  if (questionsBox) questionsBox.style.display = 'block';
  if (resultBox) resultBox.style.display = 'none';
}

// 11. Initial Setup & Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
    // Close nav when clicking any link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }

  // Header Scroll Effect
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // Quantity controls on product page
  const qtyPlus = document.getElementById('product-qty-plus');
  const qtyMinus = document.getElementById('product-qty-minus');
  const qtyVal = document.getElementById('product-qty-value');

  if (qtyPlus && qtyMinus && qtyVal) {
    qtyPlus.addEventListener('click', () => {
      state.selectedQty = Math.min(10, state.selectedQty + 1);
      qtyVal.textContent = state.selectedQty;
    });
    qtyMinus.addEventListener('click', () => {
      state.selectedQty = Math.max(1, state.selectedQty - 1);
      qtyVal.textContent = state.selectedQty;
    });
  }

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email').value;
      if (email) {
        showToast(`Thank you! ${email} has been added to our prototype waitlist.`);
        newsletterForm.reset();
      }
    });
  }

  // Size option cards
  document.querySelectorAll('.size-option-card').forEach(card => {
    card.addEventListener('click', () => {
      const size = card.dataset.size;
      setProductSize(size);
    });
  });

  // Setup sub-components
  setupGallery();
  setupFAQ();
  updateTimelineStep(1);
  updatePriceDisplay();
  renderCart();
});
