const Products=require('../models/products');
const Users=require('../models/user');
const getProductCategoryWise=require('../utils/library');
const mongoose=require('mongoose')
module.exports.getProductsAll=async (req,res,next)=>{
    try{
        let prod=await Products.find();
        res.render('',{
            prod:getProductCategoryWise(prod),
            isLoggedIn:req.isAuthenticated(),
            isAdmin:(req.user.role=='admin')
        })
    }catch(err){
        next(err);
    }
}

module.exports.getShopPage=async (req,res,next)=>{
    try{
        let prod=await Products.find();
        res.render('shop/home',{
            prod:getProductCategoryWise(prod),
            isLoggedIn:req.isAuthenticated(),
            isAdmin:(req.user.role==='admin')
        })
    }catch(err){
        next(err);
    }
}

module.exports.getProductById=async (req,res,next)=>{
    let {id}=req.params;
    try{   
        let prod=await Products.findById(id);
        res.render('shop/product-details',{
            prod,
            id,
            isLoggedIn:req.isAuthenticated(),
            isAdmin:(req.user.role==='admin')
        })

    }catch(err){
        next(err);
    }
}

module.exports.getAddToCartById=async (req,res,next)=>{
    let {id}=req.params;
    try{   
        let cart=req.user.cart;
        let indx=-1;
        cart.forEach((item,i)=>{
            if(item.id==id){
                indx=i;
            }
        })

        if(indx==-1){
            cart.unshift({
                id,
                quantity:1
            })
        }
        else{
            cart[indx].quantity++;
        }
        //to make sure db mein changes save ho rhe h
        req.user.save();

        res.redirect('/shop/cart');
    }catch(err){
        next(err);
    }
}

module.exports.getCartPage=async (req,res,next)=>{
    try{
        const {id}=req.params;
        let user=await Users.findOne({_id:req.user._id}).populate('cart.id'); 
        let totalPrice=0;
        user.cart.forEach((item)=>{
            totalPrice+=((item.id.price)*(item.quantity))
        })
        res.render('shop/cart',{
            cart:user.cart,
            totalPrice,
            isLoggedIn:req.isAuthenticated(),
            isAdmin:(req.user.role==='admin')
        });
    }catch(err){
        next(err);
    }
    
}

module.exports.getIncrease = async (req, res, next) => {
    const { id } = req.params;
    let cart = req.user.cart;
    let indx;
    cart.forEach((item, i) => {
        if (item.id == id) {
            indx = i;
        }
    })

    cart[indx].quantity++;
    try {
        await req.user.save();
        let user = await Users.findOne({ _id: req.user._id }).populate('cart.id');
        let totalPrice = 0;
        user.cart.forEach((item) => {
            totalPrice += item.id.price * item.quantity;
        })
        res.send({
            id: user.cart,
            totalPrice
        });
    } catch (err) {
        next(err);
    }

}


module.exports.getDecrease = async (req, res, next) => {
    const { id } = req.params;
    let cart = req.user.cart;
    let indx;
    cart.forEach((item, i) => {
        if (item.id == id) {
            indx = i;
        }
    })
    if (cart[indx].quantity > 1)
        cart[indx].quantity--;
    else if (cart[indx].quantity == 1)
        cart.splice(indx, 1);
    try {
        await req.user.save();
        let user = await Users.findOne({ _id: req.user._id }).populate('cart.id');
        let totalPrice = 0;
        user.cart.forEach((item) => {
            totalPrice += item.id.price * item.quantity;
        })
        res.send({
            id:user.cart,
            totalPrice
        });
    } catch (err) {
        next(err);
    }
}
module.exports.getProductsBuy=async (req,res,next)=>{
    try{
        let user=await Users.findOne({_id:req.user._id}).populate('cart.id');
        let cart=user.cart;
        let newOrder=[];
        cart.forEach((item)=>{
            let order={};
            order.product={id:item.id._id};
            order.quantity=item.quantity;
            order.totalPrice=item.id.price*order.quantity;
            newOrder.push(order);
        })
        await Users.findByIdAndUpdate(req.user._id,{
            cart:[]
        })
        req.user.orders.push({products:newOrder});
        await req.user.save();
        res.redirect('/shop/order/history')
    }catch(err){
        next(err);
    }
}

module.exports.getOrderHistory=async (req,res,next)=>{
    try{
        let user=await Users.findOne({_id:req.user._id}).populate('orders.products.product.id');
        let orders=user.orders
        orders.forEach((o)=>{
            let currentDate=o.date;
            var day = ("0" + currentDate.getDate()).slice(-2);
            var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
            var year = currentDate.getFullYear();
            o.date= day + "/" + month + "/" + year;
        })
        res.render('shop/orders',{
            orders,
            isLoggedIn:true,
            isAdmin:(req.user.role==='admin')
        });
    }catch(err){
        next(err);
    }
}

module.exports.getReviewPage=async (req,res,next)=>{
    try{
        let {id}=req.params;
        let prod=await Products.findOne({_id:id});
        res.render('shop/review',{
            prod,
            isLoggedIn:true,
            isAdmin:(req.user.role==='admin')
        });
    }catch(err){
        next(err);
    }
}
module.exports.postProductReview=async (req,res,next)=>{
   try{
    let {id,rev}=req.body;
    let prod=await Products.findOne({_id:id});
    prod.reviews.push(rev);
    console.log("Yahan hu");
    await prod.save();
    res.redirect('/shop');
   }catch(err){
        next(err);
   }
}

module.exports.getOrderByProductId=async (req,res,next)=>{
   let {productId}=req.params;
   console.log(productId);
     try{
        let prod=await Products.findById(productId);
         req.user.orders.push({
             products:[
                 {
                     product:{id:productId},
                     quantity:1,
                     totalPrice:prod.price
                 }
             ]
         })

         await req.user.save();
         res.redirect('/shop/order/history');
     }catch(err){
         next(err);
     }
 }