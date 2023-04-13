const jwt = require("jsonwebtoken");

// making token: creating function to make a token, token here to encoding-decoding
// data from database
module.exports = {
  createToken: (payload) => {
    return jwt.sign(
      payload, // making token: /*data untuk membuat token*/,
      "mini-cashier", // secret-key to encode
      { expiresIn: "12h" } // token lifetime, in this case is 12 hours
    );
  },
};
