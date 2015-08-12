
define(["firebase"],function(_firebase) {

 return {
   delete: function(argument) {
     var ref = new Firebase("https://movie-history-cpr.firebaseio.com/movies" + argument);
     ref.remove();
   }
 };

}); 

 $(document).on("click", '.delete', function() {
   var deleteTitle = $(this).siblings('h2').text();
   var titleKey = '';
   titleKey = _.findKey(allSongObject, function(song) {
     return song.title.replace(/ /g,"") === deleteTitle.replace(/ /g, "");
   });
   console.log(titleKey);
   delete.delete(titleKey);
 });  