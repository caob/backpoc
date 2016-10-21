var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var BackPoc     = require('../models/BackPoc');

// middleware to use for all requests
// http://localhost:3000/backpoc

router.use(function(req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('Client IP:', ip);
    next(); 
});
 
router.get('/', function(req, res, next) {
  BackPoc.find(function (err, collections) {
                  if (err) return next(err);
                    res.json(collections);
                });
  
});
 
module.exports = router;