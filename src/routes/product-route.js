const express = require('express');
const route = express.Router();
const productController = require('../controller/product-controller')
const middleware = require('../services/middleware')



route.get('/create', middleware.requireAuth, productController.get_create)

route.post('/create', middleware.requireAuth, productController.post_create)

route.get('/:id', productController.get_product)

route.delete('/:id', productController.delete_product)


module.exports = route;