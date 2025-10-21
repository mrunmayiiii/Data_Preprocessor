const router=require("express").Router();
const { signup , login } = require("../controllers/authController");
const { signupValidation, loginValidation } = require("../middlewares/AuthValidation");
const User=require("../models/User");
const bcrypt=require("bcrypt");


router.post("/login",loginValidation,login);

router.post("/signup",signupValidation,signup);

module.exports=router;