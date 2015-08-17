requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'lodash': '/bower_components/lodash/lodash.min',
    'firebase': '../bower_components/firebase/firebase',
    'hbs': '../bower_components/require-handlebars-plugin/hbs',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
    'rating': '../bower_components/bootstrap-rating/bootstrap-rating.min',
  },
  shim: {
    'bootstrap': ['jquery'],
    'rating': ['jquery'],
    'firebase': {
      exports: 'Firebase'
    }
  }
});

requirejs(["jquery", "lodash", "firebase", "hbs", "bootstrap", "deleteButton", "rating", "getAndPost"],
  function ($, _, _firebase, Handlebars, bootstrap, deleteButton, bootstrapRating, getAndPost) {
    var myFirebaseRef = new Firebase("https://refactored-movie.firebaseio.com/");
    var storedMovieData = [];
    var movieObject;
    myFirebaseRef.child("movies").on("value", function(snapshot) {
      var movies = snapshot.val();
      for (var key in movies) {
        storedMovieData.push(movies[key]);
      }
      movieObject = {
        movies: storedMovieData
      };
      displayMovies(movies);
    });     //CLOSE//: FIREBASE SNAPSHOT

    function displayMovies(data) {
      require(['hbs!../templates/movie-item-watched', 'hbs!../templates/movie-item-wishlist'], function(template, template2) {
        var $outputWatched = $(template(data)).filter(".movieItem");
        var $outputWishlist = $(template(data)).filter(".movieItem");
        
        $("#movie-list").html($outputWatched);
        $("#movie-list-wishlist").html($outputWishlist);
        if ((document.location.pathname === "/index.html") || (document.location.pathname === "/")) {
          displayRating(data);
        }
      });
    }    //CLOSE//: displayMovies()

    function displayRating(data) {
      var ratingArray = [];
      for (var obj in data) {
        if (data[obj].viewed) {
          ratingArray.push(data[obj].rating);
        }
      }
      var $starInput = $(".media-bottom > input");
      for (var i in ratingArray) {
        $starInput[i].value = ratingArray[i];
      }
      $('input[type="hidden"]').rating();
      $('input[type="hidden"]').on('change', function() {
        var dataKey = $(this).parent().parent().attr('data-key');
        var fb = new Firebase("https://refactored-movie.firebaseio.com/movies/" + dataKey);
        var watchedRating = parseInt($(this).rating().val());
        fb.update({"rating": watchedRating});      
      });   //CLOSE//: EVENT-LISTENER
    }   //CLOSE//: displayRating()

    var searchFirebase = function(input) {
      var watchedArray = [];
      var wishlistArray = [];
      var searchResults;
      var myFirebaseRef = new Firebase("https://refactored-movie.firebaseio.com/");
      myFirebaseRef.child("movies").on("value", function(snapshot) {
        var movies = snapshot.val();
        for (var obj in movies) {
          if (movies[obj].viewed) {
            watchedArray[watchedArray.length] = movies[obj];
          } else if (!movies[obj].viewed) {
            wishlistArray[wishlistArray.length] = movies[obj];
          }
        }
        var searchResultsWatched = filterByInput(watchedArray);
        var searchResultsWishlist = filterByInput(wishlistArray);
        searchResults = {
          "watched": searchResultsWatched,
          "wishlist": searchResultsWishlist
        };
      });

      function displaySearchFirebase(data) {
      require(['hbs!../templates/movie-item-watched', 'hbs!../templates/movie-item-wishlist'], function(template, template2) {
        var watched = data.watched;
        var wishlist = data.wishlist;
        // var $outputWatched = $(template(data)).filter(".movieItem");
        // var $outputWishlist = $(template(data)).filter(".movieItem");
        
        // $("#movie-list").html($outputWatched);
        // $("#movie-list-wishlist").html($outputWishlist);
        if ((document.location.pathname === "/index.html") || (document.location.pathname === "/")) {
          displayRating(data);
        }
      });
    }    //CLOSE//: displaySearchFirebase()
      
      function filterByInput(array) {
        var out = [];
        for (var obj in array) {
          if (array[obj].Title.toLowerCase().includes(input) ) {
            out.push(array[obj]);
          }
        }
        console.log(out);
        return out;
      }
      return searchResults;
    };

    function displaySearch(data) {
      require(['hbs!../templates/modal'], function(template){
        $("#movie-list").append(template(data));
      });
    }

    var searchResults;
    function findMovieSearch(title) {
      var mUrl = "http://www.omdbapi.com/?s=" + title + "&type=movie";
      $.ajax({
        url: mUrl
      }).done(function(data) {
        searchResults = data.Search;
        var searchResults2 = _.pluck(searchResults, 'imdbID');
        _(searchResults2).forEach(function(n) {
          var mUrl2 = "http://www.omdbapi.com/?i=" + n;
          $.ajax({
            url: mUrl2
          }).done(function(data) {
            data.poster = "http://img.omdbapi.com/?i=" + data.imdbID + "&apikey=8513e0a1";
            displaySearch(data);
          }); 
        }).value();
      });
    }   //CLOSE//: findMovieSearch()

    $( document ).ready(function() {
      $('.search').click(function() {
        var titleInput = $('#input').val();
        var firebaseResults = searchFirebase(titleInput);
        console.log(firebaseResults);
        // displaySearchFirebase(firebaseResults);
        findMovieSearch(titleInput);
      });   //CLOSE//: EVENT LISTENER
      
      $(document).on('click', '#addToWishList', function(){
        var movieName = $(this).parent().parent().attr("id");
        getAndPost.queryMovies(movieName, function(movies) {
          var movieObj = movies;
          movieObj.rating = 0;
          movieObj.viewed = false;
          movieObj.poster = "http://img.omdbapi.com/?i=" + movieObj.imdbID + "&apikey=8513e0a1";
          $.ajax({
            url: "https://refactored-movie.firebaseio.com/movies.json",
            method: "POST",
            data: JSON.stringify(movieObj)
          }).done(function(movieObj) {
          });
        });
      });   //CLOSE//: EVENT LISTENER

      $(document).on('click', '#addToWatched', function(){
        var datakey = $(this).parent().parent().attr('data-key');
        myFirebaseRef.child("movies").child(datakey).update({"viewed": true});
        document.location.replace('index.html');
      });   //CLOSE//: EVENT LISTENER

      $(document).on('click', '#deleteFromWishlist', function(){
        var datakey = $(this).parent().parent().attr('data-key');
        myFirebaseRef.child("movies").child(datakey).set({});
      });   //CLOSE//: EVENT LISTENER

    });   //CLOSE//: (DOCUMENT).READY WRAPPER FOR EVENT LISTENER    
});   //CLOSE//: OUTER REQUIREJS