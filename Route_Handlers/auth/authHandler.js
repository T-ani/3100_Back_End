const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userSchema = require("../../Schemas/userSchema");
const medicineSchema = require("../../Schemas/medicineSchema");
const UserModel = new mongoose.model("UserModel", userSchema);
const MedicineModel = new mongoose.model("MedicineModel", medicineSchema);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Joi = require("joi");
const {
	registerValidation,
	loginValidation,
} = require("../../Validation/validation");

//Post An Item
router.post("/signup", async (req, res) => {
	console.log(req.body);

	try {
		const { error } = registerValidation(req.body);
		if (error) return res.status(400).send(error.details[0].message);

		//checking if the user is already in the database
		const emailExist = await UserModel.findOne({ email: req.body.email });
		if (emailExist) return res.status(400).send("Email Already Exists");

		//checking if the user is already in the database
		const phoneExist = await UserModel.findOne({
			phoneNumber: req.body.phoneNumber,
		});
		if (phoneExist)
			return res.status(400).send("Phone Number Already Exists");

		//hash passwords
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		const user = new UserModel({
			userName: req.body.userName,
			email: req.body.email,
			phoneNumber: req.body.phoneNumber,
			location: req.body.location,
			password: hashedPassword,
		});

		const data = await user.save();

		res.status(200).json({
			result: data,
			message: "Registration Successful",
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: "There was a server side error",
		});
	}
});

router.post("/login", async (req, res) => {
	try {
		const { error } = loginValidation(req.body); // Middle-ware
		if (error) return res.status(400).send(error.details[0].message);

		const user = await UserModel.findOne({
			email: req.body.email,
			phoneNumber: req.body.phoneNumber,
		}).exec();
		if (!user) return res.status(400).send("Invalid Email or Phone Number");

		const isMatch = await bcrypt.compare(req.body.password, user.password);

		if (!isMatch) {
			return res.status(400).send("Incorrect Password");
		}

		const token = jwt.sign({ email: user.email }, "this is dummy text", {
			expiresIn: "24h",
		});

		return res.status(200).json({
			user: user,
			message: "Login Successful",
			token: token,
		});
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
