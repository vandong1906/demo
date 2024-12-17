const express = require('express');
const router = express.Router();
const modules=require('./infras/transport/index');
router.get('/', modules.get);
router.get('/where/:id', modules.getProduct);
router.get('/limit', modules.getLimitProduct);
router.post('/', modules.createProduct);
router.put('/:id', modules.updateProduct);
router.delete('/:id', modules.removeProduct);
router.get("/pagination",modules.getProductsWithPagination)
module.exports = router;