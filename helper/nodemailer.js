const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: "",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
