var Book = require('../models/book.model');
var Movie = require('../models/movie.model');
var Track = require('../models/track.model');
var Artist = require('../models/artist.model');
var Place = require('../models/place.model');
var Show = require('../models/show.model');
var User = require('../models/user.model');
var Recommendation = require('../models/recommendation.model');

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
function similarityIndexes(userFrom, userTo, criteria){
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
function usersQualified(item, liked){
	usersQual = [];
	if(item instanceof Movie){
		User.find().exec(function(err, users){
			for(var i=0; i<users.length; i++){
				if(liked){
					list = users[i].movies.liked;
				}else{
					list = users[i].movies.disliked;
				}
				for(var j=0;j<list.length; j++){
					if(list[j] == item){
						usersQual.push(users[i]);
						break;
					}
				}
			}
		});
	}else if(item instanceof Place){
		User.find().exec(function(err, users){
			for(var i=0; i<users.length; i++){
				list = liked ? user.places.liked : user.places.disliked;
				for(var j=0; j<list.length; j++){
					if(list[j] == item){
						usersQual.push(user);
						break;
					}
				}
			}
		});
	}else if(item instanceof Track){
		User.find().exec(function(err, users){
			for(var i=0; i<users.length; i++){
				list = liked ? user.tracks.liked : user.tracks.disliked;
				for(var j=0; j<list.length; j++){
					if(list[j] == item){
						usersQual.push(user);
						break;
					}
				}
			}
		});
	}else if(item instanceof Show){
		User.find().exec(function(err, users){
			for(var i=0; i<users.length; i++){
				list = liked ? user.shows.liked : user.shows.disliked;
				for(var j=0; j<list.length; j++){
					if(list[j] == item){
						usersQual.push(user);
						break;
					}
				}
			}
		});
	}else if(item instanceof Book){
		User.find().exec(function(err, users){
			for(var i=0; i<users.length; i++){
				list = liked ? user.books.liked : user.books.disliked;
				for(var j=0; j<list.length; j++){
					if(list[j] == item){
						usersQual.push(user);
						break;
					}
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
function probabilityOfLike(user, item){
	var usersLikedItem = usersQualified(item, true);
	var usersDislikedItem = usersQualified(item, false);
	var sumLiked = 0, sumDisliked = 0;

	//find sumLiked
	for(var i=0;i<usersLikedItem.length; i++){
		if(item instanceof Movie)
			sumLiked += similarityIndexes(user, usersLikedItem[i],
				{criteria: 'Movie'});
		else if(item instanceof Book)
			sumLiked += similarityIndexes(user, usersLikedItem[i],
				{criteria: 'Book'});
		else if(item instanceof Place)
			sumLiked += similarityIndexes(user, usersLikedItem[i],
				{criteria: 'Place'});
		else if(item instanceof Show)
			sumLiked += similarityIndexes(user, usersLikedItem[i],
				{criteria: 'Show'});
		else if(item instanceof Track)
			sumLiked += similarityIndexes(user, usersLikedItem[i],
				{criteria: 'Track'});
	}
	//find sumDisliked
	for(var j=0;j<usersDislikedItem.length;j++){
		if(item instanceof Movie)
			sumDisliked += similarityIndexes(user, usersDislikedItem[j],
				{criteria: 'Movie'});
		else if(item instanceof Book)
			sumDisliked += similarityIndexes(user, usersDislikedItem[j],
				{criteria: 'Book'});
		else if(item instanceof Place)
			sumDisliked += similarityIndexes(user,  usersDislikedItem[j],
				{criteria: 'Place'});
		else if(item instanceof Show)
			sumDisliked += similarityIndexes(user,  usersDislikedItem[j],
				{criteria: 'Show'});
		else if(item instanceof Track)
			sumDisliked += similarityIndexes(user,  usersDislikedItem[j],
				{criteria: 'Track'});
	}
	//thid needs to be decimal
	prob = (sumLiked + sumDisliked) /
		(_.size(usersLikedItem) + _.size(usersDislikedItem));
	return prob;
}

/*
*This function returns a list of the items the user hasn't give a
*calification yet.
*Returns a JSON with a list for tracks, places, books, movies, and shows.
*/
function itemsUserHasntQualified(user){

}

/**
*This function generates all recomendations for every item-ype
*for an specific user.
*All transactions are saved on Recommendations document(mongoDB)
*so this function doesn't return anything.
*/
function generateRecommendationsFor(user){

}

exports.recommend = function(req, res){
  //aqui se hacen las cosas para manejar el request
}
