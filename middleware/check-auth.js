const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log("token recieved", token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log("decoded", decoded);
    req.userData = decoded;
    next();
  } catch (error) {
    next({
      message: "Auth failed Unauthorized",
      status: 401,
    });
  }
};
