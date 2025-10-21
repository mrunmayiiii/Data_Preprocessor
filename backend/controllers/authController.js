const bcrypt=require("bcrypt");
const User=require("../models/User");
const jwt=require("jsonwebtoken");

const signup = async (req, res) => {
    try {
      const { name, username, email, password } = req.body;
  
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) {
        const field = existing.email === email ? "Email" : "Username";
        return res.status(409).json({ message: `${field} already exists`, success: false });
      }
  
      const userModel = new User({ name, username, email, password: await bcrypt.hash(password, 10) });
      await userModel.save();
  
      return res.status(201).json({ message: "User created successfully", success: true });
    } catch (error) {
      console.error(error)
      if (error && error.code === 11000) {
        const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || "Field";
        return res.status(409).json({ message: `${field} already exists`, success: false });
      }
      return res.status(500).json({ message: "Internal server error", success: false });
    }
  };

const login=async(req,res)=>{
     try {
      const { username, password } = req.body;
  
      const existing = await User.findOne({ username });
      if (!existing) {
        return res.status(403).json({ message: ` AUth failed`, success: false });
      }
      
      const isPassEqual=await bcrypt.compare(password,existing.password);
      if(!isPassEqual) {
             return res.status(403).json({ message: ` AUth failed`, success: false });

      }

      const jwtoken=jwt.sign({username:existing.username, id:existing._id,name:existing.name}
        ,process.env.JWT_SECRET
        ,{expiresIn:"24h"

        });

      
      return res.status(200).json({ message: "User login successfully", success: true , jwtoken, username:existing.username,name:existing.name});
    } catch (error) {
      console.error(error)
      if (error && error.code === 11000) {
        const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || "Field";
        return res.status(409).json({ message: `${field} already exists`, success: false });
      }
      return res.status(500).json({ message: "Internal server error", success: false });
    }
}

module.exports={
    signup,
     login,
}