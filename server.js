const { inputData } = require('./production_sql_queries/input-production.js');

const express = require('express');
var cors = require('cors');
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const sqlite3 = require('sqlite3').verbose();
let sql; // used to define sql statements

//connection to DB
const db = new sqlite3.Database('./prod.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

// inputting data into the DB
// inputData();

// Updating the ProdType column based on model_no in Product table
sql = `UPDATE Product SET ProdType = 
                        CASE 
                          WHEN model_no >= 20000 and model_no <= 29999 THEN 'cpu' 
                          ELSE NULL 
                        END`;
db.run(sql, [], function (err) {
  if(err) {
    console.error(err.message);
  }
});

app.use(cors({
  origin: 'http://localhost:4200',  // Allow only your Angular app to access
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// login feature
app.post('/auth/login', (req, res) => {
  const {type, userName, password} = req.body;
  db.all("Select fname, pwd FROM User where user_id=$user", {
    $user: userName
  },
  (err, rows) => {
    if (rows.length == 1) {
      rows.forEach((row) => {
        if(row.pwd == password) {
          return res.status(200).json({msg: 'ok', name: row.fname});
        }
        else {
          return res.status(400).send('Incorrect Password.')
        }
      })
    }

    else {
      return res.status(400).send('User not found.')
    }
  })
});

// query for sending the Product data to inventory page
app.get('/data', (req, res) => {
  sql = "SELECT model_no, name, manufacture, retail_price, stock_qtty FROM Product ORDER BY model_no ASC;";
  db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      res.send(JSON.stringify(rows));
    });
});

// adding products to the database
let values = [];
let model_no;
app.post('/newproduct', (req, res) => {  
  res.status(200).json({msg: 'Yes'});

  if(req.body.type == 'mobo') {
  
} else if (req.body.type == 'cpu') {
      sql = `INSERT INTO CPU(model_no, core_count, core_clock, boost_clock, graphics, socket)
             VALUES ((SELECT MAX(model_no) + 1 FROM CPU), ?, ?, ?, ?, ?);`
      values.push(req.body.core_count, req.body.core_clock, req.body.boost_clock, req.body.graphics, req.body.socket);
      db.run(sql, values, function (err) {
        if(err) {
          console.error(err.message);
        }
      });
      values = [];
      db.all("Select MAX(model_no) AS model_no FROM CPU",
      (err, rows) => {
        if (err) {
          console.error('Error executing query:', err);
        }
        else {
          model_no = rows[0].model_no;
          sql = `INSERT INTO Product(model_no, name, manufacture, retail_price, stock_qtty, tdp, ProdType)
          VALUES (?, ?, ?, ?, ?, ?, ?);`
          values.push(model_no, req.body.pname, req.body.manufacture, req.body.retail_price, req.body.stock_qtty, req.body.tdp, req.body.ptype);
          console.log(values);
          db.run(sql, values, function (err) {
            if(err) {
              console.error(err.message);
            }
          });
        }
      });
  } else if (req.body.type == 'cpu_cooler') {}

  values = [];
  model_no = null;
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});