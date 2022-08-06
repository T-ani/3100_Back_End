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
   /* image:
    {
        type: String,//binary convert file or link or folder
        required: true,

    },
    userId: {
        type: String,
        required: true,

    }*/

});

module.exports = medicineSchema;
