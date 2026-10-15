/**
 * Product Controller
 * Handles PDP, Category listing, and Direct WhatsApp inquiry for single item
 */

const { getAllProducts, getProductBySlug, getProductsByCategory } = require('../data/products');

const getProductDetail = (req, res) => {
  const { slug } = req.params;
  const product = getProductBySlug(slug);

  if (!product) {
    return res.status(404).render('404', { title: "Product Not Found | Manjura's Aadaigal" });
  }

  // Related products from same category
  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const whatsappPhone = process.env.WHATSAPP_PHONE || '919876543210';

  res.render('product-detail', {
    title: `${product.name} | Manjura's Aadaigal`,
    description: product.shortDesc,
    product,
    relatedProducts,
    whatsappPhone
  });
};

const getCategoryPage = (req, res) => {
  const { category } = req.params;
  const products = getProductsByCategory(category);
  const categoryNames = {
    sarees: 'Traditional Sarees',
    kurtis: 'Artisanal Kurtis',
    chudidars: 'Chudidar & Salwar Sets',
    dresses: 'Ethnic Dresses & Gowns'
  };

  res.render('catalog', {
    title: `${categoryNames[category] || 'Collection'} | Manjura's Aadaigal`,
    category,
    categoryTitle: categoryNames[category] || category.toUpperCase(),
    products
  });
};

const getAllProductsPage = (req, res) => {
  const products = getAllProducts();
  res.render('catalog', {
    title: "All Handcrafted Collections | Manjura's Aadaigal",
    category: 'all',
    categoryTitle: 'All Ethnic Collections',
    products
  });
};

module.exports = {
  getProductDetail,
  getCategoryPage,
  getAllProductsPage
};
