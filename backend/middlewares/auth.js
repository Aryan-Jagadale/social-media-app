const User = require("../model/User");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    //console.log("Req.cookies.....",req.cookies);

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    /*console.log(token);
    console.log(process.env.JWT_SECRET);*/

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id);

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};