const { inputData } = require('./production_sql_queries/input-production.js');

const express = require('express');
var cors = require('cors');
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const sqlite3 = require('sqlite3').verbose();
let sql; // used to define sql statements
let ptype;

//connection to DB
const db = new sqlite3.Database('./prod.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

// inputting data into the DB
// inputData();

// Updating the Product Type column based on model_no in Product table
sql = `UPDATE Product SET ptype = 
                        CASE 
                          WHEN model_no >= 10000 and model_no <= 19999 THEN 'case'
                          WHEN model_no >= 20000 and model_no <= 29999 THEN 'cpu_cooler'
                          WHEN model_no >= 30000 and model_no <= 39999 THEN 'cpu' 
                          WHEN model_no >= 40000 and model_no <= 49999 THEN 'gpu' 
                          WHEN model_no >= 50000 and model_no <= 69999 THEN 'memory' 
                          WHEN model_no >= 70000 and model_no <= 79999 THEN 'mobo' 
                          WHEN model_no >= 80000 and model_no <= 89999 THEN 'psu' 
                          WHEN model_no >= 90000 and model_no <= 99999 THEN 'storage'
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

// query for sending the Product data to inventory page
  app.get('/data', (req, res) => {
    const ptype = req.query.ptype;
    console.log(ptype);
    if (ptype == '1') {
      sql = "SELECT model_no, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'case';";
    }
    else if (ptype == '2') {
      sql = "SELECT model_no, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'cpu_cooler';";
    }
    else if (ptype == '3') {
      sql = "SELECT model_no, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'cpu';";
    }
    else if (ptype == '4') {
      sql = "SELECT model_no, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'gpu';";
    }
    else if (ptype == '5') {
      sql = "SELECT model_no, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'memory';";
    }
    else if (ptype == '7') {
      sql = "SELECT model_no, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'mobo';";
    }
    else if (ptype == '8') {
      sql = "SELECT model_no, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'psu';";
    }
    else if (ptype == '9') {
      sql = "SELECT model_no, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'storage';";
    }
    else {
      sql = "SELECT model_no, name, manufacture, retail_price, stock_qtty FROM Product;";
    }

    db.all(sql, [], (err, rows) => {
        if (err) {
          throw err;
        }
        console.log(sql);
        console.log(rows.length);
        res.send(JSON.stringify(rows));
      });
  });


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


// adding products to the database
let values = [];
let model_no;
app.post('/newproduct', (req, res) => {  
  res.status(200).json({msg: 'Yes'});

  if(req.body.type == 'mobo') {
      sql = `INSERT INTO Motherboard(model_no, socket, ram_slots, storage_slots, has_wifi)
             VALUES ((SELECT MAX(model_no) + 1 FROM Motherboard), ?, ?, ?, ?);`
      //values.push(req.body.core_count, req.body.core_clock, req.body.boost_clock, req.body.graphics, req.body.socket);
      db.run(sql, values, function (err) {
        if(err) {
          console.error(err.message);
        }
      });
      values = [];
      db.all("Select MAX(model_no) AS model_no FROM Motherboard",
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
  } else if (req.body.type == 'cpu_cooler') {
      sql = `INSERT INTO CPUCooler(model_no, rpm_low, rpm_high, noise_level, water_cooled)
             VALUES ((SELECT MAX(model_no) + 1 FROM Motherboard), ?, ?, ?, ?);`
      //values.push(req.body.core_count, req.body.core_clock, req.body.boost_clock, req.body.graphics, req.body.socket);
      db.run(sql, values, function (err) {
        if(err) {
          console.error(err.message);
        }
      });
      values = [];
      db.all("Select MAX(model_no) AS model_no FROM CPUCooler",
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
  }

  values = [];
  model_no = null;
});

// selecting products in inventory by product type
app.post('/filter', (req, res) => {  
  res.status(200).json({msg: 'Yes', ptype: req.body.ptype});
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});