const path=require('path');
const express=require('express');
const router=express.Router();
const shopController=require('../controller/shop');


router.get('/',shopController.getShopPage);
router.get('/products/all',shopController.getProductsAll);
router.get('/products/:id',shopController.getProductById);
router.get('/cart/add/:id',shopController.getAddToCartById);
router.get('/cart',shopController.getCartPage);
router.get('/cart/increase/:id',shopController.getIncrease);
router.get('/cart/decrease/:id',shopController.getDecrease);

router.get('/cart/buy',shopController.getProductsBuy);
router.get('/buy/:productId', shopController.getOrderByProductId);
router.get('/order/history',shopController.getOrderHistory);

router.get('/order/review/:id',shopController.getReviewPage);



router.post('/order/reviews',shopController.postProductReview);
module.exports=router;