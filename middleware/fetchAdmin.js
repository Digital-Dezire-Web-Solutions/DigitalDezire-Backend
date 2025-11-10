const jwt = require("jsonwebtoken");
const JWT_SECRET = "DigitalDezire@123";

const fetchAdmin = (req, res, next) => {
  // Get admin token from header
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ error: "Please authenticate with a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.admin = data.admin;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate with a valid token" });
  }
};

module.exports = fetchAdmin;