var Book = require('../models/book.model');
var Movie = require('../models/movie.model');
var Track = require('../models/track.model');
var Artist = require('../models/artist.model');
var Place = require('../models/place.model');
var Show = require('../models/show.model');
var User = require('../models/user.model');
var Recommendation = require('../models/recommendation.model');
var _ = require('lodash');


var populates = 'places.liked places.disliked shows.liked shows.disliked '+
  'movies.liked movies.disliked tracks.liked tracks.disliked books.liked '+
  'books.disliked';
/**
* This function returns the similarity index
* between items of liked and disliked items
*/
function modifiedJaccard(L1, L2, D1, D2){
	denom = _.size(_.union(L1, L2, D1, D2));
	numerator = _.size(_.intersection(L1, L2)) +
				_.size(_.intersection(D1, D2)) -
				_.size(_.intersection(L1, D2)) -
				_.size(_.intersection(L2, D1));
	index = numerator / denom; //decimal pls!!!
  return index;
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

		moviesIndex = modifiedJaccard(LM1, LM2, DM1, DM2);
		return moviesIndex;
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
		console.log("Es un lugar este item!");
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
		User.find().populate('movies.liked movies.disliked')
    .exec(function(err, users){
			for(var i=0; i<users.length; i++){
				if(liked){
					list = users[i].movies.liked;
				}else{
					list = users[i].movies.disliked;
				}
				for(var j=0;j<list.length; j++){
					if(String(list[j]._id) == String(item._id)){
						usersQual.push(users[i]);
						break;
					}
				}
			}
		});
	}else if(item instanceof Place){
		User.find().populate('places.liked places.disliked')
    .exec(function(err, users){
			for(var i=0; i<users.length; i++){
				list = liked ? users[i].places.liked : users[i].places.disliked;
				for(var j=0; j<list.length; j++){
					if(String(list[j]._id) == String(item._id)){
						usersQual.push(users[i]);
						break;
					}
				}
			}
		});
	}else if(item instanceof Track){
		User.find().populate('tracks.liked tracks.disliked')
    .exec(function(err, users){
			for(var i=0; i<users.length; i++){
				list = liked ? users[i].tracks.liked : users[i].tracks.disliked;
				for(var j=0; j<list.length; j++){
					if(String(list[j]._id) == String(item._id)){
						usersQual.push(users[i]);
						break;
					}
				}
			}
		});
	}else if(item instanceof Show){
		User.find().populate('shows.liked shows.disliked')
    .exec(function(err, users){
			for(var i=0; i<users.length; i++){
				list = liked ? users[i].shows.liked : users[i].shows.disliked;
				for(var j=0; j<list.length; j++){
					if(String(list[j]._id) == String(item._id)){
						usersQual.push(users[i]);
						break;
					}
				}
			}
		});
	}else if(item instanceof Book){
		User.find().populate('books.liked books.disliked')
    .exec(function(err, users){
			for(var i=0; i<users.length; i++){
				list = liked ? users[i].books.liked : users[i].books.disliked;
				for(var j=0; j<list.length; j++){
					if(String(list[j]._id) == String(item._id)){
						usersQual.push(users[i]);
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
  console.log("soy el usuario: "+user.name);
  movies_unqualified = [];
  books_unqualified = [];
  places_unqualified = [];
  shows_unqualified = [];
  tracks_unqualified = [];
   User.find().populate(populates).exec((err, users)=>{
    for(var i=0; i<users.length; i++){
      if(String(users[i]._id) == String(user._id)) continue;
      var unqM = _.difference(_.union(users[i].movies.liked,
        users[i].movies.disliked),
        _.union(user.movies.liked, user.movies.disliked));
      movies_unqualified = _.union(movies_unqualified, unqM);

      var unqB = _.difference(_.union(users[i].books.liked,
        users[i].books.disliked),
        _.union(user.books.liked, user.books.disliked));
      books_unqualified = _.union(books_unqualified, unqB);

      var unqP = _.difference(_.union(users[i].places.liked,
        users[i].places.disliked),
        _.union(user.places.liked, user.places.disliked));  // HERE BE ERRORS!
      //console.log(users[i].places.liked[0] + "\n" + user.places.liked[0]);
      places_unqualified = _.union(places_unqualified, unqP);
      //console.log(places_unqualified);

      var unqS = _.difference(_.union(users[i].shows.liked,
        users[i].places.disliked),
        _.union(user.shows.liked, user.shows.disliked));
      shows_unqualified = _.union(shows_unqualified, unqS);

      var unqT = _.difference(_.union(users[i].tracks.liked,
        users[i].tracks.disliked),
        _.union(user.tracks.liked, user.shows.disliked));
      tracks_unqualified = _.union(tracks_unqualified, unqT);
    }
    //console.log(places_unqualified);
  });
  var returnable = {
    unqualified: {
      movies: movies_unqualified,
      shows: shows_unqualified,
      books: books_unqualified,
      places: places_unqualified,
      tracks: tracks_unqualified
    }
  }
  //console.log(returnable);
  return returnable; //FUCKING PROMISES!!!
}



/**
*This function generates all recomendations for every item-type
*for an specific user.
*All transactions are saved on Recommendations document(mongoDB)
*so this function doesn't return anything.
*/
function generateRecommendationsFor(user){
  items = itemsUserHasntQualified(user);
  //music
  musicRecomm = [];
  for(var i=0; i<items.unqualified.tracks.length; i++){ //se recomiendan maximo 15 items
    var prob = probabilityOfLike(user, items.unqualified.tracks[i]);
    var obj = {
      track: items.unqualified.tracks[i],
      pr: prob
    };
    musicRecomm.push(obj);
  }
  //books
  booksRecomm = [];
  for(var i=0; i<items.unqualified.books.length; i++){ //se recomiendan maximo 15 items
    var prob = probabilityOfLike(user, items.unqualified.books[i]);
    var obj = {
      book: items.unqualified.books[i],
      pr: prob
    };
    booksRecomm.push(obj);
  }
  //places
  placesRecomm = [];
  for(var i=0; i<items.unqualified.places.length; i++){ //se recomiendan maximo 15 items
    var prob = probabilityOfLike(user, items.unqualified.places[i]);
    var obj = {
      place: items.unqualified.places[i],
      pr: prob
    };
    placesRecomm.push(obj);
  }
  //shows
  showsRecomm = [];
  for(var i=0; i<items.unqualified.shows.length; i++){ //se recomiendan maximo 15 items
    var prob = probabilityOfLike(user, items.unqualified.shows[i]);
    var obj = {
      show: items.unqualified.shows[i],
      pr: prob
    };
    showsRecomm.push(obj);
  }
  //movies
  moviesRecomm = [];
  for(var i=0; i<items.unqualified.movies.length; i++){ //se recomiendan maximo 15 items
    var prob = probabilityOfLike(user, items.unqualified.movies[i]);
    var obj = {
      movie: items.unqualified.movies[i],
      pr: prob
    };
    moviesRecomm.push(obj);
  }
  var rec = {
    music: musicRecomm,
    books: booksRecomm,
    places: placesRecomm,
    shows: showsRecomm,
    movies: moviesRecomm
  };
  return rec;
}

/**
*This funcion sorts the list of unqualified items by probability
*returns a new JSON WITHOUT the probability
**/
function sortByProb(recomms){
  sortedMusic = [];
  sortedBooks = [];
  sortedPlaces = [];
  sortedMovies = [];
  sortedShows = [];
  //music
  for(var i=1; i<recomms.music.length; i++){
    for(var j=0; j<recomms.music.length-i; j++){
      if(recomms.music[j].prob < recomms.music[j+1].prob){
        var aux = recomms.music[j];
        recomms.music[j] = recomms.music[j+1];
        recomms.music[j+1] = aux;
      }
    }
  }
  for(var i=0; i<recomms.music.length; i++){
    sortedMusic.push(recomms.music[i].track);
  }
  //books
  for(var i=1; i<recomms.books.length; i++){
    for(var j=0; j<recomms.books.length-i; j++){
      if(recomms.books[j].prob < recomms.books[j+1].prob){
        var aux = recomms.books[j];
        recomms.books[j] = recomms.books[j+1];
        recomms.books[j+1] = aux;
      }
    }
  }
  for(var i=0; i<recomms.books.length; i++){
    sortedBooks.push(recomms.books[i].book);
  }
  //places
  for(var i=1; i<recomms.places.length; i++){
    for(var j=0; j<recomms.places.length-i; j++){
      if(recomms.places[j].prob < recomms.places[j+1].prob){
        var aux = recomms.places[j];
        recomms.places[j] = recomms.places[j+1];
        recomms.places[j+1] = aux;
      }
    }
  }
  for(var i=0; i<recomms.places.length; i++){
    sortedPlaces.push(recomms.places[i].place);
  }
  //movies
  for(var i=1; i<recomms.movies.length; i++){
    for(var j=0; j<recomms.movies.length-i; j++){
      if(recomms.movies[j].prob < recomms.movies[j+1].prob){
        var aux = recomms.movies[j];
        recomms.movies[j] = recomms.movies[j+1];
        recomms.movies[j+1] = aux;
      }
    }
  }
  for(var i=0; i<recomms.movies.length; i++){
    sortedMovies.push(recomms.movies[i].movie);
  }
  //shows
  for(var i=1; i<recomms.shows.length; i++){
    for(var j=0; j<recomms.shows.length-i; j++){
      if(recomms.shows[j].prob < recomms.shows[j+1].prob){
        var aux = recomms.shows[j];
        recomms.shows[j] = recomms.shows[j+1];
        recomms.shows[j+1] = aux;
      }
    }
  }
  for(var i=0; i<recomms.shows.length; i++){
    sortedShows.push(recomms.shows[i].show);
  }

  var rec = {
    music: sortedMusic,
    books: sortedBooks,
    movies: sortedMovies,
    shows: sortedShows,
    places: sortedPlaces
  }
  return rec;
}

exports.recommend = function(){
  var message = "";
  User
    .find({})
    .populate('places.liked places.disliked')
    .exec((err, users)=>{
      items = itemsUserHasntQualified(users[0]);

      /*for(var i=0; i<userslist.length; ++i){
        console.log("Usuario que dio like a '"+users[0].places.liked[0].name+"': "+userslist[i].name);
      }*/
    });
}
