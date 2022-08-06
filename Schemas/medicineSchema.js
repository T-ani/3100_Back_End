const mongoose = require("mongoose");

const medicineSchema = mongoose.Schema({
	medName: {
		type: String,
		required: true,
	},
	company: {
		type: String,
		required: true,
	},
	specification: {
		type: String,
		required: true,
	},
	price: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	userEmail: {
		type: String,
		required: true,
	},
});

module.exports = medicineSchema;
