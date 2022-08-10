const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const signUpSchema = require("../../Schemas/signUpSchema");
const medicineSchema = require("../../Schemas/medicineSchema");
const UserSignUp = new mongoose.model("UserSignup", signUpSchema);
const MedicineSchema = new mongoose.model("MedicineSchema", medicineSchema);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
var fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const fileStorageEngine = multer.diskStorage({
	destination: (req, file, cb) => {
		if (!fs.existsSync("public/medicine")) {
			fs.mkdirSync("public/medicine", { recursive: true });
		}
		cb(null, "public/medicine");
	},
	filename: (req, file, cb) => {
		cb(null, uuidv4() + "--" + file.originalname);
	},
});
const upload = multer({ storage: fileStorageEngine });

router.post(
	"/createMedicine",
	upload.fields([
		{
			name: "image",
			maxCount: 1,
		},
	]),
	async (req, res) => {
		console.log(req.body);

		const image = req.files.image[0];

		const userEmail = await verifyToken(req.headers["token"]);
		console.log("userEmail", userEmail);

		const rootDir = "public/";
		const medDir = "medicine";
		const dir = rootDir + medDir;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(roodirtDir, { recursive: true });
		}
		fs.rename(image.path, dir + "/" + image.filename, function (err) {
			if (err) throw err;
		});

		const medicine = new MedicineSchema({
			medName: req.body.medName,
			company: req.body.company,
			specification: req.body.specification,
			price: req.body.price,
			image: medDir + "/" + image.filename,
			userEmail: userEmail,
		});
		try {
			const data = await medicine.save();

			res.status(200).json({
				result: data,
				message: "Success",
			});
		} catch (err) {
			console.log(err);
			res.status(500).json({
				error: "There was a server side error",
			});
		}
	}
);

router.put("/updateMedicine", async (req, res) => {});

router.get("/getMedicineByShop", async (req, res) => {
	console.log(req.body);

	const userEmail = await verifyToken(req.headers["token"]);
	console.log("userEmail", userEmail);

	const medicine = await MedicineSchema.find({
		userEmail: userEmail,
	});
	const shop = await UserSignUp.findOne({
		email: userEmail,
	});

	try {
		const data = {
			medicine: medicine,
			shop: shop,
		};

		res.status(200).json({
			result: data,
			message: "Success",
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: "There was a server side error",
		});
	}
});

router.get("/searchMedicineForSeller", async (req, res) => {
	console.log(req.body);

	const userEmail = await verifyToken(req.headers["token"]);
	console.log("userEmail", userEmail);
});

router.post("/searchMedicineForUser/", async (req, res) => {
	console.log(req.body);

	const { searchText } = req.body;

	try {
		const medicine = await MedicineSchema.find({
			medName: searchText,
		});

		const shop = await UserSignUp.findOne({
			where: {
				email: medicine.userEmail,
			},
		});

		console.log(medicine);

		const data = {
			medicine: medicine,
			shop: shop,
		};

		res.status(200).json({
			result: data,
			message: "Success",
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: "There was a server side error",
		});
	}
});

const verifyToken = async (token) => {
	console.log("token", token);

	try {
		const verified = await jwt.verify(token, "this is dummy text");
		if (verified) {
			const user = await UserSignUp.findOne({
				where: {
					email: verified.email,
				},
			});
			if (user === null) {
				return null;
			}
			return user.email;
		} else {
			// Access Denied
			return null;
		}
	} catch (error) {
		// Access Denied
		return null;
	}
};

module.exports = router;
