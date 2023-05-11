const { db, query } = require("../database");
const { encrypt, decrypt } = require("../helper/cryptoJS");
const { fillZeroTransactionDay } = require("../helper/fillZeroTransactionDay");

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

  getDataTransaction: async (req, res) => {
    const { user_ID } = req.user;
    let { start, end, offset, limit } = req.query;
    offset = parseInt(offset);
    limit = parseInt(limit);

    if (!user_ID) {
      return res
        .status(401)
        .send({ message: "Not authorized to proceed", isSuccess: "false" });
    }
    let getQuery = `SELECT * FROM Transaction t WHERE t.user_ID = ${user_ID} `;
    let getCountQuery = `SELECT COUNT(t.transaction_ID) as count FROM Transaction t
    WHERE t.user_ID=${user_ID} `;
    if (start && end) {
      getQuery += `AND t.transaction_date BETWEEN ${db.escape(
        start
      )} AND ${db.escape(end)} `;
      getCountQuery += `AND t.transaction_date BETWEEN ${db.escape(
        start
      )} AND ${db.escape(end)} `;
    }
    getQuery += `ORDER BY t.transaction_date desc LIMIT ${db.escape(
      offset
    )},${db.escape(limit)}`;
    try {
      const getData = await query(getQuery);
      const getCount = await query(getCountQuery);
      let totalData = getCount[0].count;
      let totalPage = Math.ceil(totalData / 9);
      let dataToSend = getData.map((item) => {
        let { transaction_ID, transaction_totalprice, transaction_date } = item;
        transaction_ID = encrypt(transaction_ID.toString());
        return {
          transaction_ID,
          transaction_totalprice,
          date: transaction_date
            .toISOString()
            .replace(/[a-z]/gi, " ")
            .split(" ")
            .slice(0, 2),
        };
      });
      return res.status(200).send({
        message: "success to fetch data",
        isSuccess: true,
        data: dataToSend,
        totalPage,
        totalData,
      });
    } catch (error) {
      return res.status(400).send({ message: error.message, isSuccess: false });
    }
  },

  getDetailTransaction: async (req, res) => {
    const { user_ID } = req.user;
    let { transaction_ID } = req.body;
    transaction_ID = parseInt(decrypt(transaction_ID));

    if (!user_ID) {
      return res
        .status(401)
        .send({ message: "Not authorized to proceed", isSuccess: "false" });
    }

    let detailTransactionQuery = `select t.transaction_ID as transaction_ID,
    p.product_name as product_name, p.product_price as price,
    tr.quantity as quantity,
    t.transaction_totalprice as total_price,
    t.transaction_date as transaction_date from Transaction t
    join Transaction_product_rlt tr on t.transaction_ID = tr.transaction_ID
    join Products p on tr.product_ID = p.product_ID
    where t.user_ID = ${db.escape(user_ID)} and t.transaction_ID = ${db.escape(
      transaction_ID
    )}`;

    try {
      const detailTransResp = await query(detailTransactionQuery);
      let data = {
        transaction_ID: encrypt(transaction_ID.toString()),
        total_price: detailTransResp[0].total_price,
        date: detailTransResp[0].transaction_date
          .toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
          .split(" "),
        itemList: detailTransResp.map((item) => {
          const { product_name, price, quantity } = item;
          return {
            product_name,
            product_price: price,
            qty: quantity,
          };
        }),
      };
      return res.status(200).send({
        message: "success to fetch data",
        isSuccess: true,
        data,
      });
    } catch (error) {
      return res.status(400).send({ message: error.message, isSuccess: false });
    }
  },

  getGrossIncome: async (req, res) => {
    const { user_ID } = req.user;
    let { start, end } = req.query;

    if (!user_ID) {
      return res
        .status(401)
        .send({ message: "Not authorized to proceed", isSuccess: "false" });
    }

    if (!(start && end)) {
      end = new Date();
      start = new Date().setDate(end.getDate() - 6);
      start = new Date(start).toISOString().split("T")[0] + " 00:00:00";
      end = end.toISOString().split("T")[0] + " 23:59:59";
    }

    let getGrossQuery = `SELECT IF(
      LOCATE(' ', transaction_date)>0,
      SUBSTRING(transaction_date, 1, LOCATE(' ', transaction_date)-1), 
      null) as date_column, sum(transaction_totalprice) as total_gross
      from Transaction where user_ID=${db.escape(user_ID)} AND
      transaction_date between ${db.escape(start)} AND ${db.escape(end)}
      group by date_column order by date_column desc`;

    try {
      const getGrossResponse = await query(getGrossQuery);
      const newData = fillZeroTransactionDay(
        start,
        end,
        getGrossResponse,
        "total_gross"
      );
      return res.status(200).send({
        message: "success to fetch data",
        isSuccess: true,
        data: newData,
      });
    } catch (error) {
      return res.status(400).send({ message: error.message, isSuccess: false });
    }
  },

  getTotalOrderDaily: async (req, res) => {
    const { user_ID } = req.user;
    let { start, end } = req.query;

    if (!user_ID) {
      return res
        .status(401)
        .send({ message: "Not authorized to proceed", isSuccess: "false" });
    }

    if (!(start && end)) {
      end = new Date();
      start = new Date().setDate(end.getDate() - 6);
      start = new Date(start).toISOString().split("T")[0] + " 00:00:00";
      end = end.toISOString().split("T")[0] + " 23:59:59";
    }

    let getTotalOrderQuery = `SELECT IF(
      LOCATE(' ', transaction_date)>0,
      SUBSTRING(transaction_date, 1, LOCATE(' ', transaction_date)-1), 
      null) as date_column, count(*) as total_transaction
      from Transaction where user_ID=${db.escape(user_ID)} AND
      transaction_date between ${db.escape(start)} AND ${db.escape(end)}
      group by date_column order by date_column desc;`;

    try {
      const getTotalOrderResp = await query(getTotalOrderQuery);
      const newData = fillZeroTransactionDay(
        start,
        end,
        getTotalOrderResp,
        "total_transaction"
      );
      return res.status(200).send({
        message: "success to fetch data",
        isSuccess: true,
        data: newData,
      });
    } catch (error) {
      return res.status(400).send({ message: error.message, isSuccess: false });
    }
  },

  getCategory: async (req, res) => {
    const { user_ID } = req.user;

    if (!user_ID) {
      return res
        .status(401)
        .send({ message: "Not authorized to proceed", isSuccess: "false" });
    }

    const getCategoryQuery = `SELECT category_ID,category_name
     FROM db_mini_cashier.Categories WHERE user_ID=${db.escape(user_ID)}`;
    try {
      const getCategoryResp = await query(getCategoryQuery);
      return res.status(200).send({
        message: "success to fetch data",
        isSuccess: true,
        data: getCategoryResp,
      });
    } catch (error) {
      return res.status(400).send({ message: error.message, isSuccess: false });
    }
  },

  getTopProductByCategory: async (req, res) => {
    const { user_ID } = req.user;
    let { category_ID } = req.query;
    category_ID = parseInt(category_ID);

    if (!user_ID) {
      return res
        .status(401)
        .send({ message: "Not authorized to proceed", isSuccess: "false" });
    }

    let getTopProductQuery = `select p.product_name as product_name,
    sum(tp.quantity) as total_ordered from Transaction_product_rlt tp 
    join Products p on p.product_ID = tp.product_ID where `;

    if (category_ID !== 0) {
      getTopProductQuery += `p.category_ID = ${db.escape(category_ID)} and `;
    }

    getTopProductQuery += `p.user_ID = ${db.escape(user_ID)}
    group by product_name order by total_ordered desc limit 0,6;`;

    try {
      const getTopProductResp = await query(getTopProductQuery);
      return res.status(200).send({
        message: "success to fetch data",
        isSuccess: true,
        data: getTopProductResp,
      });
    } catch (error) {
      return res.status(400).send({ message: error.message, isSuccess: false });
    }
  },
};
