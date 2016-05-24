'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema = new Schema({
  slug: String,
  mbid: String
});

ArtistSchema.methods = {
  getId : function () {
    return this.slug;
  }
};

module.exports = mongoose.model('Artist', ArtistSchema);
