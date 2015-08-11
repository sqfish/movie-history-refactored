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
		
		myFirebaseRef.on("value", function(snapshot) {
  var movies = snapshot.val();
		});
		
		
	// Get OMDB API movie info
//		
//			$.ajax({
//        url: "http://www.omdbapi.com/?",
//			method: "GET",
//			data: JSON
//      }).done(function(getMovie) {
//				console.log(getMovie);
//			});
//	}	);

var $Form = $('form'), $Container = $('#container');
$Container.hide();
$Form.on('submit', function(p_oEvent){
    var sUrl, sMovie, oData;
    p_oEvent.preventDefault();
sMovie = $Form.find('input').val();
    sUrl = 'http://www.omdbapi.com/?t=' + sMovie + '&type=movie&tomatoes=true'
    $.ajax(sUrl, {
        complete: function(p_oXHR, p_sStatus){
            oData = $.parseJSON(p_oXHR.responseText);
            console.log(oData);
            $Container.find('.title').text(oData.Title);
            $Container.find('.plot').text(oData.Plot);
            $Container.find('.poster').html('<img src="' + oData.Poster + '"/>');
            $Container.find('.year').text(oData.Year);
            $Container.show();
        }
    });    
});
