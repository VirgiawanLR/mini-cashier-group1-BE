const express = require("express");
const { transactionController } = require("../controller");
const router = express.Router();
const { tokenDecoder } = require("../middleware/tokenDecoder");

router.post("/new", tokenDecoder, transactionController.postNewTransaction);
router.get("/data", tokenDecoder, transactionController.getDataTransaction);
router.post(
  "/detail",
  tokenDecoder,
  transactionController.getDetailTransaction
);
router.get("/gross/daily", tokenDecoder, transactionController.getGrossIncome);
router.get(
  "/total-order/daily",
  tokenDecoder,
  transactionController.getTotalOrderDaily
);

module.exports = router;
