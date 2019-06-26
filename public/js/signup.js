function userClicked(){
  if ($("#username").val() == "" || $("#psw").val() == "")
  {
    alert("bad signup");
    return false;
  }
  $.post("/signup",{username:$("#username").val(), password:$("#psw").val(),
    fullName:$('#fullName').val(),grade:$('#grade').val(),period:$('#period').val(),period:$("#period").val()},
    function(data){
      alert("good signup");
      window.location = data.redirect;
    });
	return false;
}

$(document).ready(function(){
  $("#username").keydown( function( event ) {
      if ( event.which === 13 ) {
        userClicked();
        event.preventDefault();
        return false;
      }
  });
  $("#psw").keydown( function( event ) {
      if ( event.which === 13 ) {
        userClicked();
        event.preventDefault();
        return false;
      }
  });
  $("#period").keydown( function( event ) {
      if ( event.which === 13 ) {
        userClicked();
        event.preventDefault();
        return false;
      }
  });
  $("#grade").keydown( function( event ) {
      if ( event.which === 13 ) {
        userClicked();
        event.preventDefault();
        return false;
      }
  });
  $("#fullName").keydown( function( event ) {
      if ( event.which === 13 ) {
        userClicked();
        event.preventDefault();
        return false;
      }
  });
});
