define(function() {
  
  return {

    addMovie: function(newMovie)  {
      $.ajax({
        url:"https://refactored-movie.firebaseio.com/",
        method: "POST",
        data: newSong
      }).done(function(addedMovie){
      console.log("added movie", addedMovie);
      });
    }
  };
});
