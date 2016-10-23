var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../app/models/usuario');

// expose this function to our app using module.exports
module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'id',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, id, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'id' :  id }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            
            /*

            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                var newUser            = new User();
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }*/

        });    

        });

    }));

};