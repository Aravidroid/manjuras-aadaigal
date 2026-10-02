const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.getHomepage);
router.post('/newsletter', homeController.subscribeNewsletter);

module.exports = router;
