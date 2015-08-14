requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'lodash': '/bower_components/lodash/lodash.min',
    'firebase': '../bower_components/firebase/firebase',
    'hbs': '../bower_components/require-handlebars-plugin/hbs',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
    'rating': '../bower_components/bootstrap-rating/bootstrap-rating.min'
  },
  shim: {
    'bootstrap': ['jquery'],
    'firebase': {
      exports: 'Firebase'
    }
  }
});

requirejs(["jquery", "lodash", "firebase", "hbs", "bootstrap", "addMovies", "deleteButton", "rating", "getAndPost"],
  function ($, _, _firebase, Handlebars, bootstrap, addMovies, deleteButton, bootstrapRating, getAndPost) {

    var myFirebaseRef = new Firebase("https://refactored-movie.firebaseio.com/");
    myFirebaseRef.on("value", function(snapshot) {
      displayMovies(snapshot.val());
    });

    function displayMovies(movies) {
      require(['hbs!../templates/movie-item-watched'], function(template) {
        $("#movie-list").html(template(movies));
        var watchedRating = $('input[type="hidden"]').rating();
        console.log(watchedRating);
        $('input[type="hidden"]').on('change', function() {
          $.ajax({
           url: "https://refactored-movie.firebaseio.com/",
           method: "POST",
           data: JSON.stringify()
         }).done(function() {
           console.log();
         });
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
    }
    $('.find').click(function() {
      var titleInput = $('#input').val();
      console.log(titleInput);
      findMovieSearch(titleInput); 
    });
    function modalMovies(movies) {
      require(['hbs!../templates/modal'], function(template) {
        $(".modal-body").html(template(movies));
      });
    }

// THIS WORKS
    function findMovieSearch(title) {
      var mUrl = "http://www.omdbapi.com/?s=" + title + "&type=movie";
      var searchResults;
      $.ajax({
        url: mUrl
      }).done(function(data) {
        searchResults = data.Search;
        console.log(searchResults);
      });
      return searchResults;
    }
    
// THIS WORKS
    $('.find').click(function() {
      var titleInput = $('#input').val();
      console.log(titleInput);
      modalMovies(findMovieSearch(titleInput)); //This may need to be fixed
    });

// THIS DOESN'T WORK
    function modalMovies(movies) {
      require(['hbs!../templates/modal'], function(template) {
        $(".modal-body").html("");
        $("#modalbod").append(template(movies));
        $('#modal-content').modal({
        show: true
      });
      });
    }

    $(document).on('click', '#addButton', function(){
      var movieName = $(this).siblings('div').text();
      console.log(movieName);
      getAndPost.queryMovies(movieName, function(movies) {
        var movieObj = movies;
        movieObj.rating = 0;
        movieObj.viewed = false;
        movieObj.poster = "http://img.omdbapi.com/?i=" + movieObj.imdbID + "&apikey=8513e0a1";
        console.log(movieObj);
        console.log("data", movies);
        $.ajax({
          url: "https://refactored-movie.firebaseio.com/movies.json",
          method: "POST",
          data: JSON.stringify(movieObj)
        }).done(function(movieObj) {
          console.log(movieObj);
        });
      });
    });
  // $(document).on("click", '.delete', function() {
  //   var deleteTitle = $(this).siblings('h2').text();
  //   var movieHash = _.findKey(movies.movies, {'Title': deleteTitle});
  //   console.log('movies.movies', movies.movies);
  //   console.log('movieHash', movieHash);
  //   deleteButton.delete(movieHash);
  // });  
    

// Get OMDB API movie info
    
  
  
  // $(document).on("click", '.delete', function() {
  //   var deleteTitle = $(this).siblings('h2').text();
  //   var movieHash = _.findKey(movies.movies, {'Title': deleteTitle});
  //   console.log('movies.movies', movies.movies);
    
  //   console.log('movieHash', movieHash);


  //   deleteButton.delete(movieHash);
  // });  
    
  // $(".addMovies").click(function(){
    
  //  // Created var for movie
  //      var newMovie = {
  //        "Title": $("#movieTitle").val(),
  //        "Year": $("#year").val(),
  //        "Actors": $("#actors").val(),
  //        "Rating": $("input.ratingRange").val(),
 //          "Poster": $("#poster").html(),
 //          "Viewed": $("input[type=radio]:checked").val(),
  //        };
  //    console.log("Added Rating: ", newMovie);
    
      // send to FireBase
          
      // $.ajax({
   //      url: "https://refactored-movie.firebaseio.com/movies.json",
      // method: "POST",
      // data: JSON.stringify(newMovie)
   //    }).done(function(addedMovie) {
      //  console.log(addedMovie);
      //  });
      //  });
  
    // Search button
    
    // $(".subTitle").on("click", function(){
    //  var title = $("#movieTitle").val();
    //  console.log("title", title);
    //  getMovie(title);
  //   });

    
    // Populating modal search
    
});

