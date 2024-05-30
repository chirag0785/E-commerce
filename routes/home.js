const path=require('path');
const express=require('express');
const router=express.Router();
const homeController=require('../controller/home');
const passport=require('../authentication/passport')
router.get('/',homeController.getHome);
router.get('/login',homeController.getLogin);
router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

  router.get('/signup',homeController.getSignup);

router.post('/signup',homeController.postSignup);
router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
});
module.exports=router;