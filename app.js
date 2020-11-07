const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const path = require('path');
const expressSession = require("express-session");
const  multer = require('multer');
const SendOtp = require('sendotp');

const Publishable_key = process.env.API_PUBLISHED_KEY;
const Secret_key = process.env.API_SECURITY_KEY;

const stripe = require('stripe')(Secret_key);


const MongoDBStore = require('connect-mongodb-session')(expressSession);

const PORT = process.env.PORT || 5000;

const MONGODB_URI = "mongodb+srv://Pankaj:Pankaj@cluster0.1qoj1.mongodb.net/Kudo_app?retryWrites=true&w=majority";


const store= new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) =>{
		cb(null, 'images');
	},
	filename: (req, file, cb) =>{
		cb(null, file.filename+'-'+file.originalname);
	}
 });
 
 const fileFilter = (req, file, cb) =>{
   if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === '')
   {
	   cb(null, true);
   }
   else
   {
	   cb(null, false);
   }
 };

app.set('view engine', 'ejs');
app.set('views','views');

app.use(bodyparser.json({limit: '50mb'}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use('/public',express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({
    extended : true
,limit: '50mb'}));
app.use(
    expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store : store
}));



app.use('/views',express.static(path.join(__dirname,'views')));

const adminRoutes = require('./routes/adminRoute');
const userRoutes = require('./routes/userRoute');

app.get('/', function(req, res){ 
    res.render('home', { 
    key: Publishable_key 
    }) 
})

// app.post('/payment', function(req, res){ 

//     // Moreover you can take more details from user 
//     // like Address, Name, etc from form 
//     stripe.customers.create({ 
//         email: req.body.stripeEmail, 
//         source: req.body.stripeToken, 
//         name: 'Gautam Sharma', 
//         address: { 
//             line1: 'TC 9/4 Old MES colony', 
//             postal_code: '110092', 
//             city: 'New Delhi', 
//             state: 'Delhi', 
//             country: 'India', 
//         } 
//     }) 
//     .then((customer) => { 

//         return stripe.charges.create({ 
//             amount: 7000,    // Charing Rs 25 
//             description: 'Web Development Product', 
//             currency: 'USD', 
//             customer: customer.id 
//         }); 
//     }) 
//     .then((charge) => { 
//         res.send("Success") // If no error occurs 
//     }) 
//     .catch((err) => { 
//         res.send(err)    // If some error occurs 
//     }); 
// })

app.use((req, res, next)=>{
    res.locals.isAuthenticated = req.session.isLoggedin;
next();
});
app.use('/api/', userRoutes);

app.use('/', adminRoutes); 

mongoose.connect(MONGODB_URI,
    {userNewUrlParser: true},
    () =>  console.log('Connected to DB!')
);


app.listen(PORT);
