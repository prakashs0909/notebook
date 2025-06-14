const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = process.env.SECRET_KEY;

//  route 1: post request , no login required
router.post(
  "/createuser",
  [
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("email", "Enter valid email").isEmail(),
    body("password", "Password must be atleat 8 character").isLength({
      min: 8,
    }),
  ],
  
  async (req, res) => {
    let success= false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.send({success, errors: result.array() });
    }

    try {
      // checking email is already used
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success= false;
        return res
          .status(400)
          .json({ success, error: "user with this email is already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success= true;
      console.log(success, authtoken);
      res.json({success, authtoken});
      } catch (error) {
      // console.log(error.message);
      res.status(500).send("Some error occur");
    }
  }
);

// route 2: authenticate post request, no login required
router.post(
  "/login",
  [
    body("email", "Enter valid email").isEmail(),
    body("password", "Password connot be blank").exists(),
  ],
  async (req, res) => {
    let success= false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.send({ errors: result.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success= false;
        return res.status(400).json({ error: "user does not exist" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success= false;
        return res.status(400).json({ success, error: "login to failed" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success= true;
      res.json({success, authtoken});
    } catch (error) {
      // console.log(error.message);
      res.status(500).send("Internal server error occur");
    }
  }
);

// routes 3: get loggedin user detail , login required
router.post("/getuser", fetchuser, async (req, res) => {

  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    // console.log(error.message);
    res.status(500).send("Internal server error occur");
  }
});

module.exports = router;
