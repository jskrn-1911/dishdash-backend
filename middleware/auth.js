// import jwt from "jsonwebtoken"

// const middleware  = function (req, res, next) {
//   if(!req.header("Authorization")){
//     return res.status(401).json({ msg: "Authorization header missing" });
//   }
//   const token = req.header('Authorization').split(' ')[1];
//   if (!token) return res.status(401).json({ msg: 'No token, or wrong token  authorization denied' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };

// export default middleware;

import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "Token is missing or malformed" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token has expired. Please log in again." });
    }
    res.status(401).json({ msg: "Invalid token. Authorization denied." });
  }
};

export default auth;
