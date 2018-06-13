var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Restaurant = require('../models/Restaurant.js');

/* GET ALL RestaurantS */
router.get('/', function(req, res, next) {
    console.log("request got recieved!")
  Restaurant.find(function (err, restaurants) {
    if (err) return next(err);
    res.send(restaurants);
  });
});

/* GET SINGLE Restaurant BY ID */
router.get('/:id', function(req, res, next) {
  Restaurant.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

// /* GET  Restaurant BY hash */
// router.get('hash/:hash', function(req, res, next) {
//     Restaurant.findOne({ 'hash': req.params.hash}, function (err, post) {
//       if (err) return next(err);
//       res.send(post);
//     });
//   });

/* SAVE Restaurant */
router.post('/', function(req, res, next) {
  Restaurant.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* UPDATE Restaurant */
router.put('/:id', function(req, res, next) {
  Restaurant.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE Restaurant */
router.delete('/:id', function(req, res, next) {
  Restaurant.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;