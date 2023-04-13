const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "virgiawanlr2@gmail.com",
    pass: "pwbcfsiwpbtxfnjy",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
