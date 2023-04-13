const jwt = require("jsonwebtoken");

module.exports = {
  tokenDecoder: (req, res, next) => {
    console.log("token decode", req.token);
    jwt.verify(req.token, "mini-cashier", (err, decode) => {
      if (err) {
        return res
          .status(401)
          .send({ message: "not a match user", isSuccess: false });
      }
      req.user = decode;
      console.log("decoded", req.user);
      next();
    });
  },
};
