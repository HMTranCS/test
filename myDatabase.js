var express = require("express");
var Promise = require('promise');

var mongoose = require("mongoose");
var User = require("./models/user");
var Camera = require("./models/camera");
var Info = require("./models/Info")

let myDatabase = function(){
  this.infoList = []
  this.userList = []
  this.cameraList = []
  this.checkoutTime = 1
  this.year = 0
  this.month = 0
  this.date = 0
  this.weekday = 0
}
myDatabase.prototype.printAll = function () {
  console.log("=========== printAll()  ============")
  console.log("User List")
  for (let i=0;i<this.userList.length;i++) {
    console.log(this.userList[i]);
  }
  console.log("====================================")
  console.log("Camera List")
  console.log("There are " + this.cameraList.length + " cameras");
  for (let i=0;i<this.cameraList.length;i++) {
    console.log(this.cameraList[i]);
  }
  console.log("====================================")
}
/////Information/////////////////////////////////////////////////////////////////////////////
myDatabase.prototype.getInfoList = function(){
  return(this.infoList)
}
myDatabase.prototype.pairInfo = function(obj, res){
  let validStu = false
  let validCam = false
  let username = ""
  let cameraName = ""
  let dateCheckedOut = this.year+"-"+this.month+"-"+this.date
  let dateDue = this.year+"-"+this.month+"-"+parseInt(this.date+this.checkoutTime)
  let returned = false
  let overdue = false
  let active = true

  Camera.find({ident: obj.cameraID},function(error,camera){
    if(camera != null){
      validCam = true
      cameraName = camera[0].name 
    }
  })
  var initializePromise = initialize()
  initializePromise.then(
    function(result) {
      let tempStu
      User.find({},function(error,users){
        for(let i=0;i<users.length;i++){
          if(users[i].ident==obj.userID)
            tempStu=users[i]
        }
      })
      Camera.find({},function(error,camera){
        for(let i=0;i<camera[obj.cameraID-1].reserved.length;i++){
          if(camera[obj.cameraID-1].reserved[i]!=null){
            if(parseInt(camera[obj.cameraID-1].reserved[i].resDate.substring(0,4))==this.year&&
              parseInt(camera[obj.cameraID-1].reserved[i].resDate.substring(5,7))-1==this.month&&
              parseInt(camera[obj.cameraID-1].reserved[i].resDate.substring(8,10))==this.date){
              if(camera[obj.cameraID-1].reserved[i].user==tempStu){
                camera[obj.cameraID-1].reserved.splice(i,1)
                break
              }else
                return("0")
            }
          }
          break
        }
      })   
      Info.find({},function(error,info){
        for(let i=0;i<info.length;i++){
          if(info[i].active){
            if(info[i].cameraID == obj.cameraID){
              return res.json("1")
            }else if(info[i].userID == obj.userID){
              return res.json("2")
            }
          }
        }
      })
      Camera.findOneAndUpdate({ident:obj.cameraID},{checkedOut:true},function(error,camera){
        if (error) {
          return res.json(null);
        }else if (camera == null) {
          return res.json(null);
        }
      })
      let tempObj = {userIdent:obj.userID,userName:username,
        cameraIdent:obj.cameraID,camName:cameraName,dateCheckedOut:dateCheckedOut,
        dateDue:dateDue,returned:returned,overDue:overdue}
      Info.create(tempObj,function(error,info) {
        if (error) {
          console.log(error)
          return res.json(null);
        }
      })
      return("3")
    },
    function(err) {
        
    }

  );
  function initialize(){
    return new Promise(function(resolve,reject) {
      User.find({username:obj.userID},function(error,users){
        if(error){
          reject(error)
        }else{
          validStu = true
          username = users[0].fullName
          if(!validStu || !validCam){
            return("-1")
          }
          resolve(users)
        }
      })
    });
  }
      
}
myDatabase.prototype.breakInfo = function(obj, res){
  let validStu = false
  let validCam = false
  User.find({username:obj.userID},function(error,users){
    if(users != null){
      validStu = true
    }
  })
  Camera.find({ident: obj.cameraID-1},function(error,camera){
    if(camera != null){
      validCam = true
      if(!validStu || !validCam){
        return("-1")
      }
    }
  })
  Camera.findOneAndUpdate({ident:obj.cameraID},{checkedOut:false},function(error,camera) {
    if (error) {
      return res.json(null);
    }else if (camera == null) {
      return res.json(null);
    }
  })
  Info.findOneAndUpdate({ident:obj.ident},{returned:true,active:false},function(error,info) {
    if (error) {
      return res.json(null);
    }else if (info == null) {
      return res.json(null);
    }else
      return("2")
  });
  return("1")
}
myDatabase.prototype.addToReserveList = function(obj, res){
  let validStu = false
  let validDate = true
  User.find({ident:obj.userID},function(error,users){
    validStu = true
  })
  Camera.find({ident:obj.cameraID-1},function(error,camera){
    if(camera[0].reserved.length==0){
      User.find({ident:obj.userID},function(error,users){
        Camera.findOneAndUpdate({ident:obj.cameraID-1},
          {$push:{reserved:{resDate:obj.date,user:users[0]}}},
          function(error,camera){
            return("2")
        })  
      })
    }
  })  
  Camera.find({},function(error,camera){
    for(let j=0;j<camera[0].reserved.length;j++){
      if(camera[0].reserved[j].resDate == obj.date){
        validDate = false
        break
      }
    }
  })
  if(!validStu){
    return("0")
  }
  else if(!validDate){
    return("1")
  }
  User.find({ident:obj.userID},function(error,users){
    Camera.findOneAndUpdate({ident:obj.cameraID-1},
      {$push:{reserved:{resDate:obj.date,user:users[0]}}},
      function(error,camera){
        return("2")
    })  
  }) 
}
myDatabase.prototype.setDate = function(data){
  if (data.weekday == 0)
  this.weekday = "Sunday"
  else if (data.weekday == 1)
    this.weekday = "Monday"
  else if (data.weekday == 2)
    this.weekday = "Tuesday"
  else if (data.weekday == 3)
    this.weekday = "Wednesday"
  else if (data.weekday == 4)
    this.weekday = "Thursday"
  else if (data.weekday == 5){
    this.checkoutTime = 3
    this.weekday = "Friday"
  }
  else if (data.weekday == 6)
    this.weekday = "Saturday"
  this.month = data.month
  this.date = data.date
  this.year = data.year
  this.checkoutTime = 1
}
myDatabase.prototype.getDate = function(data){
  return({weekday:this.weekday,month:this.month,date:this.date,year:this.year})
}
myDatabase.prototype.getCheckoutTime= function(){
  return(checkoutTime)
}
myDatabase.prototype.changeCheckoutTime= function(newTime){
  this.checkoutTime = newTime
}
/////Users/////////////////////////////////////////////////////////////////////////////
myDatabase.prototype.getUserList = function(){
  return(this.userList)
}
myDatabase.prototype.getUserArraySize = function () {
  return this.userList.length;
};
myDatabase.prototype.readUsers = function(res) {
  User.find({},function(error,users) {
      if (error) {
        return (this.userList);
      }
      else if (users == null) {
        return (this.userList);
      }
      else if (users.length > 0){
        return res.json(users);
      }
   });
  return (null);
}
myDatabase.prototype.createUser = function(obj,res) {  
  for (let i=0;i<this.userList.length;i++) {
    if (this.userList[i] && obj.ident == this.userList[i].ident) {
      return (null);
    }
  }
  this.userList.push(obj);
  User.create({ident:obj.ident,username:obj.username,fullName:obj.fullName,
    grade:obj.grade, period: obj.period},function(error,info) {
      console.log(error)
      if (error) {
        return res.json(null);
      }

      let obj2 = {username:obj.username,fullName:obj.fullName, grade:obj.grade, period: obj.period};
      return res.json(obj2);
  });
}
myDatabase.prototype.updateUser = function(obj,res) {
  for (let i=0;i<this.userList.length;i++) {
    if (this.userList[i] && obj.ident == this.userList[i].ident) {
      this.userList[i].object = obj.object;
      this.userList[i].grade = obj.grade;
      this.userList[i].period = obj.period;
    }
  }
  User.findOneAndUpdate({ident:obj.ident},{name:obj.name,grade:obj.grade,period:obj.period},function(error,info) {
    if (error) {
        return res.json(null);
    }
    else if (info == null) {
        return res.json(null);
    }
    return res.json(obj);
  });
}
myDatabase.prototype.deleteUserWithID = function(ident,res) {
  for (let i=0;i<this.userList.length;i++) {
    if (this.userList[i] && ident == this.userList[i].ident) {
      let tempObj = this.userList[i];
      this.userList[i] = undefined;
    }
  }
  User.remove({ident:_ident},function(error,removed) {
      if (error) {
          return res.json(null);
      }
      return res.json(removed.result);
  });
}
/////Cameras/////////////////////////////////////////////////////////////////////////////
myDatabase.prototype.getCameraList = function(){
  return(this.cameraList)
}
myDatabase.prototype.getCameraArraySize = function () {
  return this.cameraList.length;
};
myDatabase.prototype.readCameraWithID = function(_ident,res) {
  Camera.find({ident:_ident},function(error,camera) {
    if (error) {
      for (let i=0;i<this.cameraList.length;i++) {
        if (this.cameraList[i] && obj.ident == this.cameraList[i].ident) {
          return (this.cameraList[i]);
        }
      }
      return res.json(null);
    }
    else if (camera == null) {
      for (let i=0;i<this.cameraList.length;i++) {
        if (this.cameraList[i] && obj.ident == this.cameraList[i].ident) {
          return (this.cameraList[i]);
        }
      }
      return res.json(null);
    }
    if (camera.length == 1){
      return res.json({ name: camera[0].name, description: camera[0].description});
    }else{
        return res.json(null);
    }
  });
}
myDatabase.prototype.createCamera = function(obj,res) {
  for (let i=0;i<this.getCameraArraySize;i++) {
    if (this.cameraList[i] && obj.ident == this.cameraList[i].ident) {
      return (null);
    }
  }
  this.cameraList.push(obj);
  Camera.create(obj,function(error,info) {
    if (error) {
      return res.json(null);
    }
    let obj2 = {ident:obj.ident,name:obj.name, period: obj.period
    };
      return res.json(obj2);
  });
}
myDatabase.prototype.updateCamera = function(obj,res) {
  for (let i=0;i<this.userList.length;i++) {
    if (this.userList[i] && obj.ident == this.userList[i].ident) {
      this.userList[i].object = obj.object;
      this.userList[i].grade = obj.grade;
      this.userList[i].period = obj.period;
    }
  }
  Camera.findOneAndUpdate({ident:obj.ident},{ident:obj.ident,name:obj.name,description:obj.description},function(error,info) {
    if (error) {
        return res.json(null);
    }
    else if (info == null) {
        return res.json(null);
    }
    return res.json(obj);
  });
}
myDatabase.prototype.deleteCameraWithID = function(ident,res) {
  for (let i=0;i<this.cameraList.length;i++) {
    if (this.cameraList[i] && ident == this.cameraList[i].ident) {
      let tempObj = this.cameraList[i];
      this.cameraList[i] = undefined;
    }
  }
  Camera.remove({ident:_ident},function(error,removed) {
    if (error) {
        return res.json(null);
    }
    return res.json(removed.result);
  });
}
module.exports = myDatabase;
