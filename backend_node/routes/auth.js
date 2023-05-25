const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_TOKEN = "IAMVIHAANSINGLA";
const User = require("../models/Users");
const validator = require('validator');

const fetchuser = require("../middlewares/fetchuserdata");

async function checkIfUserExists(email) {
  return User.findOne({ email: email })
    .then((user) => (user ? true : false))
    .catch(() => false);
}

router.post("/checktoken", fetchuser, async (req, res) => {
  if (req.user.status === "error") {
    res.send({ status: "error" });
  } else {
    res.send({ status: "success" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
      // 422 error code
      return res.json({ status: "error", message: "Some fields are missing" });
    }
    const userExist = await checkIfUserExists(email);
    if (userExist) {
      res.json({ status: "error", message: "Email already exists" });
    }
    else if(!validator.isEmail(email)) {
      res.json({ status: "error", message: "Email is not valid" });
    } else {
      const userdata = new User({
        firstname,
        lastname,
        email,
        password,
      });

      await userdata.save();
      // we need to show created when created which is 201
      // sendmail(verification_code,email);
      const data = {
        user: {
          id: userdata._id,
          name: userdata.firstname,
          lastname: userdata.lastname
        },
      };

      const authtoken = jwt.sign(data, JWT_TOKEN);

      return res.json({
        status: "success",
        authtoken: authtoken,
        message: "Data saved successfully",
        firstname: userdata.firstname,
        lastname: userdata.lastname,
        id: userdata._id,
      });
    }
  } catch (err) {
    // it should show error status 400 when there is an error
    return res.json({ status: "error", message: "Some Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        status: "error",
        message: "Email and Password is incorrect",
      });
    } else {
      const userdata = await User.findOne({ email: email });
      const isvalid = await bcrypt.compare(password, userdata.password);
      if (isvalid) {
        const data = {
          user: {
            id: userdata._id,
            name: userdata.firstname,
            lastname: userdata.lastname,
          },
        };

        const authtoken = jwt.sign(data, JWT_TOKEN);
        res.json({
          status: "success",
          authtoken: authtoken,
          message: "Login Successful",
          firstname: userdata.firstname,
          lastname: userdata.lastname,
          id: userdata._id,
        });
      } else {
        return res.json({
          status: "error",
          message: "Email and Password is incorrect",
        });
      }
    }
  } catch (error) {
    res.send({ error: "error" });
  }
});

module.exports = router;
