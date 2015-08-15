define(["jquery", "main"],function($, title) {
  console.log("title in getandpost: ", title);
  return {
    queryMovies: function(title, callback) {
      console.log("title in queryMovies: ", title);
      var mUrl = "http://www.omdbapi.com/?t=" + title;
      console.log(mUrl);
      $.ajax({
        url: mUrl,
        method: "POST"
      }).done(function(data) {
        console.log("call completed");
        console.log(data);
        callback.call(this, data);
      });
    }
  };
});