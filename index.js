var express = require('express');//
var bodyParser = require('body-parser');//
var cookieParser = require("cookie-parser");//
var routes = require("./routes");//
var flash = require("connect-flash");//
var mongoose = require("mongoose");
var passport = require("passport");
var path = require("path");
var session = require("express-session");
var app = express();//

var User = require("./models/user");

var setUpPassport = require("./setuppassport");
var routes = require("./routes");
var routesData = require("./routesData"); 

mongoose.connect("mongodb://localhost:27017/photodb");   
setUpPassport();

app.set("port", process.env.PORT || 3005);

app.use('/', express.static('./'));
app.use('/js', express.static('./public/js'));


app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  secret: "LUp$Dg?,I#i&owP3=9su+OB%`FgL4muLF5YJ~{;t",
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
app.use(routesData);

app.listen(app.get("port"), function() {
  console.log("Server started on port " + app.get("port"));
});
