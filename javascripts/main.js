requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'lodash': '/bower_components/lodash/lodash.min',
    'firebase': '../bower_components/firebase/firebase',
    'hbs': '../bower_components/require-handlebars-plugin/hbs',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
    'rating': '../bower_components/bootstrap-rating/bootstrap-rating.min',
    'tabulous': '../bower_components/tabulous/demo/src/tabulous.min'
  },
  shim: {
    'bootstrap': ['jquery'],
    'rating': ['jquery'],
    'tabulous': ['jquery'],
    'firebase': {
      exports: 'Firebase'
    }
  }
});

requirejs(["jquery", "lodash", "firebase", "hbs", "bootstrap", "deleteButton", "rating", "getAndPost", "tabulous"],
  function ($, _, _firebase, Handlebars, bootstrap, deleteButton, bootstrapRating, getAndPost, tabs) {


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
      displayMovies(movies);
    });     //CLOSE//: FIREBASE SNAPSHOT

    function displayMovies(data) {
      require(['hbs!../templates/movie-item-watched', 'hbs!../templates/movie-item-wishlist'], function(template, template2) {
        $("#movie-list").html(template(data));

        for (var obj in data) {
          var object = (data[obj]);
          $('input[type="hidden"]').attr("value", object.rating);
          console.log(object.rating);
        }

        $("#movie-list-wishlist").html(template2(data));

        $('input[type="hidden"]').rating();
        $('input[type="hidden"]').on('change', function() {
          var dataKey = $(this).parent().parent().attr('data-key');
          var fb = new Firebase("https://refactored-movie.firebaseio.com/movies/" + dataKey);
          var watchedRating = parseInt($(this).rating().val());
          fb.update({"rating": watchedRating});          
        });
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
        modalMovies(searchResults);
      });
    }   //CLOSE//: findMovieSearch()

    $('.find').click(function() {
      var titleInput = $('#input').val();
      findMovieSearch(titleInput); 
    });   //CLOSE//: EVENT LISTENER
    function modalMovies(movies) {
      require(['hbs!../templates/modal'], function(template) {
        $(".modal-body").html(template(movies));
        $('#modal-content').modal({show: true});
      });
    }   //CLOSE//: modalMovies()

    $(document).on('click', '#addButton', function(){
      var movieName = $(this).siblings('div').text();
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

  // $(document).on("click", '.delete', function() {
  //   var deleteTitle = $(this).siblings('h2').text();
  //   var movieHash = _.findKey(movies.movies, {'Title': deleteTitle});
  //   console.log('movies.movies', movies.movies);
  //   console.log('movieHash', movieHash);
  //   deleteButton.delete(movieHash);
  // });  
  $('#tabs').tabulous({
    effect: 'scale'
  }); 
    
});   //CLOSE//: OUTER REQUIREJS
