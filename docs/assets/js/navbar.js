$(document).scroll(function(e){
  var scrollTop = $(document).scrollTop();
   console.log(scrollTop);
  if(scrollTop > 150){
    $('.navbar').addClass("floating");
  } else {
     $('.navbar').removeClass("floating");
  }
});
