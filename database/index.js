const mysql = require("mysql2"); // database: importing mysql
const util = require("util");
// database: require util to make db query use the try-catch and async await method
// instead of callback function

const db = mysql.createConnection({
  //database: creating connection into the desired database
  host: "localhost",
  user: "root",
  password: "",
  database: "db_mini_cashier",
  port: 3306,
  multipleStatements: true,
});

db.connect((err) => {
  if (err) {
    return console.log("error: ", err.message);
  }
  console.log("CONNECTED TO MYSQL");
});

const query = util.promisify(db.query).bind(db);
// database: query and promisify binding to DB

module.exports = {
  // database: export db and query
  db,
  query,
};
