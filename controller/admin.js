
const Products=require('../models/products');
const getProductCategoryWise = require('../utils/library');
module.exports.postProductsAdd=async (req,res,next)=>{
    const {name,price,description,seller,imageUrl,category}=req.body;
    try{
        await Products.create({
            name,
            price,
            description,
            seller,
            imageUrl,
            category
        })
        res.redirect('/admin/products/all');
    }catch(err){
        res.send(err);
    }
}
module.exports.getAdminPage=(req,res,next)=>{
    res.render('admin/home',{
        isAdmin:true
    });
}
module.exports.getProductAdd=(req,res,next)=>{
    res.render('admin/add-product',{
        isAdmin:true
    })
}
module.exports.getProductsAll=async (req,res,next)=>{
    let prod=await Products.find();
    res.render('admin/products-list',{
        prod:getProductCategoryWise(prod)
    });
}

module.exports.getProductId=async (req,res,next)=>{
    let {id}=req.params;
    try{
        let prod=await Products.findById(id);
        res.render('admin/update-product',{
            prod,
            id,
            isAdmin:true
        });
    }catch(err){
        next(err);
    }
    
}
module.exports.updateProductId=async (req,res,next)=>{
    let {name,price,description,seller,imageUrl,id}=req.body;
    try{
        let prod=await Products.updateOne({_id:id},{
            $set:{name,price,description,seller,imageUrl}
        });
        res.redirect('/admin/products/all');
    }catch(err){
        next(err);
    }
}

module.exports.deleteById=async (req,res,next)=>{
    let {id}=req.params;
    try{
        let prod=await Products.deleteOne({_id:id});
        res.redirect('/admin/products/all')
    }catch(err){
        next(err);
    }
}
