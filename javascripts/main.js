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
		var poster;
		var myFirebaseRef = new Firebase("https://refactored-movie.firebaseio.com/");
    var title = $('#input').val();
    console.log(title);
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
        $("#movie-list").html(template(movies));
        $("[name='viewed']").bootstrapSwitch();
        $(".bootstrap-switch-handle-on").text("Yes!");
        $(".bootstrap-switch-handle-off").text("No");
        console.log("loadMovies function called");
      });

    }
      function getMovie(title) {
        var mUrl = "http://www.omdbapi.com/?t=" + title;
        console.log(mUrl);
        $.ajax({
          url: mUrl,
        success: function(data) {
        console.log("Movie", data);
        var movieTitle = data.Title;
        var yearRel = $("#year").val(data.Year);
        var actors = $("#actors").val(data.Actors);
        }
      });
    }




    //hitting find breaks page!
    $('.find').click(function (title) {
      getMovie(title);
      modalMovies(movies);
      $('#modal-content').modal({
        show: true
      });
    });

    function modalMovies(movies) {
      require(['hbs!../templates/modal'], function(template) {
        $(".modal-body").html(template(movies));
        console.log("modalMovies function called");
      });
    }

// Get OMDB API movie info
    
  
  
  $(document).on("click", '.delete', function() {
    var deleteTitle = $(this).siblings('h2').text();
    var movieHash = _.findKey(movies.movies, {'Title': deleteTitle});
    console.log('movies.movies', movies.movies);
    
    console.log('movieHash', movieHash);


    deleteButton.delete(movieHash);
  });  
		
	$(".addMovies").click(function(){
		
		// Created var for movie
				var newMovie = {
					"Title": $("#movieTitle").val(),
					"Year": $("#year").val(),
					"Actors": $("#actors").val(),
					"Rating": $("input.ratingRange").val(),
          "Poster": $("#poster").html(),
          "Viewed": $("input[type=radio]:checked").val(),
					};
			console.log("Added Rating: ", newMovie);
		
			// send to FireBase
					
			$.ajax({
        url: "https://refactored-movie.firebaseio.com/movies.json",
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
			getMovie(title);
    });

    
    // Populating modal search
    
});
















