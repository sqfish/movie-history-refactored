requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
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
["jquery", "firebase", "hbs", "bootstrap", "addMovies", "bootstrap-switch"],
	function ($, _firebase, Handlebars, bootstrap, addMovies, bootstrapSwitch) {
		
		var myFirebaseRef = new Firebase("https://movie-history-cpr.firebaseio.com/");
		
		myFirebaseRef.on("value", function(snapshot) {
      var movies = snapshot.val();
      loadMovies(movies);
    });

    function loadMovies(data) {
      require(['hbs!../templates/movie-list'], function(template) {
        $("#movie-list").append(template(data));
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
				console.log(data.Awards);

					}
    });
	}
		
		$(".subTitle").on("click", function(){
			var title = $("#movieTitle").val();
			console.log("title", title);
			console.log(getMovie(title));
    });
});