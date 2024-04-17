// config/passport-config.js
const passport = require('passport');
const authstrategyModel = require('../src/models/authStrategyModel');
const userModel = require('../src/models/userModel');
const { generateRandomString } = require('../src/helpers/utils');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;



const initPassport = async () =>{

    const googleStrategie = await authstrategyModel.findOne({ name: { $regex: /google/i } });
    console.log({googleStrategie});
    if(googleStrategie?.clientId && googleStrategie?.clientSecret && googleStrategie?.callbackURL){

        // Configuration Google
        passport.use(new GoogleStrategy({
            clientID: googleStrategie?.clientId,
            clientSecret: googleStrategie?.clientSecret,
            callbackURL: googleStrategie?.callbackURL
        }, async (accessToken, refreshToken, profile, done) => {
            console.log({accessToken, refreshToken, profile});
            // Code pour gérer l'authentification Google
            const googleId = profile.id;
            const fullName = profile.displayName;
            const email = profile.emails[0].value;
    
            const existingUser = await userModel.findOne({email});
    
            if(existingUser){
                if(!existingUser?.googleId){
                    existingUser.googleId = googleId
                    await existingUser.save()
                }
                //as u can notice i should return existingUser instaded of user
                done(null, existingUser); // <------- i was returning undefined user here.
            }else{
                const user = new userModel({ 
                    googleId, 
                    fullName, 
                    email, 
                    password: generateRandomString(10) 
                });
                await user.save()
                done(null, user);
            }
        }));
    }
    
    // Configuration Facebook
    // passport.use(new FacebookStrategy({
    //     clientID: FACEBOOK_APP_ID,
    //     clientSecret: FACEBOOK_APP_SECRET,
    //     callbackURL: '/auth/facebook/callback'
    // }, (accessToken, refreshToken, profile, done) => {
    //     // Code pour gérer l'authentification Facebook
    // }));
    
    // // Configuration Twitter
    // passport.use(new TwitterStrategy({
    //     consumerKey: TWITTER_CONSUMER_KEY,
    //     consumerSecret: TWITTER_CONSUMER_SECRET,
    //     callbackURL: '/auth/twitter/callback'
    // }, (token, tokenSecret, profile, done) => {
    //     // Code pour gérer l'authentification Twitter
    // }));

}

initPassport()
