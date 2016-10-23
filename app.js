var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash    = require('connect-flash');

var vUsuario     = require('./app/models/usuario');
   vUsuario.findOne({  "id_str": "788752106371084289" }, function (err, item) {
              console.log("++++",err, item);

            }) 

var app = express();

var modelsDB = require('./app/models/db')
console.log("modelsDB",modelsDB);
// Passport -------------------------------------------

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


// Session -------------------------------------------
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var store = new MongoDBStore(
    {
      uri: modelsDB,
      collection: 'app_sessions'
    });

  // Catch errors
  store.on('error', function(error) {
    assert.ifError(error);
    assert.ok(false);
  });

  app.use(require('express-session')({
    secret: 'This is a secret yeah!!',
    cookie: {
      maxAge: 500 * 1 * 1 * 1 * 1 // 1 week
      //maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      //maxAge: 1000 * 30   // 24 hs
    },
    store: store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,
    saveUninitialized: true
  }));

// Session End -------------------------------------------

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var routes = require('./routes/index');
var users = require('./routes/users');
var todos = require('./routes/todos');
var BackPoc_Route = require('./routes/BackPoc')(passport);

// passport config
//var Account = require('./app/models/usuario');
//passport.use(new LocalStrategy(Account.authenticate()));
//passport.serializeUser(Account.serializeUser());
//passport.deserializeUser(Account.deserializeUser());

mongoose.connect(modelsDB);

require('./config/passport')(passport);

/*
var db = require('./app/models/db');
var  Post=require('./app/models/Posts');
var  Todos=require('./app/models/Todos');
var  BackPoc=require('./app/models/BackPoc');

*/
var debug = require('debug')('flapper-news:server');
var http = require('http');



var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);
var server = http.createServer(app);

console.log("Port",port);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
 
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
 



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.json({verify:function(req,res,buf){req.rawBody=buf}}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




require('./app/routes.js')(app, passport);

//app.use('/', routes);
//app.use('/users', users);
//app.use('/todos', todos);
//app.use('/api', BackPoc_Route);




 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
