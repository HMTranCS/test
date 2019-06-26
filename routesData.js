let path = require("path");
let express = require("express");
var passport = require("passport");

var User = require("./models/user");
var Camera = require("./models/camera");
var Info = require("./models/Info");

let router = express.Router();

router.use(function(req, res, next) {
  res.locals.currentUserjy = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

const myDatabase = require('./myDatabase');

let db = new myDatabase();
/////Information////////////////////////////////////////////////
router.post("/checkInfo",function(req,res){
	Info.find({},function(error,info){
		if(error){
			if(parseInt(db.getInfoList().length)+1 > req.body.length){
				let item = []
				for(let i=parseInt(db.getInfoList().length)+1;i>req.body.length;i--){
					item.push(db.infoList[parseInt(i-req.body.length-1)])
				}
				res.json(item);
			}
		}else if(info==null){
			res.json(null)
		}
		if(info){
			if(parseInt(info.length+1) > req.body.infoLength){
				let item = []
				for(let i=req.body.infoLength;i<parseInt(info.length+1);i++){
					item.push(info[i-1])
				}
				res.json(item);
			}
		}
		
	});
})
router.post('/pairStudentCamera', function(req, res){
	let obj = {userID:req.user.username,cameraID:req.body.cameraID}
	return(db.pairInfo(obj, res))
});
router.put('/breakStudentCamera', function(req, res){
	let obj = {userID:req.user.userID,cameraID:req.body.cameraID}
	return(db.breakInfo(obj, res))
});
router.put('/reserve', function(req, res){
	let obj = {userID:req.user.userID,cameraID:req.body.cameraID,date:req.body.resDate}
	return(db.addToReserveList(obj, res))
});
router.post("/updateCamTable",function(req,res){
	Camera.find({},function(error,info){
		if(error){
			if(parseInt(db.getCameraList().length+1) > req.body.camLength){
				let item = []
				for(let i=req.body.camLength;i<parseInt(db.getCameraList().length+1);i++){
					item.push(db.cameraList[i-1])
				}
				res.json(item);
			}
		}else if(info==null){
			res.json(null)
		}
		if(info){
			if(parseInt(info.length+1) > req.body.camLength){
				let item = []
				for(let i=req.body.camLength;i<parseInt(info.length+1);i++){
					item.push(info[i-1])
				}
				res.json(item);
			}
		}
	})
});
router.get("/checkdate",function(req,res){
	db.setDate({weekday:parseInt((new Date()).getDay()),
		month:parseInt((new Date()).getMonth()),
		date:parseInt((new Date()).getDate()),
		year:parseInt((new Date()).getFullYear())})
});
/////Users//////////////////////////////////////////////////////////////////////////////////
router.get('/readUser', function(req, res){
	return(db.readUsers(res));
	db.printAll();
});
router.post('/createUser', function(req, res){
	if(req.user.username == ''){
		res.json(null)
		return;
	}
	let obj = {ident: req.body.ident, username:req.body.username,
	 fullName:req.body.fullName, grade:req.body.grade, period: req.body.period}
	return(db.createUser(obj, res))
	db.printAll();
});
router.put('/updateUser', function(req, res){
	if(req.user.username == ''){
		res.json(null)
		return;
	}
	let obj = {ident: req.user.ident, username:req.user.username,
	 fullName:req.body.fullName, grade:req.body.grade, period: req.body.period}
	return(db.updateUser(obj, res))
});

router.delete('/deleteUser', function(req, res){
	return(db.deleteUserWithID(req.user.ident, res))
});
/////Cameras//////////////////////////////////////////////////////////////////////////////////
router.post('/createCamera', function(req, res){
	if(req.body.object == ''){
		res.json(null)
		return;
	}
	let obj = {name:req.body.name,ident:req.body.ident,description:req.body.description,
		checkedOut:req.body.checkedOut,reserved:req.body.reserved};
	return(db.createCamera(obj, res));
	db.printAll();
});
router.get('/readCamera', function(req, res){
	return(db.readCameraWithID(req.query.ident, res));
});
router.put('/updateCamera', function(req, res){
	if(req.body.name == ''){
		res.json(null)
		return;
	}
	let obj = {name:req.body.name,ident: req.body.ident,description:req.body.description,
		checkedOut:req.body.checkedOut,reserved:req.body.reserved}
	return(db.updateCamera(obj, res))
});
router.delete('/deleteCamera', function(req, res){
	return(db.deleteCameraWithID(req.body.ident, res))
});
////////////////////////////////////////////////////////////////////////
router.post('/fileupload', function(req, res){

});
module.exports = router;