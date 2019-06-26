var mongoose = require("mongoose");

var cameraSchema = mongoose.Schema({
	ident: {
		required: true,
		unique: true,
		type:String
	},
	name: String,
	description: String,
	checkedOut: Boolean,
	reserved: Array
});

var camera = mongoose.model("camera", cameraSchema);

module.exports = camera;