const path=require('path');
const express=require('express');
require('dotenv').config()
const app=express();
const mongoose=require('mongoose');
const session=require('express-session')
const MongoStore=require('connect-mongo')
const hbs=require('hbs');
const User=require('./models/user');
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/auth' })
}))
const passport=require('./authentication/passport');
app.use(passport.initialize());
app.use(passport.session());
// app.use(async (req,res,next)=>{
//     try{
//         let user=await User.findOne({
//             _id:'664370061ea1117b0263f003'
//         })
//         req.user=user;
//         next();
//     }catch(err){
//         next(err);
//     }
// })

app.set('view engine','hbs');
app.use(express.static(path.join(__dirname,'public')))
//setting partials of hbs
hbs.registerPartials(__dirname + '/views/partials');
const homeRouter=require('./routes/home');
app.get('/',homeRouter);

app.get('/login',homeRouter);
app.post('/login',homeRouter);
app.get('/signup',homeRouter);
app.post('/signup',homeRouter);
app.post('/logout',homeRouter)
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
const adminRouter=require('./routes/admin')
const shopRouter=require('./routes/shop')
//Routes
const {isAdmin}=require('./middlewares/isAdmin');
const {isLoggedIn}=require('./middlewares/isLoggedIn')
// /admin /admin/abc 
app.use('/admin',isAdmin,adminRouter)

app.use('/shop',isLoggedIn,shopRouter)
const PORT=4000;
mongoose.connect('mongodb://127.0.0.1:27017/CBShop')
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`http://localhost:${PORT}`)
    })
})
.catch((err)=>{
    console.log(err);
})