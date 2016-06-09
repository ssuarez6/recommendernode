'use strict';

var mongoose = require('mongoose');
var recommender = require('./recommender');

mongoose.connect('mongodb://localhost/sonderdb-dev');
recommender.deleteAllRecommendations();
recommender.recommend();
