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
	shop: {
		userName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
	},
});

module.exports = medicineSchema;
