

module.exports = function(app, passport) {
var BackPoc     = require('./models/BackPoc');
var vUsuario     = require('./models/usuario');
var vDigitlogin     = require('./login');
var https = require("https");


    
app.use(function(req, res, next) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('Client IP:', ip);
        next(); 
    });

    app.post('/api/ok', passport.authenticate('local'), function(req, res) {
        console.log("LOGIN OK");
        res.json({res:"ok"});
    });
    app.post('/api/error', passport.authenticate('local'), function(req, res) {
        console.log("LOGIN Error");
        res.json({res:"Error"});
    });
    

    app.post('/api/login', passport.authenticate('local', {
        successRedirect : '/api/ok', // redirect to the secure profile section
        failureRedirect : '/api/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    app.get('/api/login', function(req, res) {
    var data={"success_messages" : req.flash('success_messages'),
                "error_messages": req.flash('error_messages')};

         res.json(data);

    });

    app.post('/api/auth', function(req, res) {
        console.log("*** *** *** ");
        var dlogin=new vDigitlogin.DigitsLogin(req, res,"TEST TEST TEST");
            dlogin.https=https;
            dlogin.model=vUsuario;
            dlogin.login(req.body['X-Verify-Credentials-Authorization']);
    });

    app.param('id', function(req, res, next, id) {
        console.log("Param",id);
         vUsuario.findOne({ 'id_str': id }, function (err, item) {
              if (err) { return next(err); }
              if (!item) { return next(new Error('can\'t find item')); }
              req.item = item;   // posible error
              return next();

            }) 
    });

    app.put('/api/usuarios/:id', function(req, res) {
                req.item.nombre=req.body.nombre;
                req.item.apellido=req.body.apellido;
                req.item.fecha_nacimiento=req.body.fecha_nacimiento;
                req.item.sexo= req.body.sexo;
                req.item.save(function (err) {
                  if (err) {
                    console.log(err);
                  }
                  return res.send(req.item);
                });
    });


    app.get('/api/getCentros', function(req, res) {
      BackPoc.find(function (err, collections) {
                      if (err) return next(err);
                        res.json(collections);
                    });
    });

    /*// =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    */
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}