
define(["firebase"],function(_firebase) {

 return {
   delete: function(argument) {
     var ref = new Firebase("https://refactored-movie.firebaseio.com/movies/" + argument);
     ref.remove();
     console.log("ref", argument);
   }
 };

}); 

