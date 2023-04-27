const { db, query } = require("../database");
const { encrypt, decrypt } = require("../helper/cryptoJS");

module.exports = {
  postNewTransaction: async (req, res) => {
    const { user_ID } = req.user;
    const { transaction_list, transaction_price } = req.body;
    if (!user_ID) {
      return res
        .status(401)
        .send({ message: "Not authorized to proceed", isSuccess: "false" });
    }
    const transactionQuery = `INSERT INTO Transaction (transaction_totalprice, user_ID) values (${db.escape(
      transaction_price
    )}, ${db.escape(user_ID)})`;

    try {
      const insertTransaction = await query(transactionQuery);
      let transProdQuery = `INSERT INTO Transaction_product_rlt (product_ID, quantity, transaction_ID) values `;
      transProdQuery += transaction_list
        .map((product) => {
          return `(${product.product_ID}, ${product.qty}, ${db.escape(
            insertTransaction.insertId
          )})`;
        })
        .join(", ");
      const insertTransProdTable = await query(transProdQuery);
      const encryptedID = encrypt(insertTransaction.insertId.toString());

      return res.status(201).send({
        message: `transaction success`,
        isSuccess: true,
        transactionID: encryptedID,
      });
    } catch (error) {
      return res.status(400).send({ message: error.message, isSuccess: false });
    }
  },
};
