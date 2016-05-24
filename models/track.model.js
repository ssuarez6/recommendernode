'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrackSchema = new Schema({
  slug: {artist: String, track: String},
  artist: {type: Schema.ObjectId, ref: "Artist"}
});

TrackSchema.methods = {
  getId : function () {
    return this.slug;
  }
};

module.exports = mongoose.model('Track', TrackSchema);
