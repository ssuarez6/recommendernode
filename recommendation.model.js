'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//recommendations document

var recomSchema = new Schema({ //4 every user, list of per-item recommendation
	//id: 'int', //¿necessary?
	user: {type:Schema.ObjectId, ref: "User"},
 	music_recom: [{type: Schema.ObjectId, ref: "Track"}],
	movies_recom: [{type: Schema.ObjectId, ref: "Movie"}],
	places_recom: [{type: Schema.ObjectId, ref: "Place"}],
	shows_recom: [{type: Schema.ObjectId, ref: "Show"}],
	books_recom: [{type: Schema.ObjectId, ref: "Book"}]
});


module.exports = mongoose.model('Recommendation', recomSchema);
