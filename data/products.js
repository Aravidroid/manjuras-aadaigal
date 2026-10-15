/**
 * Mock / Seed products data for Manjura's Aadaigal
 * Contains traditional South Indian sarees, kurtis, and ethnic ensembles
 */

const products = [
  {
    id: 'prod-1',
    slug: 'kanjivaram-silk-saree',
    name: 'Kanjivaram Pure Silk Saree',
    category: 'sarees',
    categoryName: 'Sarees',
    price: 4899,
    originalPrice: 6200,
    badge: 'New',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
    ],
    fabric: 'Pure Mulberry Silk with Zari',
    craft: 'Kanchipuram Handloom Weave',
    color: 'Crimson Red & Royal Gold',
    occasion: 'Bridal & Festive',
    length: '5.5 meters saree with 0.8 meter unstitched blouse piece',
    washCare: 'Dry Clean Only',
    shortDesc: 'A regal Kanchipuram silk saree with intricately woven golden zari temple borders and a magnificent grand pallu.',
    description: "Woven in the historic temples town of Kanchipuram, this heirloom piece represents centuries of weaver heritage. Crafted with pure mulberry silk and laced with lustrous zari, it features a majestic peacock and floral jaal along the border. An unstitched complementary blouse piece is included.",
    options: {
      hasSizes: false,
      hasBlouseOptions: true,
      blouseOptions: [
        { id: 'unstitched', name: 'Unstitched Blouse Piece (Included)', price: 0 },
        { id: 'standard_stitched', name: 'Standard Stitched Blouse (₹499)', price: 499 },
        { id: 'pico_fall', name: 'Fall & Pico / Saree Kuchu (₹250)', price: 250 }
      ]
    }
  },
  {
    id: 'prod-2',
    slug: 'chanderi-block-print-kurti',
    name: 'Chanderi Hand Block Print Kurti',
    category: 'kurtis',
    categoryName: 'Kurtis',
    price: 1299,
    originalPrice: null,
    badge: 'New',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4b5ca4?w=800&auto=format&fit=crop&q=80'
    ],
    fabric: 'Chanderi Cotton Silk',
    craft: 'Traditional Hand Block Print',
    color: 'Olive Sage & Gold',
    occasion: 'Office & Casual Festive',
    length: 'Calf Length (44 inches)',
    washCare: 'Gentle Hand Wash with Mild Detergent',
    shortDesc: 'Airy Chanderi kurti accented with artisanal wooden block prints and subtle gota lace.',
    description: "Infused with effortless everyday grace, this Chanderi kurti combines breathable cotton with subtle silk sheen. Designed with a round neck slit and three-quarter sleeves, perfect for South Indian weather and festive gatherings.",
    options: {
      hasSizes: true,
      sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
      hasBlouseOptions: false
    }
  },
  {
    id: 'prod-3',
    slug: 'anarkali-embroidered-set',
    name: 'Festive Anarkali Embroidered Set',
    category: 'chudidars',
    categoryName: 'Chudidars',
    price: 2799,
    originalPrice: 3500,
    badge: 'Sale',
    images: [
      'https://images.unsplash.com/photo-1585944672832-a1f04bc93c0e?w=800&auto=format&fit=crop&q=80'
    ],
    fabric: 'Georgette with Santoon Lining',
    craft: 'Zari and Sequin Resham Embroidery',
    color: 'Deep Plum Maroon',
    occasion: 'Weddings & Reception',
    length: 'Floor Length Anarkali with Chudidar & Dupatta',
    washCare: 'Dry Clean Recommended',
    shortDesc: 'Opulent flared Anarkali paired with matching stretch chudidar and sequin embroidered organza dupatta.',
    description: "Make heads turn with this exquisitely flared Anarkali set. Embellished with subtle mirror work along the neckline and hemline, creating an ethereal flow as you walk.",
    options: {
      hasSizes: true,
      sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
      hasBlouseOptions: false
    }
  },
  {
    id: 'prod-4',
    slug: 'pashmina-shawl-chudidar',
    name: 'Chudidar Silk Suit Set',
    category: 'chudidars',
    categoryName: 'Chudidars',
    price: 3199,
    originalPrice: null,
    badge: 'New',
    images: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&auto=format&fit=crop&q=80'
    ],
    fabric: 'Art Silk with Jacquard Weave',
    craft: 'Banarasi Jacquard Border',
    color: 'Mustard Sandal & Rust',
    occasion: 'Temple Festivals & Ceremonies',
    length: 'Straight Cut Kurta with Pleated Salwar',
    washCare: 'Dry Clean',
    shortDesc: 'Traditional straight fit kurta with intricate weaving, pleated salwar and contrast dupatta.',
    description: "A tribute to classical South Indian elegance. Rich motifs line the border and neckline, paired with a matching dupatta that drapes with timeless grace.",
    options: {
      hasSizes: true,
      sizes: ['M (38)', 'L (40)', 'XL (42)'],
      hasBlouseOptions: false
    }
  },
  {
    id: 'prod-5',
    slug: 'banarasi-silk-saree',
    name: 'Banarasi Katan Silk Saree',
    category: 'sarees',
    categoryName: 'Sarees',
    price: 5999,
    originalPrice: 7800,
    badge: 'Bestseller',
    images: [
      'https://images.unsplash.com/photo-1592609931095-54a2168ae893?w=800&auto=format&fit=crop&q=80'
    ],
    fabric: 'Katan Silk',
    craft: 'Kadwa Floral Zari Weaving',
    color: 'Emerald Bottle Green & Antique Gold',
    occasion: 'Bridal, Muhurtham & Family Functions',
    length: '6.3 meters including 0.8m running blouse piece',
    washCare: 'Dry Clean Only',
    shortDesc: 'Rich emerald green Katan silk saree woven with antique gold zari shikargah motifs.',
    description: "Celebrated for its heavy drape and regal heirloom finish, this Banarasi saree features opulent antique zari work that gleams beautifully under temple lights.",
    options: {
      hasSizes: false,
      hasBlouseOptions: true,
      blouseOptions: [
        { id: 'unstitched', name: 'Unstitched Blouse Piece (Included)', price: 0 },
        { id: 'standard_stitched', name: 'Standard Stitched Blouse (₹499)', price: 499 },
        { id: 'pico_fall', name: 'Fall & Pico / Kuchu (₹250)', price: 250 }
      ]
    }
  },
  {
    id: 'prod-6',
    slug: 'lucknowi-chikankari-kurti',
    name: 'Lucknowi Chikankari Modal Kurti',
    category: 'kurtis',
    categoryName: 'Kurtis',
    price: 1799,
    originalPrice: null,
    badge: null,
    images: [
      'https://images.unsplash.com/photo-1589810635657-232948472d98?w=800&auto=format&fit=crop&q=80'
    ],
    fabric: 'Pure Modal Cotton',
    craft: 'Handcrafted Bakhiya and Phanda Stitches',
    color: 'Blush Rose Powder',
    occasion: 'Everyday Luxury & Casual Brunches',
    length: 'Calf Length (45 inches)',
    washCare: 'Hand Wash separately in cold water',
    shortDesc: 'Ultra-soft breathable modal cotton kurti embroidered by hand with intricate needlework.',
    description: "Light as a breeze and soft on sensitive skin, this modal kurti is adorned with handcrafted needlework. Pair it with oxidized silver jhumkas for quintessential South Indian elegance.",
    options: {
      hasSizes: true,
      sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
      hasBlouseOptions: false
    }
  },
  {
    id: 'prod-7',
    slug: 'cotton-salwar-set',
    name: 'Chettinad Pure Cotton Salwar Set',
    category: 'chudidars',
    categoryName: 'Chudidars',
    price: 1499,
    originalPrice: 1999,
    badge: 'Sale',
    images: [
      'https://images.unsplash.com/photo-1611282712992-2a2756ba3fb5?w=800&auto=format&fit=crop&q=80'
    ],
    fabric: '100% Coimbatore Combed Cotton',
    craft: 'Handloom Checks with Temple Border',
    color: 'Turmeric Yellow & Maroon',
    occasion: 'Daily Wear & Temple Visits',
    length: 'Knee Length Kurta with Cotton Dupatta',
    washCare: 'Machine Wash Gentle / Cold Water',
    shortDesc: 'Breathable combed cotton suit set featuring authentic Chettinad checks and contrasting dupatta.',
    description: "Specially spun for warm climates, this pure cotton ensemble keeps you cool all day while honoring traditional Tamil handloom aesthetics.",
    options: {
      hasSizes: true,
      sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
      hasBlouseOptions: false
    }
  },
  {
    id: 'prod-8',
    slug: 'organza-party-wear-saree',
    name: 'Organza Silk Floral Saree',
    category: 'sarees',
    categoryName: 'Sarees',
    price: 3499,
    originalPrice: null,
    badge: null,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
    ],
    fabric: 'Glass Organza Silk',
    craft: 'Handpainted Floral Motifs with Scalloped Embroidered Border',
    color: 'Lavender Mauve & Pearl',
    occasion: 'Cocktails, Receptions & Sangeet',
    length: '5.5m saree + 0.8m satin blouse piece',
    washCare: 'Dry Clean Only',
    shortDesc: 'Whisper-light sheer organza saree with delicate hand-embroidered cutwork scallops.',
    description: "Modern sophistication meets timeless ethnic charm. The delicate sheen of organza coupled with scalloped borders makes this saree an absolute showstopper.",
    options: {
      hasSizes: false,
      hasBlouseOptions: true,
      blouseOptions: [
        { id: 'unstitched', name: 'Unstitched Blouse Piece (Included)', price: 0 },
        { id: 'standard_stitched', name: 'Standard Stitched Blouse (₹499)', price: 499 },
        { id: 'pico_fall', name: 'Fall & Pico / Kuchu (₹250)', price: 250 }
      ]
    }
  }
];

function getAllProducts() {
  return products;
}

function getProductBySlug(slug) {
  return products.find(p => p.slug === slug);
}

function getProductById(id) {
  return products.find(p => p.id === id);
}

function getProductsByCategory(category) {
  return products.filter(p => p.category === category);
}

module.exports = {
  products,
  getAllProducts,
  getProductBySlug,
  getProductById,
  getProductsByCategory
};
