
var size = $( window ).width();
var sizeAdapt = size-350;
$(document ).ready(function() {
  $(".mainContent").css("width", "300px");
});

$( window ).resize(function() {

var size = $( window ).width();
var sizeAdapt = size-350;
 $(".mainContent").css("width", sizeAdapt);
})
