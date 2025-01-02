const jwt = require("jsonwebtoken");
require("dotenv").config();
const key = process.env.SecretKey;

const roleCheck = (roles) => (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  try {
    const decoded = jwt.verify(token, key);

   
    if (Array.isArray(roles) && roles.includes(decoded.role)) {
      req.user = decoded; 
      return next(); 
    }

   
    return res.status(403).send("Forbidden: Not allowed");
  } catch (err) {
    console.error("Error verifying token:", err.message);
    return res.status(401).send("Unauthorized: Invalid token");
  }
};

module.exports = roleCheck;
