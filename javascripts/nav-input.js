define(["main", "jquery"],function(main, $) {
  
  $('.find').on('click', function(){
    var find = $('#input').val();
    console.log(find);
  });

  $('.search').on('click', function(){
    var search = $('#input').val();
    console.log(search);
  })
})