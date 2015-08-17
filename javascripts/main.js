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
      /////////// FILTERING MOVIES INTO WATCHED AND WISHLIST. SAVED FOR LATER /////////// 
      // var watchedMovieData = _.filter(storedMovieData, { 'viewed': true });
      // var wishlistMovieData = _.filter(storedMovieData, { 'viewed': false });
      // displayMovies(watchedMovieData, wishlistMovieData);
      movieObject = {
        movies: storedMovieData
      };
      console.log("movies: ", movies);
      displayMovies(movies);
    });     //CLOSE//: FIREBASE SNAPSHOT

      function displayMovies(data) {
        require(['hbs!../templates/movie-item-watched', 'hbs!../templates/movie-item-wishlist'], function(template, template2) {
          $("#movie-list").html(template(data));
          $("#movie-list-wishlist").html(template2(data));
          console.log("data: ", data);
          if (document.location.pathname === "/index.html") {
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
        console.log(searchResults);
        var searchResults2 = _.pluck(searchResults, 'Title');
        console.log(searchResults2);
        _(searchResults2).forEach(function(n) {
          var mUrl2 = "http://www.omdbapi.com/?t=" + n;
          $.ajax({
            url: mUrl2
          }).done(function(data) {
            console.log(data);
            console.log(n);
            data.poster = "http://img.omdbapi.com/?i=" + data.imdbID + "&apikey=8513e0a1";
            displaySearch(data);
          }); 
        }).value();
      });
    }   //CLOSE//: findMovieSearch()

    $( document ).ready(function() {
      $('.search').click(function() {
        var titleInput = $('#input').val();
        findMovieSearch(titleInput); 
      });   //CLOSE//: EVENT LISTENER
      
      $(document).on('click', '#addToWishList', function(){
        var movieName = $(this).parent().parent().attr("id");
        console.log(movieName);
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
            console.log(movieObj);
          });
        });
      });   //CLOSE//: EVENT LISTENER

      $(document).on('click', '#addToWatched', function(){
        var datakey = $(this).parent().parent().attr('data-key');
        console.log(datakey);
        myFirebaseRef.child("movies").child(datakey).update({"viewed": true});
        document.location.replace('index.html');
      });   //CLOSE//: EVENT LISTENER

      $(document).on('click', '#deleteFromWishlist', function(){
        var datakey = $(this).parent().parent().attr('data-key');
        myFirebaseRef.child("movies").child(datakey).set({});
      });   //CLOSE//: EVENT LISTENER

    });   //CLOSE//: (DOCUMENT).READY WRAPPER FOR EVENT LISTENERS

  // $(document).on("click", '.delete', function() {
  //   var deleteTitle = $(this).siblings('h2').text();
  //   var movieHash = _.findKey(movies.movies, {'Title': deleteTitle});
  //   console.log('movies.movies', movies.movies);
  //   console.log('movieHash', movieHash);
  //   deleteButton.delete(movieHash);
  // });  
});   //CLOSE//: OUTER REQUIREJS

