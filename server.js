const express = require('express');
var cors = require('cors');
const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const sqlite3 = require('sqlite3').verbose();
let sql;

//connection to DB
const db = new sqlite3.Database('./sampletest.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

// // USER TABLE
// sql = "CREATE TABLE User(fname VARCHAR(30) NOT NULL, lname VARCHAR(30) NOT NULL, user_id INT NOT NULL PRIMARY KEY, pwd VARCHAR(30))";
// db.run(sql);

// // read CSV files of data
// const fs = require('fs');
// const { parse } = require('csv-parse');
// const { serialize } = require('v8');

// fs.createReadStream("./data/user-sample.csv")
//   .pipe(parse({ delimiter: ",", from_line: 2}))
//   .on("data", function(row) {
//     db.serialize(function() {
//       db.run(
//         "INSERT INTO User VALUES (?,?,?,?)",
//         [row[0], row[1], row[2], row[3]],
//         function(error) {
//           if(error) { return console.log(error.message);}
//           console.log(`Inserted a row with the id: ${this.lastID}`)
//         }
//       );
//     });
//   })

// .on("end", function(){
//   console.log("finished");
// })
// .on("error", function(error){
//   console.log(error.message);
// });

// // query data
// // app.get('/data', (req, res) => {
// //     sql = "SELECT * FROM Users";
// //     db.all(sql, [], (err, rows) => {
// //         if (err) {
// //           throw err;
// //         }
// //         res.send(JSON.stringify(rows));
// //       });
// //   });


// // PRODUCT TABLE
// sql = "CREATE TABLE Product(model_no INT NOT NULL PRIMARY KEY, name VARCHAR(30) NOT NULL, manufacture VARCHAR(30) NOT NULL, retail_price DECIMAL(10, 2) NOT NULL, stock_qtty INT, tdp INT, form_factor VARCHAR(10))";
// db.run(sql);

// // read CSV files of data
// fs.createReadStream("./data/product-sample.csv")
//   .pipe(parse({ delimiter: ",", from_line: 2}))
//   .on("data", function(row) {
//     db.serialize(function() {
//       db.run(
//         "INSERT INTO Product VALUES (?,?,?,?,?,?,?)",
//         [row[0], row[1], row[2], row[3], row[4], row[5], row[6]],
//         function(error) {
//           if(error) { return console.log(error.message);}
//           console.log(`Inserted a row with the id: ${this.lastID}`)
//         }
//       );
//     });
//   })

// .on("end", function(){
//    console.log("finished");
//  })
//  .on("error", function(error){
//    console.log(error.message);
//  });


// // PRODUCT ORDER TABLE
// sql = "CREATE TABLE Order(order_id INT NOT NULL PRIMARY KEY, buyer VARCHAR(30) NOT NULL)";
// db.run(sql);

// // read CSV files of data
// fs.createReadStream("./data/order-sample.csv")
//   .pipe(parse({ delimiter: ",", from_line: 2}))
//   .on("data", function(row) {
//     db.serialize(function() {
//       db.run(
//         "INSERT INTO Product VALUES (?,?,?,?,?,?,?)",
//         [row[0], row[1], row[2], row[3], row[4], row[5], row[6]],
//         function(error) {
//           if(error) { return console.log(error.message);}
//           console.log(`Inserted a row with the id: ${this.lastID}`)
//         }
//       );
//     });
//   })

// .on("end", function(){
//    console.log("finished");
//  })
//  .on("error", function(error){
//    console.log(error.message);
//  });


// // CPU TABLE
// sql = "CREATE TABLE CPU(order_id INT NOT NULL PRIMARY KEY, buyer VARCHAR(30) NOT NULL)";
// db.run(sql);

// // read CSV files of data
// fs.createReadStream("./data/order-sample.csv")
//   .pipe(parse({ delimiter: ",", from_line: 2}))
//   .on("data", function(row) {
//     db.serialize(function() {
//       db.run(
//         "INSERT INTO Product VALUES (?,?,?,?,?,?,?)",
//         [row[0], row[1], row[2], row[3], row[4], row[5], row[6]],
//         function(error) {
//           if(error) { return console.log(error.message);}
//           console.log(`Inserted a row with the id: ${this.lastID}`)
//         }
//       );
//     });
//   })

// .on("end", function(){
//    console.log("finished");
//  })
//  .on("error", function(error){
//    console.log(error.message);
//  });
