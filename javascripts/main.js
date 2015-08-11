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

		
  // $("#addMusicButton").on("click", function(){
  //   var musicData = {};
  //   //grab values from form and store in object
  //     musicData = {
  //       "title": $("#addTitle").val(),
  //       "year": $("#addArtist").val(),
  //       "actors": $("#addAlbum").val(),
  //       "rating":
  //       "viewed":
  //     };

  //     musicData = JSON.stringify(musicData);
  //     console.log("stringified musicData", musicData);
  //     addMusic.addMusic(musicData);
  //     $("#addTitle").val("");
  //     $("#addArtist").val("");
  //     $("#addAlbum").val("");
 });
