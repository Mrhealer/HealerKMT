var LocalStrategy       = require('passport-local').Strategy;
var FacebookStrategy    = require('passport-facebook').Strategy;
var GoogleStrategy      = require('passport-google-oauth').OAuth2Strategy;
var configAuth          = require("../../configs/auth");

// load up the user model
var User                = require('../../models/user/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log("user_in: " + JSON.stringify(user));
        done(null, user);
    });
    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        console.log("user_out: " + JSON.stringify(user));
        done(null, user);
    });
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { 
        // callback with email and password from our form input
        var obj = {
            strLoginCode: req.body.email,
            strPassword: req.body.password
        }
        User.signin(obj, done, function(result){
            if(result==""||result==null||result==undefined){
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }
           return done(null, {result: result, token:"178d"});
        });

    }));
    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use("google", new GoogleStrategy({
        
        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {
        console.log("token: " + token);
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            var newUser          = {};
            
            // set all of the relevant information
            newUser.id    = profile.id;
            newUser.token = token;
            newUser.name  = profile.displayName;
            newUser.email = profile.emails[0].value; // pull the first email
            // save the user and return
            return done(null, newUser);
        });

    }));
    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use("facebook", new FacebookStrategy({
        
        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            var newUser   = {};
            // set all of the facebook information in our user model
            newUser.id    = profile.id; // set the users facebook id                   
            newUser.token = token; // we will save the token that facebook provides to the user                    
            newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
            //newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
            return done(null, newUser);
        });

    }));
        
};
