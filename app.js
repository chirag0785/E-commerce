const path=require('path');
const express=require('express');
const app=express();
const mongoose=require('mongoose');
app.use(express.urlencoded({extended:true}));
app.use(express.json())
const hbs=require('hbs');
const User=require('./models/user');
app.use(async (req,res,next)=>{
    try{
        let user=await User.findOne({
            _id:'664370061ea1117b0263f003'
        })
        req.user=user;
        next();
    }catch(err){
        next(err);
    }
})


app.disable('etag');

app.set('view engine','hbs');
app.use(express.static(path.join(__dirname,'public')))
//setting partials of hbs
hbs.registerPartials(__dirname + '/views/partials');
const homeRouter=require('./routes/home');
app.get('/',homeRouter);
const adminRouter=require('./routes/admin')
const shopRouter=require('./routes/shop')
//Routes
// /admin /admin/abc 
app.use('/admin',adminRouter)

app.use('/shop',shopRouter)
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