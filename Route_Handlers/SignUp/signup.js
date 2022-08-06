const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const signUpSchema = require("../../Schemas/signUpSchema");
const medicineSchema = require("../../Schemas/medicineSchema");
const UserSignUp = new mongoose.model("UserSignup", signUpSchema);
const MedicineSchema = new mongoose.model("MedicineSchema", medicineSchema);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const Joi = require('joi');
const { registerValidation, loginValidation } = require('../../Validation/validation');

router.post("/medUpdate", async(req,res)=>{

  console.log(req.body);

  const medicine = new MedicineSchema({
    medName:req.body.medName,
    company: req.body.company,
    specification: req.body.specification,
    price: req.body.price
  });
  try {
    const data = await medicine.save();

    res.status(200).json({
      result: data,
      message: "Success",
           
    });
    res.redirect('/new')
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "There was a server side error",
    });
  }

});
//Post An Item
router.post("/register", async (req, res) => {

  console.log(req.body);
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  
//checking if the user is already in the database       
const emailExist = await UserSignUp.findOne({ email: req.body.email });
if (emailExist) return res.status(400).send('Email Already Exists');

//checking if the user is already in the database       
const phoneExist = await UserSignUp.findOne({ phoneNumber: req.body.phoneNumber });
if (phoneExist) return res.status(400).send('Phone Number Already Exists');

//hash passwords
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt);


  const user = new UserSignUp({
    userName: req.body.userName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    location: req.body.location,
    password: hashedPassword
  });

  try {
    const data = await user.save();

    res.status(200).json({
      result: data,
      message: "Registration Successful",
           
    });
    res.redirect('/new')
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});


router.post("/login", async (req, res) => {

  console.log("Welcome to Log In Era");
  console.log(req.body.email);

  const { error } = loginValidation(req.body); //Middle-ware
  if (error) return res.status(400).send(error.details[0].message);

  UserSignUp.find({ email: req.body.email}).exec().then(user=>{
    if(user.length<1)
    {
      return res.status(401).json({
        msg:'user not exist'
      })
   
    } 
    bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
      if(!result)
      {
        return res.status(401).json({
          msg: 'password matching failed'          
        })
      }
      if(result)
      {
        const token=jwt.sign({
          userName: user[0].userName,
          email: user[0].email,
          phoneNumber:user[0].phoneNumber
        },
        'this is dummy text',
        {
          expiresIn:"24h"
        });
        res.status(200).json({
          userName: user[0].userName,
          email: user[0].email,
          phoneNumber:user[0].phoneNumber,
          token: token
        })

      }
    })
  }).catch(err=>{
    res.status(500).json({
      err:err
    })
  })
  //if (emailFound) return res.status(400).send('Email not found');
  
  

});

module.exports = router;
