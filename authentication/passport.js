const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('../models/user');
const bcrypt=require('bcrypt');
passport.use(new LocalStrategy(
    async function(username, password, done) {

        try{
            let user=await User.findOne({username});
            if(!user){
                return done(null,false);
            }
            bcrypt.compare(password, user.password, function(err, result) {
                if(!result) return done(null,false);

                return done(null,user);
            });
        }catch(err){
            done(err);
        }
    }
));

//serialize and deserialize
passport.serializeUser(function(user, done) {
    done(null, user._id);
});
  
  passport.deserializeUser(async function(id, done) {
    try{
        let user=await User.findOne({_id:id});
        if(!user){
            return done(null,false);
        }
        return done(null,user);
    }catch(err){
        done(err);
    }
  });

const GoogleStrategy = require('passport-google-oauth20');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try{
        console.log(profile);
        let user=await User.findOne({
            googleId:profile.id,
        });
        if(!user){
            user=await User.create({
                googleId:profile.id,
                username:profile.displayName,
                googleImg:profile._json.picture,
                googleAccessToken:accessToken
            })
        }
        return done(null,user);
    }catch(err){
        done(err);
    }
   
  }
));
module.exports=passport;