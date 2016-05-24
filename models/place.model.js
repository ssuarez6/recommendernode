'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaceSchema = new Schema({
  slug: {type: String, unique: true},
  name: String
});

PlaceSchema.methods = {
  getId : function () {
    return this.slug;
  }
};

module.exports = mongoose.model('Place', PlaceSchema);
