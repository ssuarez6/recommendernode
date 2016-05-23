'use strict';

var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

mongoose.connect(); 

//schemas and models definitions

//recommendations table

var recomSchema = new Schema({user_id: 'int', music_recom: [Number], 
	movies_recom: [Number], places_recom: [Number], shows_recom: [Number],
	books_recom: [Number]}); //table 4 recommendations

var Recommendations = new mongoose.model('Recommendations', recomSchema);

//sonder schemas && models

var BookSchema = new Schema({
  slug: {type: String, unique: true},
  title: String
});

var Book = new mongoose.model('Book', BookSchema);

var MovieSchema = new Schema({
  slug: {type: String, unique: true}
});

var Movie = new mongoose.model('Movie', MovieSchema);

var TrackSchema = new Schema({
  slug: {artist: String, track: String},
  artist: {type: Schema.ObjectId, ref: "Artist"}
});

var Track = new mongoose.model('Track', TrackSchema);

var PlaceSchema = new Schema({
  slug: {type: String, unique: true},
  name: String
});

var Place = new mongoose.model('Place', PlaceSchema);

var ShowSchema = new Schema({
  slug: {type: String, unique: true}
});

var Show = new mongoose.model('Show', ShowSchema);

var UserSchema = new Schema({
  name: String,
  username: {type: String, lowercase:true },
  email: { type: String, lowercase: true },
  role: {
    type: String,
    default: 'user'
  },
  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {},
  movies: {
    liked: [{type:Schema.ObjectId, ref: "Movie"}],
    disliked: [{type:Schema.ObjectId, ref: "Movie"}],
    later: [{type:Schema.ObjectId, ref: "Movie"}]
  },
  shows: {
    liked: [{type:Schema.ObjectId, ref: "Show"}],
    disliked: [{type:Schema.ObjectId, ref: "Show"}],
    later: [{type:Schema.ObjectId, ref: "Show"}]
  },
  tracks: {
    liked: [{type:Schema.ObjectId, ref: "Track"}],
    disliked: [{type:Schema.ObjectId, ref: "Track"}],
    later: [{type:Schema.ObjectId, ref: "Track"}]
  },
  books: {
    liked: [{type:Schema.ObjectId, ref: "Book"}],
    disliked: [{type:Schema.ObjectId, ref: "Book"}],
    later: [{type:Schema.ObjectId, ref: "Book"}]
  },
  places: {
    liked: [{type:Schema.ObjectId, ref: "Place"}],
    disliked: [{type:Schema.ObjectId, ref: "Place"}],
    later: [{type:Schema.ObjectId, ref: "Place"}]
  }
});

var User = new mongoose.model('User', UserSchema);

var ArtistSchema = new Schema({
  slug: String,
  mbid: String
});

var Artist = new mongoose.model('Artist', ArtistSchema);

/**
* This function returns the similarity index 
* between items of liked and disliked items
*/
function modifiedJaccard(L1, L2, D1, D2){
	denom = _.union(L1, L2, D1, D2);
	numerator = _.size(_.intersection(L1, L2)) +
				_.size(_.intersection(D1, D2)) - 
				_.size(_.intersection(L1, D2)) -
				_.size(_.intersection(L2, D1));
	index = numerator / denom; //decimal pls!!!
}

/*
* This function uses Jaccard modified index for finding 
* similarity between two users
*/
function similarityIndexes(var userFrom, var userTo, var criteria){
	if(criteria.criteria == 'Movie'){
	//music
		LM1 = userFrom.movies.liked;
		LM2 = userTo.movies.liked;
		DM1 = userFrom.movies.disliked;
		DM2 = userTo.movies.disliked;

		moviedIndex = modifiedJaccard(LM1, LM2, DM1, DM2);
		return moviedIndex;
	}else if (criteria.criteria == 'Show'){

	//shows
		LS1 = userFrom.shows.liked;
		LS2 = userTo.shows.liked;
		DS1 = userFrom.shows.disliked;
		DS2 = userTo.shows.disliked;

		showsIndex = modifiedJaccard(LS1, LS2, DS1, DS2);
		return showsIndex;
	}else if(criteria.criteria == 'Track'){
	//tracks
		LT1 = userFrom.tracks.liked;
		LT2 = userTo.tracks.disliked;
		DT1 = userFrom.tracks.disliked;
		DT2 = userTo.tracks.disliked;

		tracksIndex = modifiedJaccard(LT1, LT2, DT1, DT2);
		return tracksIndex;
	}else if(criteria.criteria == 'Place'){
		//places
		LP1 = userFrom.places.liked;
		LP2 = userTo.places.liked;
		DP1 = userFrom.places.disliked;
		DP2 = userTo.places.disliked;

		placeIndex = modifiedJaccard(LP1, LP2, DP1, DP2);
		return placeIndex;
	}else if(criteria.criteria == 'Book'){
	//books
		LB1 = userFrom.books.liked;
		LB2 = userTo.books.liked;
		DB1 = userFrom.books.disliked;
		DB2 = userTo.books.disliked;

		bookIndex = modifiedJaccard(LB1, LB2, DB1, DB2);
		return bookIndex;
	}
}

/*
* This function returns the ids 
* of the users who have liked or
* disliked an item
* @param liked says if you're looking for users
* who have liked the item or disliked it (boolean).
* @param item the item
*/
function usersQualified(var item, var liked){
	usersQual = [];
	if(item instanceof Movie){
		User.find().exec(function(err, users){
			for(var user: users){
				if(liked){
					list = user.movies.liked;
				}else{
					list = user.movies.disliked;
				}
				for(var it: list){
					if(it == item){
						usersQual.push(user);
						break;
					}
				}
			}
		});
	}else if(item instanceof Place){
		User.find().exec(function(err, users){
			for(var user: users){
				list = liked ? user.places.liked : user.places.disliked;
				for(var it: list){
					if(it == item){
						usersQual.push(user);
						break;
					} 
				}
			}
		});
	}else if(item instanceof Track){
		User.find().exec(function(err, users){
			for(var user: users){
				list = liked ? user.tracks.liked : user.tracks.disliked;
				for(var it: list){
					if(it == item){
						usersQual.push(user);
						break;
					}
				}
			}
		});
	}else if(item instanceof Show){
		User.find().exec(function(err, users){
			for(var user: users){
				list = liked ? user.shows.liked : user.shows.disliked;
				for(var it: list){
					usersQual.push(user);
					break;
				}
			}
		});
	}else if(item instanceof Book){
		User.find().exec(function(err, users){
			for(var user: users){
				list = liked ? user.books.liked : user.books.disliked;
				for(var it: list){
					usersQual.push(user);
					break;
				}
			}
		});
	}
	return usersQual;
}

/**
* This function calculates the probability
* of an user u liking the item i
*/
function probabilityOfLike(var user, var item){
	var usersLikedItem = usersQualified(item, true);
	var usersDislikedItem = usersQualified(item, false);
	var sumLiked = 0, sumDisliked = 0;

	//find sumLiked
	for(var userliked: usersLikedItem){
		if(item instanceof Movie) 
			sumLiked += similarityIndexes(user, userliked, {criteria: 'Movie'});
		else if(item instanceof Book)
			sumLiked += similarityIndexes(user, userliked, {criteria: 'Book'});
		else if(item instanceof Place)
			sumLiked += similarityIndexes(user, userliked, {criteria: 'Place'});
		else if(item instanceof Show)
			sumLiked += similarityIndexes(user, userliked, {criteria: 'Show'});
		else if(item instanceof Track)
			sumLiked += similarityIndexes(user, userliked, {criteria: 'Track'});
	}
	//find sumDisliked
	for(var userdisliked: usersDislikedItem){
		if(item instanceof Movie) 
			sumDisliked += similarityIndexes(user, userdisliked, {criteria: 'Movie'});
		else if(item instanceof Book)
			sumDisliked += similarityIndexes(user, userdisliked, {criteria: 'Book'});
		else if(item instanceof Place)
			sumDisliked += similarityIndexes(user, userdisliked, {criteria: 'Place'});
		else if(item instanceof Show)
			sumDisliked += similarityIndexes(user, userdisliked, {criteria: 'Show'});
		else if(item instanceof Track)
			sumDisliked += similarityIndexes(user, userdisliked, {criteria: 'Track'});
	}
	//thid needs to be decimal
	prob = (sumLiked + sumDisliked) / (_.size(usersLikedItem) + _.size(usersDislikedItem));
	return prob;
}

/*
This function returns a list of the most probably items
a user can like
*/
function itemsPerProbability(){

}