var Book = require('../models/book.model');
var Movie = require('../models/movie.model');
var Track = require('../models/track.model');
var Artist = require('../models/artist.model');
var Place = require('../models/place.model');
var Show = require('../models/show.model');
var User = require('../models/user.model');
var Recommendation = require('../models/recommendation.model');
var Promise = require('bluebird');
var _ = require('lodash');


var populates = 'places.liked places.disliked shows.liked shows.disliked '+
  'movies.liked movies.disliked tracks.liked tracks.disliked books.liked '+
  'books.disliked';
/**
* This function returns the similarity index
* between items of liked and disliked items
*/
function modifiedJaccard(L1, L2, D1, D2){
	denom = _.size(_.unionBy(L1, L2, D1, D2, 'slug'));
	numerator = _.size(_.intersectionBy(L1, L2, 'slug')) +
				_.size(_.intersectionBy(D1, D2, 'slug')) -
				_.size(_.intersectionBy(L1, D2, 'slug')) -
				_.size(_.intersection(L2, D1, 'slug'));
	index = parseFloat(numerator) / parseFloat(denom); //decimal pls!!!
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

  return new Promise(function(resolve, reject){
    usersQual = [];
    if(item instanceof Place){
  		User.find().populate('places.liked places.disliked').exec(function(err, users){
  			for(var i=0; i<users.length; i++){
  				list = liked ? users[i].places.liked : users[i].places.disliked;
  				for(var j=0; j<list.length; j++){
  					if(String(list[j]._id) == String(item._id)){
  						usersQual.push(users[i]);
  						break;
  					}
  				}
  			}
        resolve(usersQual);
  		});
  	}else if(item instanceof Movie){
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
        resolve(usersQual);
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
        resolve(usersQual);
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
        resolve(usersQual);
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
        resolve(usersQual);
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
        resolve(usersQual);
  		});
  	}

  });
/**
	usersQual = [];

  return usersQual;*/
}

/**
* This function calculates the probability
* of an user u liking the item i
*/
function probabilityOfLike(user, item){
  return new Promise((resolve, reject)=>{
    var p1 = usersQualified(item, true);
    p1.then((usersLikedItem)=>{
      var p2 = usersQualified(item, false);
      p2.then((usersDislikedItem)=>{
        var sumLiked = 0, sumDisliked = 0;
        //find sumLiked
      	for(var i=0;i<usersLikedItem.length; i++){
      		if(item instanceof Movie)
      			sumLiked += similarityIndexes(user, usersLikedItem[i],
      				{criteria: 'Movie'});
      		else if(item instanceof Book)
      			sumLiked += similarityIndexes(user, usersLikedItem[i],
      				{criteria: 'Book'});
      		else if(item instanceof Place){
            //console.log(similarityIndexes(user, usersLikedItem[i], {criteria: 'Place'}));
      			sumLiked += similarityIndexes(user, usersLikedItem[i],
      				{criteria: 'Place'});
          }
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
      	prob = parseFloat(sumLiked + sumDisliked) /
      		parseFloat(_.size(usersLikedItem) + _.size(usersDislikedItem));
        resolve(prob);
      });
    });
  });
}

/*
*This function returns a list of the items the user hasn't give a
*calification yet.
*Returns a JSON with a list for tracks, places, books, movies, and shows.
*/
function itemsUserHasntQualified(user){
  return new Promise((resolve, reject)=>{
    movies_unqualified = [];
    books_unqualified = [];
    places_unqualified = [];
    shows_unqualified = [];
    tracks_unqualified = [];
     User.find().populate(populates).exec((err, users)=>{
      for(var i=0; i<users.length; i++){
        if(String(users[i]._id) == String(user._id)) continue;
        var unqM = _.differenceBy(_.unionBy(users[i].movies.liked,
          users[i].movies.disliked, 'slug'),
          _.unionBy(user.movies.liked, user.movies.disliked, 'slug'), 'slug');
        movies_unqualified = _.unionBy(movies_unqualified, unqM, 'slug');

        var unqB = _.differenceBy(_.unionBy(users[i].books.liked,
          users[i].books.disliked, 'slug'),
          _.unionBy(user.books.liked, user.books.disliked, 'slug'), 'slug');
        books_unqualified = _.unionBy(books_unqualified, unqB, 'slug');

        var unqP = _.differenceBy(_.unionBy(users[i].places.liked,
          users[i].places.disliked, 'slug'),
          _.unionBy(user.places.liked, user.places.disliked, 'slug'), 'slug');
        places_unqualified = _.unionBy(places_unqualified, unqP, 'slug');


        var unqS = _.differenceBy(_.unionBy(users[i].shows.liked,
          users[i].places.disliked, 'slug'),
          _.unionBy(user.shows.liked, user.shows.disliked, 'slug'), 'slug');
        shows_unqualified = _.unionBy(shows_unqualified, unqS, 'slug');

        var unqT = _.differenceBy(_.unionBy(users[i].tracks.liked,
          users[i].tracks.disliked, 'slug'),
          _.unionBy(user.tracks.liked, user.shows.disliked, 'slug'), 'slug');
        tracks_unqualified = _.unionBy(tracks_unqualified, unqT, 'slug');
      }
      var returnable = {
        unqualified: {
          movies: movies_unqualified,
          shows: shows_unqualified,
          books: books_unqualified,
          places: places_unqualified,
          tracks: tracks_unqualified
        }
      }
      resolve(returnable);
    });

  });

}



/**
*This function generates all recomendations for every item-type
*for an specific user.
*All transactions are saved on Recommendations document(mongoDB)
*so this function doesn't return anything.
*/
function generateRecommendationsFor(user){
  return new Promise((resolve, reject)=>{
    var p = itemsUserHasntQualified(user);
    p.then((items)=>{
      musicRecomm = [];
      var promises = [];
      for(var i=0; i<items.unqualified.tracks.length; i++){
        var pm = probabilityOfLike(user, items.unqualified.tracks[i]);
        promises.push(pm);
      }
      Promise.all(promises).then(function(res){
        for(var i=0; i<items.unqualified.tracks.length; i++){
          var obj = {
            track: items.unqualified.tracks[i],
            pr: res[i]
          };
          musicRecomm.push(obj);
        }
        //books
        booksRecomm = [];
        promises = [];
        for(var i=0; i<items.unqualified.books.length; i++){
          var pm = probabilityOfLike(user, items.unqualified.books[i]);
          promises.push(pm);
        }
        Promise.all(promises).then((res)=>{
          for(var i=0; i<items.unqualified.books.length; i++){
            var obj = {
              book: items.unqualified.books[i],
              pr: res[i]
            };
            booksRecomm.push(obj);
          }
          //places
          placesRecomm = [];
          promises = [];
          for(var i=0; i<items.unqualified.places.length; i++){
            var pm = probabilityOfLike(user, items.unqualified.places[i]);
            promises.push(pm);
          }
          Promise.all(promises).then((res)=>{
            for(var i=0; i<items.unqualified.places.length; i++){
              var obj = {
                place: items.unqualified.places[i],
                pr: res[i]
              };
              placesRecomm.push(obj);
            }
            //shows
            showsRecomm = [];
            promises = [];
            for(var i=0; i<items.unqualified.shows.length; i++){
              var pm = probabilityOfLike(user, items.unqualified.shows[i]);
              promises.push(pm);
            }
            Promise.all(promises).then((res)=>{
              for(var i=0; i<items.unqualified.shows.length; i++){
                var obj = {
                  show: items.unqualified.shows[i],
                  pr: res[i]
                };
                showsRecomm.push(obj);
              }
              //movies
              moviesRecomm = [];
              promises = [];
              for(var i=0; i<items.unqualified.movies.length; i++){
                var pm = probabilityOfLike(user, items.unqualified.shows[i]);
                promises.push(pm);
              }
              Promise.all(promises).then((res)=>{
                for(var i=0; i<items.unqualified.movies.length; i++){
                  var obj = {
                    movie: items.unqualified.items[i],
                    pr: res[i]
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
                resolve(rec);
              });
            });
          });
        });
      });

    });
  });

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
      if(recomms.music[j].pr < recomms.music[j+1].pr){
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
      if(recomms.books[j].pr < recomms.books[j+1].pr){
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
      if(recomms.places[j].pr < recomms.places[j+1].pr){
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
      if(recomms.movies[j].pr < recomms.movies[j+1].pr){
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
      if(recomms.shows[j].pr < recomms.shows[j+1].pr){
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
      for(var i=0; i<users.length; i++){
        var p = generateRecommendationsFor(users[i]);
        p.then((recomms)=>{
          var sortedRec = sortByProb(recomms);
          var r = new Recommendation({
            user: users[i],
            music_recom: sortedRec.music,
            movies_recom: sortedRec.movies,
            places_recom: sortedRec.places,
            shows_recom: sortedRec.shows,
            books_recom: sortedRec.books
          });
          r.save((err, r)=>{
            if(err) console.log(err);
            console.log("Recommendation stored successfully");
          });
        });
      }
    });
}

exports.deleteAllRecommendations = ()=>{
  Recommendation.remove({}, (err)=>{
    console.log("ERROR");
    console.log(err);
  });
}
