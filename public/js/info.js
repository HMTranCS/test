function readUserClicked(data){
  console.log("in here")
  if(data != null){
    for(let i=0;i<data.length;i++){
      if(data[i].username!="admin"){
         $("#studentInfo").append("<tr><td>"+data[i].fullName+"</td><td>"+
        data[i].username+"</td><td>"+
        data[i].grade+"</td><td>"+
        data[i].period+"</td></tr>")
      }
     
    }
  }
}
/*
function deleteUserClicked(){
  $.ajax({
      url: "/deleteUser",
      type: "DELETE",
      data: {ident:$('#userIdent').val()},
      success: function(data){
        if(data){
          alert("Good Delete")
        }
        else {
          alert("Bad Delete")
        }
      },
      dataType: "json"
    });
  return false;
}
*/
function createCameraClicked(){
  $.ajax({
    url: "/createCamera",
    type: "POST",
    data: {name:$('#camName').val(),ident:$('#camIdent').val(),
      description:$('#descript').val(),checkedOut:false,reserved:[]},
    success: function(data){
      if (data) {
        alert("Successful creation!")
      } else {
        alert("Invalid creation!")
      }
    },
    dataType: "json"
  });
  return false;
}
function readCameraClicked(){
  $.ajax({
      url: "/readCamera",
      type: "GET",
      data: {ident:$('#camIdent').val()},
      success: function(data){
        if (data) {
          alert("Successful request!");
          $('#camName').val(data.name);
          $('#descript').val(data.description)
        }else{
          alert("Invalid request!");
        }
      },
      dataType: "json"
    });
  return false;
}
function updateCameraClicked(){
  $.ajax({
      url: "/updateCamera",
      type: "PUT",
      data: {ident:$('#camIdent').val(),name:$('#camName').val(),
        description:$('#descript').val(),checkedOut:false,reserved:[]},
      success: function(data){
        if(data){
          alert("Good Update")
        }
        else {
          alert("Bad Update")
        }
      },
      dataType: "json"
    });
  return false;
}
function deleteCameraClicked(){
  $.ajax({
    url: "/deleteCamera",
    type: "DELETE",
    data: {ident:$('#camIdent').val()},
    success: function(data){
      if(data){
        alert("Good Delete")
      }
      else {
        alert("Bad Delete")
      }
    },
    dataType: "json"
  });
  return false;
}
function setInfo(data){
  if(data != null){
    for(let i=0;i<data.length;i++){
      tempStr1 = "No"
      tempStr2 = "No"
      if(data[i].returned){
        tempStr1 = "Yes"
      }
      if(data[i].overdue){
        tempStr2 = "Yes"
      }
      $("#info").append("<tr><td>"+data[i].userName+"</td><td>"+
        data[i].userIdent+"</td><td>"+
        data[i].camName+"</td><td>"+
        data[i].cameraIdent+"</td><td>"+
        data[i].dateCheckedOut.substring(0,10)+"</td><td>"+
        data[i].dateDue.substring(0,10)+"</td><td>"+
        tempStr1+"</td><td>"+
        tempStr2+"</td></tr>")
    }
  }
}
$(document).ready(function(){
  $.get("/readUser",readUserClicked)
  $("#createCameraButton").click(createCameraClicked);
  $("#readCameraButton").click(readCameraClicked);
  $("#updateCameraButton").click(updateCameraClicked);
  $("#deleteCameraButton").click(deleteCameraClicked);
  $.post("/checkInfo",{infoLength:$('#info tr').length},setInfo)
});