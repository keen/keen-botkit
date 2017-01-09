$(document).scroll(function(e){
  var scrollTop = $(document).scrollTop();
  if(scrollTop > 120){
    $('.navbar').addClass("floating");
  } else {
     $('.navbar').removeClass("floating");
  }
});
