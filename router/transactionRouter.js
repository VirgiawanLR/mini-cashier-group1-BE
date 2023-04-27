const express = require("express");
const { transactionController } = require("../controller");
const router = express.Router();
const { tokenDecoder } = require("../middleware/tokenDecoder");

router.post("/new", tokenDecoder, transactionController.postNewTransaction);

module.exports = router;
