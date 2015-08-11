//Copying Steves example to add new songs.
requirejs(
  ["jquery","hbs","bootstrap"],
  function($,Handlebars,bootstrap) {
  

  $(".movieTitle").click(function(e) {
      e.preventDefault();
      var newMovie = {
        "title": $("#movieTitle").val(),

      };
    console.log("movieTitle", JSON.stringify(newMovie));


  $.ajax({
   url: "https://movie-history-cpr.firebaseio.com/",
   method: "POST",
   data: JSON.stringify(newMovie)
  }).done(function(data) {
   console.log(data);
  });
  });
  });