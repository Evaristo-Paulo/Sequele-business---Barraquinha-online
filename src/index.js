const express = require('express')
const server = express();
var cookieParser = require('cookie-parser')

require('./services/db')
require('dotenv').config(); 

const PORT = process.env.PORT || 8000;

/* Routes */
const userRoute = require('./routes/user-route')
const productRoute = require('./routes/product-route')
const freeRoute = require('./routes/free-route')

server.use(express.json())
server.use(cookieParser())
server.set('view engine', 'ejs');
server.set('views', './src/views');
server.use(express.static('public'))

server.use('/sequelebusinessapp/users', userRoute )
server.use('/sequelebusinessapp/products', productRoute )
server.use('/sequelebusinessapp/', freeRoute )
server.listen(PORT, () => {
    console.log('Server is running on PORT:', PORT);
});