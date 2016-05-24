'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BookSchema = new Schema({
  slug: {type: String, unique: true},
  title: String
});

BookSchema.methods = {
  getId : function () {
    return this.slug;
  }
};

module.exports = mongoose.model('Book', BookSchema);
