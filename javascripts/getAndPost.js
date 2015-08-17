define(["jquery"],function($, title) {
  return {
    queryMovies: function(title, callback) {
      var mUrl = "http://www.omdbapi.com/?t=" + title;
      $.ajax({
        url: mUrl,
        method: "GET"
      }).done(function(data) {
        callback.call(this, data);
      });
    }
  };
});