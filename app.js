'use strict';

var express = require('express');
var _ = require('lodash');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/sonderdb-dev');
var app = express();

var recommender = require('./recommender');

app.get('/', function(req, res){
	res.send(123123123);
});

app.listen(3000);
