/**
 * Cart Controller
 * Handles Session-Based Cart Management & Direct WhatsApp Ordering
 */

const { getProductById, getProductBySlug } = require('../data/products');

// Helper to initialize cart in session
function getOrCreateCart(req) {
  if (!req.session.cart) {
    req.session.cart = {
      items: [],
      note: ''
    };
  }
  return req.session.cart;
}

// Recalculate totals and session cartCount
function calculateCartTotals(cart) {
  let subtotal = 0;
  let totalItems = 0;

  cart.items.forEach(item => {
    const itemTotal = (item.price + (item.optionPrice || 0)) * item.quantity;
    item.itemTotal = itemTotal;
    subtotal += itemTotal;
    totalItems += item.quantity;
  });

  // South Indian boutique free shipping rule: above ₹999 free, otherwise ₹99
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + shipping;

  return {
    subtotal,
    shipping,
    grandTotal,
    totalItems
  };
}

// ── Render Full Cart Page ──
const getCartPage = (req, res) => {
  const cart = getOrCreateCart(req);
  const totals = calculateCartTotals(cart);
  req.session.cartCount = totals.totalItems;

  const whatsappPhone = process.env.WHATSAPP_PHONE || '919876543210';

  res.render('cart', {
    title: "Your Shopping Bag | Manjura's Aadaigal",
    cart,
    totals,
    whatsappPhone
  });
};

// ── Add Item to Cart ──
const addToCart = (req, res) => {
  try {
    const { productId, quantity = 1, size = '', blouseOption = '', customNote = '' } = req.body;
    const qty = Math.max(1, parseInt(quantity, 10) || 1);

    const product = getProductById(productId);
    if (!product) {
      if (req.xhr || req.headers.accept?.includes('json')) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.redirect('/?msg=product_not_found');
    }

    const cart = getOrCreateCart(req);

    // Calculate add-on cost if custom blouse option was picked
    let optionPrice = 0;
    let selectedOptionName = '';
    if (product.options?.hasBlouseOptions && blouseOption) {
      const opt = product.options.blouseOptions.find(b => b.id === blouseOption);
      if (opt) {
        optionPrice = opt.price;
        selectedOptionName = opt.name;
      }
    }

    // Unique key for item variation in cart
    const itemKey = `${product.id}_${size}_${blouseOption}`;

    const existingIndex = cart.items.findIndex(item => item.key === itemKey);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += qty;
    } else {
      cart.items.push({
        key: itemKey,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category,
        size: size || null,
        blouseOption: blouseOption || null,
        optionName: selectedOptionName || null,
        optionPrice: optionPrice,
        quantity: qty,
        customNote: customNote.trim()
      });
    }

    const totals = calculateCartTotals(cart);
    req.session.cartCount = totals.totalItems;

    if (req.xhr || req.headers.accept?.includes('json') || req.query.format === 'json') {
      return res.json({
        success: true,
        message: `${product.name} added to cart!`,
        cartCount: totals.totalItems,
        totals,
        cart
      });
    }

    res.redirect('/cart');
  } catch (error) {
    console.error('Cart add error:', error);
    res.status(500).redirect('/cart?error=true');
  }
};

// ── Update Item Quantity ──
const updateQuantity = (req, res) => {
  const { key, delta, quantity } = req.body;
  const cart = getOrCreateCart(req);

  const itemIndex = cart.items.findIndex(item => item.key === key);
  if (itemIndex > -1) {
    if (quantity !== undefined) {
      const q = parseInt(quantity, 10);
      if (q <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = q;
      }
    } else if (delta !== undefined) {
      const d = parseInt(delta, 10);
      cart.items[itemIndex].quantity += d;
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }
    }
  }

  const totals = calculateCartTotals(cart);
  req.session.cartCount = totals.totalItems;

  if (req.xhr || req.headers.accept?.includes('json')) {
    return res.json({
      success: true,
      cartCount: totals.totalItems,
      totals,
      cart
    });
  }

  res.redirect('/cart');
};

// ── Remove Item ──
const removeItem = (req, res) => {
  const { key } = req.body;
  const cart = getOrCreateCart(req);

  cart.items = cart.items.filter(item => item.key !== key);

  const totals = calculateCartTotals(cart);
  req.session.cartCount = totals.totalItems;

  if (req.xhr || req.headers.accept?.includes('json')) {
    return res.json({
      success: true,
      cartCount: totals.totalItems,
      totals,
      cart
    });
  }

  res.redirect('/cart');
};

// ── Update Order / Delivery Note ──
const updateCartNote = (req, res) => {
  const { note } = req.body;
  const cart = getOrCreateCart(req);
  cart.note = (note || '').trim();

  if (req.xhr || req.headers.accept?.includes('json')) {
    return res.json({ success: true, note: cart.note });
  }
  res.redirect('/cart');
};

// ── Get Cart Data JSON (for Drawer / Header Badge) ──
const getCartJson = (req, res) => {
  const cart = getOrCreateCart(req);
  const totals = calculateCartTotals(cart);
  req.session.cartCount = totals.totalItems;

  res.json({
    success: true,
    cart,
    totals,
    cartCount: totals.totalItems,
    whatsappPhone: process.env.WHATSAPP_PHONE || '919876543210'
  });
};

// ── Generate WhatsApp Direct Checkout URL for entire Cart ──
const getCartWhatsAppUrl = (req, res) => {
  const cart = getOrCreateCart(req);
  const totals = calculateCartTotals(cart);

  if (cart.items.length === 0) {
    return res.redirect('/cart');
  }

  const phone = (process.env.WHATSAPP_PHONE || '919876543210').replace(/[^0-9]/g, '');

  let message = `*Namaskaram Manjura's Aadaigal!* 🌸\nI would like to place an order from your website.\n\n*🛍️ ORDER SUMMARY:*\n`;

  cart.items.forEach((item, idx) => {
    message += `\n${idx + 1}. *${item.name}*`;
    if (item.size) message += `\n   • Size: ${item.size}`;
    if (item.optionName) message += `\n   • Custom Blouse/Addon: ${item.optionName}`;
    message += `\n   • Qty: ${item.quantity} × ₹${item.price + (item.optionPrice || 0)}`;
    message += ` = ₹${item.itemTotal.toLocaleString('en-IN')}`;
    message += `\n   • Product link: https://manjurasaadaigal.in/product/${item.slug}\n`;
  });

  message += `\n─────────────────────`;
  message += `\n*Subtotal:* ₹${totals.subtotal.toLocaleString('en-IN')}`;
  message += `\n*Shipping:* ${totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}`;
  message += `\n*Total Payable:* ₹${totals.grandTotal.toLocaleString('en-IN')}`;

  if (cart.note) {
    message += `\n\n*Special Instructions:* ${cart.note}`;
  }

  message += `\n\nPlease let me know your UPI / Bank details to confirm delivery! 🙏`;

  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  res.redirect(waUrl);
};

module.exports = {
  getCartPage,
  addToCart,
  updateQuantity,
  removeItem,
  updateCartNote,
  getCartJson,
  getCartWhatsAppUrl,
  calculateCartTotals
};
