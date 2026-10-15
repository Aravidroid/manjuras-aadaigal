const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');

// Home & Newsletter
router.get('/', homeController.getHomepage);
router.post('/newsletter', homeController.subscribeNewsletter);

// Catalog & Product Details
router.get('/products', productController.getAllProductsPage);
router.get('/new-arrivals', productController.getAllProductsPage);
router.get('/collections', productController.getAllProductsPage);
router.get('/category/:category', productController.getCategoryPage);
router.get('/product/:slug', productController.getProductDetail);

// Cart Routes
router.get('/cart', cartController.getCartPage);
router.get('/api/cart', cartController.getCartJson);
router.post('/cart/add', cartController.addToCart);
router.post('/cart/update', cartController.updateQuantity);
router.post('/cart/remove', cartController.removeItem);
router.post('/cart/note', cartController.updateCartNote);
router.get('/cart/whatsapp-checkout', cartController.getCartWhatsAppUrl);

module.exports = router;
