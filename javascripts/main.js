requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
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

requirejs(
["jquery", "firebase", "hbs", "bootstrap"],
	function ($, _firebase, Handlebars, bootstrap) {
		
		var myFirebaseRef = new Firebase("https://movie-history-cpr.firebaseio.com/");
		
		
		
// Get OMDB API movie info
		
	function getMovie(title) {
    		$.ajax({
    url: "http://www.omdbapi.com/?",
    data: {
        s: title,
    },
    success: function(data) {
        console.log(data);
					}
    });
	};
		
		$(".subTitle").on("click", function(){
			var title = $("#movieName").val();
			console.log("title", title);
			console.log(getMovie(title));
    });
			});