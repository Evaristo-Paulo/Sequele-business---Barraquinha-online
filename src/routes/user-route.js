const express = require('express');
const route = express.Router();
const userController = require('../controller/user-controller')
const middleware = require('../services/middleware')



route.get('/', middleware.currentUser, userController.get_users)

route.get('/signup',middleware.currentUser, userController.get_signup)

route.post('/signup', userController.post_signup)

route.get('/login',middleware.currentUser, userController.get_login)

route.post('/login', userController.post_login)

route.get('/forgot-password', userController.get_forgot_password)

route.post('/forgot-password', userController.post_forgot_password)

route.get('/logout', userController.logout)

route.get('/:id/show', userController.get_user)

route.delete('/:id/remove', userController.delete_user)

route.get('/profile',middleware.requireAuth, middleware.currentUser, userController.profile)


module.exports = route;