const Joi = require("joi");

//Register Validation
const registerValidation = (data) => {
	console.log(data);
	const schema = Joi.object().keys({
		userName: Joi.string().min(6).required(),

		email: Joi.string().required().email(),

		phoneNumber: Joi.string().min(11).required(),

		location: Joi.string().required(),

		password: Joi.string().min(6).required(),
	});

	return schema.validate(data);
};

const loginValidation = (data) => {
	const schema = Joi.object().keys({
		email: Joi.string().min(6).required().email(),

		phoneNumber: Joi.string().min(6).required(),

		password: Joi.string().min(6).required(),
	});

	return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
