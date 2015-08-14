requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'lodash': '/bower_components/lodash/lodash.min',
    'firebase': '../bower_components/firebase/firebase',
    'hbs': '../bower_components/require-handlebars-plugin/hbs',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min'
  },
  shim: {
    'bootstrap': ['jquery'],
    'firebase': {
      exports: 'Firebase'
    }
  }
});

requirejs(["jquery", "lodash", "firebase", "hbs", "bootstrap", "addMovies", "deleteButton"],
  function ($, _, _firebase, Handlebars, bootstrap, addMovies, deleteButton) {
    var myFirebaseRef = new Firebase("https://refactored-movie.firebaseio.com/");
    myFirebaseRef.on("value", function(snapshot) {
      displayMovies(snapshot.val());
    });

    function displayMovies(movies) {
      require(['hbs!../templates/movie-item-watched'], function(template) {
        $("#movie-list").html(template(movies));
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
        $('#modal-content').modal({
        show: true
      });
      });
    }
  // $(document).on("click", '.delete', function() {
  //   var deleteTitle = $(this).siblings('h2').text();
  //   var movieHash = _.findKey(movies.movies, {'Title': deleteTitle});
  //   console.log('movies.movies', movies.movies);
  //   console.log('movieHash', movieHash);
  //   deleteButton.delete(movieHash);
  // });  
    
    

});

