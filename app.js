'use strict';

var express = require('express');
var _ = require('lodash');
var mongoose = require('mongoose');
var router = express.Router();
var recommender = require('./recommender');

mongoose.connect('mongodb://localhost/sonderdb-dev');
var app = express();
recommender.recommend();
router.get('/', (req, res)=>{res.send("HOLA");});
app.use('/', router);
app.listen(3020);
