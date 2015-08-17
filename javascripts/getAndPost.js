define(["jquery", "main"],function($, title) {
  return {
    queryMovies: function(title, callback) {
      var mUrl = "http://www.omdbapi.com/?t=" + title;
      $.ajax({
        url: mUrl,
        method: "POST"
      }).done(function(data) {
        callback.call(this, data);
      });
    }
  };
});