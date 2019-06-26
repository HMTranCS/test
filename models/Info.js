var mongoose = require("mongoose");

var infoSchema = mongoose.Schema({
	userIdent: {
		required: true, 
		type:String
	},
	cameraIdent: {
		required: true,
		type:String
	},
	userName: String,
	camName: String,
	dateCheckedOut: Date,
	dateDue: Date,
	returned: Boolean,
	overDue: Boolean
});

var Info = mongoose.model("Info", infoSchema);

module.exports = Info;
