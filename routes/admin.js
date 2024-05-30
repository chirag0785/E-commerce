const path=require('path');
const express=require('express');
const router=express.Router();
const adminController=require('../controller/admin')
router.get('/',adminController.getAdminPage)
router.get('/products/all',adminController.getProductsAll)
router.get('/products/add',adminController.getProductAdd)

router.get('/products/update/:id',adminController.getProductId);
router.get('/products/delete/:id',adminController.deleteById);

// router.get('products/:id',)
// router.get('products')
router.post('/products/add',adminController.postProductsAdd)
router.post('/products/update',adminController.updateProductId);

module.exports=router;