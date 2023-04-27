const { db, query } = require("../database");
const bcrypt = require("bcrypt");
const { createToken } = require("../helper/createToken");
const transporter = require("../helper/nodemailer");
const { mail } = require("../helper/verifMail");

module.exports = {
  registerUser: async (req, res) => {
    const { username, email, password, phone_number } = req.body;
    let emailCheckQuery = `SELECT * from Users WHERE email=${db.escape(email)}`;

    const isEmailExist = await query(emailCheckQuery);

    if (isEmailExist.length > 0) {
      return res.status(400).send({
        message: "submitted email has already exist",
        isSuccess: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let insertNewUserQuery = `INSERT into Users (username, email, password, phone_number) values (${db.escape(
      username
    )}, ${db.escape(email)}, ${db.escape(hashedPassword)}, ${db.escape(
      phone_number
    )})`;

    try {
      const insertNewUserResult = await query(insertNewUserQuery);
      let payload = {
        user_ID: insertNewUserResult.insertId,
        username,
        email,
        phone_number,
      };

      const token = createToken(payload);
      let mailToSend = mail(email, token);

      transporter.sendMail(mailToSend, (errMail, resMail) => {
        if (errMail) {
          return res.status(500).send({
            message: "Registration failed",
            isSuccess: false,
            error: errMail,
          });
        } else {
          return res.status(201).send({
            message: "Registration success, user need to verify their email",
            isSuccess: true,
          });
        }
      });
    } catch (error) {
      return res.status(500).send({ message: error.message, isSuccess: false });
    }
  },

  verifyAccount: async (req, res) => {
    const { user_ID, username, email, phone_number } = req.user;
    let updateVerifyQuery = `UPDATE Users SET is_verify=1 WHERE user_ID=${db.escape(
      user_ID
    )}`;
    try {
      const updateVerifyResult = await query(updateVerifyQuery);
      return res
        .status(200)
        .send({ message: "your account is verified!", isSuccess: true });
    } catch (error) {
      return res.status(400).send({ message: error.message, isSuccess: false });
    }
  },

  loginAccount: async (req, res) => {
    const { email, password } = req.body;
    let checkEmailQuery = `SELECT * FROM Users WHERE email=${db.escape(email)}`;
    try {
      const checkEmailResult = await query(checkEmailQuery);
      if (checkEmailResult.length === 0) {
        return res
          .status(401)
          .send({ message: "invalid email and password", isSuccess: false });
      }

      if (!checkEmailResult[0].is_verify) {
        return res.status(401).send({
          message: "your account is not yet verified",
          isSuccess: false,
        });
      }

      let isPassMatch = await bcrypt.compare(
        password,
        checkEmailResult[0].password
      );

      if (!isPassMatch) {
        return res
          .status(401)
          .send({ message: "invalid email and password", isSuccess: false });
      } else {
        const { user_ID, username, email, phone_number } = checkEmailResult[0];
        const user = { user_ID, username, email, phone_number };
        const token = createToken(user);

        return res.status(200).send({
          message: "login success",
          isSuccess: true,
          data: { token, user },
        });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message, isSuccess: false });
    }
  },

  keepLogin: async (req, res) => {
    const { user_ID } = req.user;
    let checkUserIdQuery = `SELECT * from Users WHERE user_ID=${db.escape(
      user_ID
    )}`;
    try {
      const checkUserIdResult = await query(checkUserIdQuery);
      if (checkUserIdResult.length === 0) {
        return res
          .status(401)
          .send({ message: "unauthorized!", isSuccess: false });
      } else {
        const { email, username, phone_number } = checkUserIdResult[0];
        const data = { user_ID, username, email, phone_number };
        return res
          .status(200)
          .send({ message: "success", isSuccess: true, data });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message, isSuccess: false });
    }
  },
};
