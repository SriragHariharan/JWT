const express=require('express')
var hbs = require('express-handlebars')
const path=require('path')
require('dotenv').config()
var bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
var cookieParser = require('cookie-parser')
require('./configs/redis')  //redis connected here

const userRouter=require('./routes/user')

const app=express()

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({extname:'hbs', defaultLayout:'layout', layoutsDir:__dirname+'/views/layout/', partialsDir:__dirname+'/views/partials/'}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret:process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}));
app.use(flash());

app.use('/', userRouter)

app.listen(4000, () => console.log("Server started at 4000"))