define(["jquery", "main"],function($, title) {
  return {
    queryMovies: function(title, callback) {
      console.log(title);
      var mUrl = "http://www.omdbapi.com/?t=" + title;
      console.log(mUrl);
      $.ajax({
        url: mUrl
      }).done(function(data) {
        callback.call(this, data);
      });
    }
  };
});