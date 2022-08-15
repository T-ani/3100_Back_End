const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const signUpSchema = require("../../Schemas/userSchema");
const medicineSchema = require("../../Schemas/medicineSchema");
const UserModel = new mongoose.model("UserModel", signUpSchema);
const MedicineModel = new mongoose.model("MedicineModel", medicineSchema);
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

		const shop = await UserModel.findOne({
			where: {
				email: userEmail,
			},
		});

		const medicine = new MedicineModel({
			medName: req.body.medName,
			company: req.body.company,
			specification: req.body.specification,
			price: req.body.price,
			image: medDir + "/" + image.filename,
			shop: shop,
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
	console.log("token", req.headers["token"]);

	try {
		const userEmail = await verifyToken(req.headers["token"]);
		console.log("userEmail", userEmail);

		const medicine = await MedicineModel.find({
			"shop.email": userEmail,
		});
		console.log(medicine);

		const data = {
			medicine: medicine,
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
		const medicine = await MedicineModel.find({
			medName: searchText,
		});

		const shop = await UserModel.findOne({
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
	try {
		const verified = await jwt.verify(token, "this is dummy text");
		console.log("verified", verified.email);
		if (verified) {
			const user = await UserModel.findOne({
				email: verified.email,
			});
			if (user === null) {
				return null;
			}
			console.log(user);
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
