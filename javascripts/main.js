requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'lodash': '/bower_components/lodash/lodash.min',
		'firebase': '../bower_components/firebase/firebase',
    'hbs': '../bower_components/require-handlebars-plugin/hbs',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
    'bootstrap-switch': '../bower_components/bootstrap-switch/dist/js/bootstrap-switch.min'
  },
  shim: {
    'bootstrap': ['jquery'],
    'bootstrap-switch': ['bootstrap'],
		'firebase': {
			exports: 'Firebase'
		}
  }
});

requirejs(
["jquery", "lodash", "firebase", "hbs", "bootstrap", "addMovies", "bootstrap-switch", "deleteButton"],
	function ($, _, _firebase, Handlebars, bootstrap, addMovies, bootstrapSwitch, deleteButton) {
		
		var myFirebaseRef = new Firebase("https://movie-history-cpr.firebaseio.com/");
		var movies;
    var moviesArray = [];
		myFirebaseRef.on("value", function(snapshot) {
      movies = snapshot.val();
      loadMovies(movies);
			console.log(movies);
      $("[name='viewed']").bootstrapSwitch();
    });

    function loadMovies(movies) {
      require(['hbs!../templates/movie-list'], function(template) {
        $("#movie-list").append(template(movies));
        $("[name='viewed']").bootstrapSwitch();
        $(".bootstrap-switch-handle-on").text("Yes!");
        $(".bootstrap-switch-handle-off").text("No");
        console.log("loadMovies function called");
      });

    }
// Get OMDB API movie info
    
  function getMovie(title) {
    $.ajax({
      url: "http://www.omdbapi.com/?",
      data: {
        t: title,
      },
    success: function(data) {
      console.log("Movie", data);
      var yearRel = $("#year").val(data.Year);
      var actors = $("#actors").val(data.Actors);
      }
    });
  }
  
  $(document).on("click", '.delete', function() {
    var deleteTitle = $(this).siblings('h2').text();
    var movieObject = _.where(movies.movies, {Title: deleteTitle});
    var movieHash = _.invert(movies.movies)[movieObject];
    deleteButton.delete(movieHash);
  });  
		
	$(".addMovies").click(function(){
		
		// Created var for movie
				var newMovie = {
					"Title": $("#movieTitle").val(),
					"Year": $("#year").val(),
					"Actors": $("#actors").val(),
					"Rating": $("input.ratingRange").val(),
					};
			console.log("Added Rating: ", newMovie);
		
			// send to FireBase
					
			$.ajax({
        url: "https://movie-history-cpr.firebaseio.com/movies.json",
			method: "POST",
			data: JSON.stringify(newMovie)
      }).done(function(addedMovie) {
				console.log(addedMovie);
				});
				});
	
		// Search button
		
		$(".subTitle").on("click", function(){
			var title = $("#movieTitle").val();
			console.log("title", title);
			console.log(getMovie(title));
    });
});