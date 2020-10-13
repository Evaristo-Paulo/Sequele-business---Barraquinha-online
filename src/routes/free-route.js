const express = require('express');
const route = express.Router();
const middleware = require('../services/middleware')


const freeController = require('../controller/free-controller')

route.get('/', middleware.currentUser, freeController.introduction)
route.get('/market', middleware.currentUser, freeController.market)

module.exports = route;