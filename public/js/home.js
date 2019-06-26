let buttonNum
function checkoutClicked(){
  $.ajax({
    url: "/pairStudentCamera",
    type: "POST",
    data: {cameraID:$("#CcameraID").val()},
    success: function(data){
      if(data == "-1") {
        alert("Invalid ID")
      }else if(data =="0"){
        alert("Camera has been reserved today so it cannot be checked out")
      }
      else if(data == "1") {
        alert("Camera is currently unavailable")
      }
      else if(data == "2") {
        alert("Student cannot have two cameras checked out")
      }
      else if(data == "3") {
        alert("Camera has successfully been checked out")
      }
    },     
    dataType: "json"
  });   
  return false;
}
function returnClicked(){
  $.ajax({
    url: "/breakStudentCamera",
    type: "PUT",
    data: {cameraID:$("#RcameraID").val()},
    success: function(data){
      if(data == "0") {
        alert("Invalid ID")
      }
      else if(data == "1") {
        alert("Student does not have this camera checked out")
      }
      else if(data == "2") {
        alert("Camera has successfully been returned")
      }
    },     
      dataType: "json"
  });   
  return false;
}
function reserveClicked(ident){
  $.ajax({
    url: "/reserve",
    type: "PUT",
    data: {cameraID:ident,resDate:$("#resFormDate").val()},
    success: function(data){
      console.log("success reserve made it")
      if(data == "0") {
        alert("Invalid ID")
      }
      else if(data == "1") {
        alert("Camera is already reserved on that day")
      }
      else if(data == "2") {
        alert("Camera has successfully been reserved")
      }
    },     
      dataType: "json"
  });   
  return false;
}
function updateCamTable(data){
  if(data != null){
    for(let i=0;i<data.length;i++){
      var _checkedOut = null
      if(data[i].checkedOut==true){
        _checkedOut = "Yes"
      }else
        _checkedOut = "No"
      let _reservedList = ""
      for(let j=0;j<data[i].reserved.length;j++){
        _reservedList += ""+data[i].reserved[j].resDate+","
      }
      var newRow = "<tr>"
      +"<td><div>"+data[i].ident+"</div></td>"
      +"<td><div>"+data[i].name+"</div></td>"
      +"<td><div>"+data[i].description+"</div></td>"
      +"<td><div>"+_checkedOut+"</div></td>"
      +"<td><div>"+_reservedList.split(',').join("<br />")+"</div></td>"
      +"<td><div><button class='reserve' id='CR"+parseInt($("#invCam").length+1)+"'"+">Reserve</button></div></td>"
      +"</tr>"
      $(newRow).appendTo("#invCam tbody");
     }
  }
}
$(document).ready(function(){
$.get("/checkdate")
$.post("/updateCamTable",{camLength:parseInt($('#invCam tr').length)},updateCamTable)
  $("#chckBtn").click(function(){
    $("#chckModal").modal();
  });     
  $("#retBtn").click(function(){
    $("#retModal").modal();
  }); 
  $("body").on("click",".reserve",function(){
    $("#resModal").modal();
    buttonNum=parseInt($(this).prop("id").substring(2))
  }); 
  $("#chckForm").submit(function(event){
    if ($("#CstudentID").val() == ""||$("#CcameraID").val() == "") {
      alert("Please input a valid ID");
      return false;
    }
    checkoutClicked()
  }) 
  $("#retForm").submit(function(event){
    if ($("#RstudentID").val() == ""||$("#RcameraID").val() == "") {
      alert("Please input a valid ID");
      return false;
    }
    returnClicked()
  })
  $(".resForm").submit(function(event){
    if ($("#resFormStudent").val() == "") {
      alert("Please input a valid ID");
      return false;
    }
    reserveClicked(buttonNum)
  }) 
  $("#cameras").click(function(){
    $("#itemsC").slideToggle("slow")
  })
}); 