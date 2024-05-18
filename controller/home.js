const Products=require('../models/products');
const getProductCategoryWise=require('../utils/library');
module.exports.getHome=async (req,res,next)=>{
    try{
        let prod=await Products.find();
    res.render('index',{
        prod:getProductCategoryWise(prod)
    });
    }catch(err){
        next(err);
    }
}