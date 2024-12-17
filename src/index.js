var express = require('express');
var app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require("body-parser")
app.use(express.json());
require('dotenv').config();
const fileUpload = require('express-fileupload');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname,'uploads')));
console.log(path.join(__dirname,'uploads'));
/*-------------------------------test-------------------------------- */

/*-------------------------------test-------------------------------- */
app.use(cors({
  origin: 'http://localhost:5173',
  allowedHeaders: ['sessionId', 'Content-Type', 'Authorization'],
  exposedHeaders: ['sessionId'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  preflightContinue: false,
}));
const brand = require('./modules/brand/module');
const product = require('./modules/product/module');
const user = require('./modules/user/module');
const CartShopping = require('./modules/CartShopping/module');
const size = require('./modules/size/module');
const cart = require('./modules/cart/module');
const sequelize = require('./configs/db.config');
sequelize.sync();

app.use('/v1/brand', brand);
app.use('/v1/product', product);
app.use('/v1/cart', cart);
app.use('/v1/user', user);
app.use('/v1/CartShopping', CartShopping);
app.use('/v1/size', size);
app.get('/', (req, res) => {
  res.send('sucees').status(200);
})


app.listen(3000);