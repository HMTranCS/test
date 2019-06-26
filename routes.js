var express = require("express");
var router = express.Router();

var passport = require("passport");
var path = require("path");

var bcrypt = require("bcrypt-nodejs");
var SALT_FACTOR = 10;

var User = require("./models/user");

router.use(function(req, res, next) {
  res.locals.currentUserjy = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

var ident = 0;

function initIdent(){
  if (ident == 0){
    User.find({},function(err,user) {
      if (!err) {
        let objs = [];
        for (let i=0;i<user.length;i++) {
          if (ident < user[i].ident)
            ident = user[i].ident;
        }
      }
    });
  }
}
router.get("/successroot", function(req, res) {
	res.json({redirect:"/"});
});

router.get("/failroot", function(req, res) {
	res.json({redirect:"/login"});
});

router.get("/successsignup", function(req, res) {
    if (req.user.username == "admin"){
      res.json({redirect:"/adminsession"});
    }else{
      res.json({redirect:"/session"});
    }
});

router.get("/failsignup", function(req, res) {
	res.json({redirect:"/login"});
});

router.get("/successlogin", function(req, res) {
    if (req.user.username == "admin"){
      res.json({redirect:"/adminsession"});
    }else{
      res.json({redirect:"/session"});
    }
});
router.get("/faillogin", function(req, res) {
	res.json({redirect:"/login"});

});

router.get("/", function(req, res, next) {
	let thePath = path.resolve(__dirname,"public/views/login.html");
	res.sendFile(thePath);
});


router.get("/signup", function(req, res) {
  	initIdent();
	let thePath = path.resolve(__dirname,"public/views/signup.html");
	res.sendFile(thePath);
});

router.get("/login", function(req, res) {
	let thePath = path.resolve(__dirname,"public/views/login.html");
	res.sendFile(thePath);

});

router.get("/adminsession", function(req, res) {
  	if (req.isAuthenticated()) {
	   let thePath = path.resolve(__dirname,"public/views/admin.html");
	   res.sendFile(thePath);
	} else {
	let thePath = path.resolve(__dirname,"public/views/login.html");
		res.sendFile(thePath);
	}
});

router.get("/session", function(req, res) {
  	if (req.isAuthenticated()) {
       let thePath = path.resolve(__dirname,"public/views/home.html");
       res.sendFile(thePath);
  	} else {
	    let thePath = path.resolve(__dirname,"public/views/login.html");
	  	res.sendFile(thePath);
  	}
});

router.get("/adminInfo",function(req,res){
  	if(req.isAuthenticated()) {
		if (req.user.username == "admin"){
            initAdmin(req,res);
        }else
          res.json(null);
  	}else{
    	res.json(null);
  	}
});

//==================

function initAdmin(req,res) {

  User.find({},function(error,info) {
    if (error) {
      return res.json(null);
    } else {
      let list = [];
      for (let i=0;i<info.length;i++) {
        list.push({ident:info[i].ident,name:info[i].name});
      }
      res.json ({ ident:req.user.ident,username: req.user.username,userList:list});
    }
  });
}

router.get("/userInfo",function(req,res){
  if (req.isAuthenticated()) {
    initUser(req.user.ident,res);
	} else {
		res.json(null);
	}
});

function initUser(_ident,res) {
  User.find({ident:_ident},function(error,info) {
      if (error) {
        res.json(null);
      }
      else if (info == null) {
        res.json(null);
      }
      if (info.length == 1){
        res.json ({ ident:info[0].ident,username: info[0].name, period: info[0].period});
      }else{
        res.json (null);
      }
   });
}
router.get("/logout", function(req, res) {
  if (req.isAuthenticated()) {
    req.logout();
    res.redirect("/successroot");
  } else {
    res.redirect("/failroot");
  }
});
router.post("/signup", function(req, res, next) {
  console.log(req.body.username)
  var username = req.body.username;
  var fullName = req.body.fullName
  var password = req.body.password;
  var grade = req.body.grade
  var period = req.body.period;
  ident++;
  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }
    if (user) {
      req.flash("error", "User already exists");
      return res.redirect("/failsignup");
    }
    var newUser = new User({
      username: username,
      password: password,
      fullName: fullName,
      ident: ident,
      period: period,
      grade: grade
    });
    newUser.save(next);    
  });
}, passport.authenticate("login", {
  successRedirect: "/successsignup",
  failureRedirect: "/failsignup",
  failureFlash: true
}));
router.post("/login", passport.authenticate("login", {
  successRedirect: "/successlogin",
  failureRedirect: "/faillogin",
  failureFlash: true
}));
var noop = function() {};
router.post('/changepsw', function(req, res){
  console.log("post changepsw");
  if (req.isAuthenticated()) {
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) { res.json(null); }
    bcrypt.hash(req.body.password, salt, noop, function(err, hashedPassword) {
      if (err) {  res.json(null); }
    User.findOneAndUpdate({ident:req.user.ident},{password:hashedPassword},function(error,info) {
          if (error) {
              res.json(null);
          }
          else if (info == null) {
              res.json(null);
          }
          res.json({});
      });
    });
  });
  }
  else
    res.json(null);
});
router.delete('/deleteRoutes/:identifier', function(req, res){
    User.remove({ident:req.params.identifier},function(error,removed) {
        if (error) {
            return res.json(null);
        }
        return res.json(removed.result);
    });
});
module.exports = router;
