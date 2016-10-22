var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var https = require("https");

var BackPoc     = require('../models/BackPoc');
var vUsuario     = require('../models/usuario');
var vDigitlogin     = require('./login');

// middleware to use for all requests
// http://localhost:3000/backpoc


/*

var options = {
  hostname: 'api.digits.com',
  path: '/1.1/sdk/account.json',
  method: 'GET',
  protocol: 'https:',
  headers: {
      'Authorization': 'OAuth oauth_signature=jAsjY%2Fa1yIt1yYj%2Fb2gmi7paswQ%3D,oauth_nonce=2762E16D-BA89-4EB2-8A26-DFC2DB5355E2,oauth_timestamp=1477141999,oauth_consumer_key=zIRJzhMzKX32NsznWECvBzVRa,oauth_token=788752106371084289-sM9uS3EZlZPxZJZVKshYcvyoZFIAX4w,oauth_version=1.0,oauth_signature_method=HMAC-SHA1',
      'Content-Type': 'application/json',
  }
};


var req = https.request(options, function(res) {
  res.setEncoding('utf8');
  res.on('data', rrr);
});

var rrr=function (body) {

    console.log('Body: ',JSON.parse(body) );
  }
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
// write data to request body
req.write('{"string": "Hello, World"}');
req.end();


*/

router.use(function(req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Client IP:', ip);
    next(); 
});

router.post('/auth', function(req, res) {
	console.log("*** *** *** ");
	var dlogin=new vDigitlogin.DigitsLogin(req, res,"TEST TEST TEST");
		dlogin.https=https;
		dlogin.model=vUsuario;
		dlogin.login(req.body['X-Verify-Credentials-Authorization']);
		

	/*  
	var authorization=	req.body.replace("\"X-Auth-Service-Provider\" =","\"X-Auth-Service-Provider\" :")
		authorization=	authorization.replace("\"X-Verify-Credentials-Authorization\" =","\"X-Verify-Credentials-Authorization\" :")
		
		authorization=authorization.replace(/\\"/g, "")
		authorization=authorization.replace(";", ",")
		authorization=authorization.replace(";", "")
		data=JSON.parse(authorization)

	console.log("*** *** *** ",data['X-Verify-Credentials-Authorization']);
	*/
	

		//var unauth="OAuth oauth_signature=jAsjY%2Fa1yIt1yYj%2Fb2gmi7paswQ%3D,oauth_nonce=2762E16D-BA89-4EB2-8A26-DFC2DB5355E2,oauth_timestamp=1477141999,oauth_consumer_key=zIRJzhMzKX32NsznWECvBzVRa,oauth_token=088752106371084289-sM9uS3EZlZPxZJZVKshYcvyoZFIAX4w,oauth_version=1.0,oauth_signature_method=HMAC-SHA1";
		//dlogin.login(unauth);
		// ERROR {     "X-Auth-Service-Provider" = "https://api.digits.com/1.1/sdk/account.json";     "X-Verify-Credentials-Authorization" = "OAuth oauth_signature=\"jAsjY%2Fa1yIt1yYj%2Fb2gmi7paswQ%3D\",oauth_nonce=\"2762E16D-BA89-4EB2-8A26-DFC2DB5355E2\",oauth_timestamp=\"1477141999\",oauth_consumer_key=\"zIRJzhMzKX32NsznWECvBzVRa\",oauth_token=\"888752106371084289-sM9uS3EZlZPxZJZVKshYcvyoZFIAX4w\",oauth_version=\"1.0\",oauth_signature_method=\"HMAC-SHA1\""; }

  		// return res.json({});
  		 
});

router.get('/getCentros', function(req, res) {
  BackPoc.find(function (err, collections) {
                  if (err) return next(err);
                    res.json(collections);
                });
});



module.exports = router;