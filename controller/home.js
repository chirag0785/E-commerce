const Products=require('../models/products');
const getProductCategoryWise=require('../utils/library');
const bcrypt=require('bcrypt');
const saltRounds=10;
const User=require('../models/user');
module.exports.getLogin=async (req,res,next)=>{
    if(req.isAuthenticated()) return res.redirect('/');
    res.render('login');
}
module.exports.getHome=async (req,res,next)=>{
    if(!req.isAuthenticated()) return res.redirect('/login');
    try{
        let prod=await Products.find();
    res.render('index',{
        prod:getProductCategoryWise(prod),
        isLoggedIn:req.isAuthenticated(),
        isAdmin:(req.user&&req.user.role==='admin')
        
    });
    }catch(err){
        next(err);
    }
}
module.exports.getSignup=async (req,res,next)=>{
    if(req.isAuthenticated()) return res.redirect('/');
    res.render('signup')
}

module.exports.postSignup=async (req,res,next)=>{
        let {username,password}=req.body;
        try{
            let user=await User.findOne({username:username});
            if(user){
                return res.render('signup',{
                    msg:"Username already exists"
                })
            }
            bcrypt.hash(password, saltRounds, async function(err, hash) {
               try{
                user=await User.create({
                    username,
                    password:hash
                })
                return res.redirect('/login');
               }catch(err){
                    return res.status('500').json("Cannot create user right now");
               }
            })
           
        }catch(err){
            next(err);
        }
}
