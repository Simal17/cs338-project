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
    const num = req.query.num;
    const manufacture = req.query.manufacture;
    console.log(num);
    console.log(manufacture);

    if (num != '0') {
      sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE model_no = $num;";
    } else if (manufacture != "") {
      if (ptype == '1') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'case' and manufacture = $manufacture;";
      }
      else if (ptype == '2') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'cpu_cooler' and manufacture = $manufacture;";
      }
      else if (ptype == '3') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'cpu' and manufacture = $manufacture;";
      }
      else if (ptype == '4') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'gpu' and manufacture = $manufacture;";
      }
      else if (ptype == '5') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'memory' and manufacture = $manufacture;";
      }
      else if (ptype == '7') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'mobo' and manufacture = $manufacture;";
      }
      else if (ptype == '8') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'psu' and manufacture = $manufacture;";
      }
      else if (ptype == '9') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'storage' and manufacture = $manufacture;";
      } else {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE manufacture = $manufacture;";
      }
    } else if (manufacture == "") {
      if (ptype == '1') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'case';";
      }
      else if (ptype == '2') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'cpu_cooler';";
      }
      else if (ptype == '3') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'cpu';";
      }
      else if (ptype == '4') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'gpu';";
      }
      else if (ptype == '5') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'memory';";
      }
      else if (ptype == '7') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'mobo';";
      }
      else if (ptype == '8') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'psu';";
      }
      else if (ptype == '9') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = 'storage';";
      } else {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product;";
      }
    } else {
      sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product;";
    }

    if (num != 0) {
      db.all(sql, {$num: num}, (err, rows) => {
        if (err) {
          throw err;
        }
        res.send(JSON.stringify(rows));
      });
    } else if (manufacture != "") {
      db.all(sql, {$manufacture: manufacture}, (err, rows) => {
        if (err) {
          throw err;
        }
        res.send(JSON.stringify(rows));
      });
    } else {
      db.all(sql, [], (err, rows) => {
        if (err) {
          throw err;
        }
        res.send(JSON.stringify(rows));
      });
    }
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
  // motherboard
  if(req.body.ptype == 7) {
      sql = `INSERT INTO Motherboard(model_no, socket, ram_slots, storage_slots, has_wifi)
             VALUES ((SELECT MAX(model_no) + 1 FROM Motherboard), ?, ?, ?, ?);`
      values.push(req.body.socket, req.body.RAM_slots, req.body.storage_slots, req.body.has_wifi);
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
          sql = `INSERT INTO Product(model_no, name, manufacture, retail_price, stock_qtty, tdp, ptype)
          VALUES (?, ?, ?, ?, ?, ?, ?);`
          values.push(model_no, req.body.pname, req.body.manufacture, req.body.retail_price, req.body.stock_qtty, req.body.tdp, req.body.ptype);
          console.log(values);
          db.run(sql, values, function (err) {
            if(err) {
              console.error(err.message);
            }
          });
          res.status(200).json({msg: model_no});
        }
      });
  // cpu
  } else if (req.body.ptype == 3) {
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
          sql = `INSERT INTO Product(model_no, name, manufacture, retail_price, stock_qtty, tdp, ptype)
          VALUES (?, ?, ?, ?, ?, ?, ?);`
          values.push(model_no, req.body.pname, req.body.manufacture, req.body.retail_price, req.body.stock_qtty, req.body.tdp, 'cpu');
          console.log(values);
          db.run(sql, values, function (err) {
            if(err) {
              console.error(err.message);
            }
          });
          res.status(200).json({msg: model_no});
        }
      });
  // cpu cooler
  } else if (req.body.ptype == 2) {
      sql = `INSERT INTO CPUCooler(model_no, rpm_low, rpm_high, noise_level, water_cooled)
             VALUES ((SELECT MAX(model_no) + 1 FROM CPUCooler), ?, ?, ?, ?);`
      values.push(req.body.RPM_low, req.body.RPM_high, req.body.noise_level, req.body.water_cooled);
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
          sql = `INSERT INTO Product(model_no, name, manufacture, retail_price, stock_qtty, tdp, ptype)
          VALUES (?, ?, ?, ?, ?, ?, ?);`
          values.push(model_no, req.body.pname, req.body.manufacture, req.body.retail_price, req.body.stock_qtty, req.body.tdp, 'cpu_cooler');
          console.log(values);
          db.run(sql, values, function (err) {
            if(err) {
              console.error(err.message);
            }
          });
          res.status(200).json({msg: model_no});
        }
      });
  // case
  } else if (req.body.ptype == 1) {
      sql = `INSERT INTO ProdCase(model_no, type, psu, side_panel, external_volume, internal_35_bays)
            VALUES ((SELECT MAX(model_no) + 1 FROM ProdCase), ?, ?, ?, ?, ?);`
      values.push(req.body.type, req.body.psu, req.body.side_panel, req.body.external_volume, req.body.internal_35_bays);
      db.run(sql, values, function (err) {
        if(err) {
          console.error(err.message);
        }
      });
      values = [];
      db.all("Select MAX(model_no) AS model_no FROM ProdCase",
      (err, rows) => {
        if (err) {
          console.error('Error executing query:', err);
        }
        else {
          model_no = rows[0].model_no;
          sql = `INSERT INTO Product(model_no, name, manufacture, retail_price, stock_qtty, tdp, ptype)
          VALUES (?, ?, ?, ?, ?, ?, ?);`
          values.push(model_no, req.body.pname, req.body.manufacture, req.body.retail_price, req.body.stock_qtty, req.body.tdp, 'case');
          console.log(values);
          db.run(sql, values, function (err) {
            if(err) {
              console.error(err.message);
            }
          });
          res.status(200).json({msg: model_no});
        }
      });
  // gpu
  } else if (req.body.ptype == 4) {
      sql = `INSERT INTO GPU(model_no, chipset, memory_size, memory_type, core_clock, boost_clock)
             VALUES ((SELECT MAX(model_no) + 1 FROM GPU), ?, ?, ?, ?, ?);`
      values.push(req.body.chipset, req.body.memory, req.body.memory_type, req.body.core_clock, req.body.boost_clock);
      db.run(sql, values, function (err) {
        if(err) {
          console.error(err.message);
        }
      });
      values = [];
      db.all("Select MAX(model_no) AS model_no FROM GPU",
      (err, rows) => {
        if (err) {
          console.error('Error executing query:', err);
        }
        else {
          model_no = rows[0].model_no;
          sql = `INSERT INTO Product(model_no, name, manufacture, retail_price, stock_qtty, tdp, ptype)
                 VALUES (?, ?, ?, ?, ?, ?, ?);`
          values.push(model_no, req.body.pname, req.body.manufacture, req.body.retail_price, req.body.stock_qtty, req.body.tdp, 'gpu');
          console.log(values);
          db.run(sql, values, function (err) {
            if(err) {
              console.error(err.message);
            }
          });
          res.status(200).json({msg: model_no});
        }
      });
  // memory
  } else if (req.body.ptype == 5) {
      sql = `INSERT INTO Memory(model_no, type, speed, kit_size, size_per_stick, first_word_latency, cas_latency)
            VALUES ((SELECT MAX(model_no) + 1 FROM Memory), ?, ?, ?, ?, ?, ?);`
      values.push(req.body.type, req.body.speed, req.body.kit_size, req.body.size_per_stick, req.body.first_word_latency, req.body.cas_latency);
      db.run(sql, values, function (err) {
        if(err) {
          console.error(err.message);
        }
      });
      values = [];
      db.all("Select MAX(model_no) AS model_no FROM Memory",
      (err, rows) => {
        if (err) {
          console.error('Error executing query:', err);
        }
        else {
          model_no = rows[0].model_no;
          sql = `INSERT INTO Product(model_no, name, manufacture, retail_price, stock_qtty, tdp, ptype)
                VALUES (?, ?, ?, ?, ?, ?, ?);`
          values.push(model_no, req.body.pname, req.body.manufacture, req.body.retail_price, req.body.stock_qtty, req.body.tdp, 'memory');
          console.log(values);
          db.run(sql, values, function (err) {
            if(err) {
              console.error(err.message);
            }
          });
          res.status(200).json({msg: model_no});
        }
      });
  // psu
  } else if (req.body.ptype == 8) {
    sql = `INSERT INTO PSU(model_no, type, efficiency, wattage, modular)
           VALUES ((SELECT MAX(model_no) + 1 FROM PSU), ?, ?, ?, ?);`
    values.push(req.body.type, req.body.efficiency, req.body.wattage, req.body.modular);
    db.run(sql, values, function (err) {
      if(err) {
        console.error(err.message);
      }
    });
    values = [];
    db.all("Select MAX(model_no) AS model_no FROM PSU",
    (err, rows) => {
      if (err) {
        console.error('Error executing query:', err);
      }
      else {
        model_no = rows[0].model_no;
        sql = `INSERT INTO Product(model_no, name, manufacture, retail_price, stock_qtty, tdp, ptype)
              VALUES (?, ?, ?, ?, ?, ?, ?);`
        values.push(model_no, req.body.pname, req.body.manufacture, req.body.retail_price, req.body.stock_qtty, req.body.tdp, 'psu');
        console.log(values);
        db.run(sql, values, function (err) {
          if(err) {
            console.error(err.message);
          }
        });
        res.status(200).json({msg: model_no});
      }
    });
  // storage
  } else if (req.body.ptype == 9) {
    sql = `INSERT INTO Storage(model_no, capacity, price_per_gb, type, cache, form_factor, interface)
           VALUES ((SELECT MAX(model_no) + 1 FROM Storage), ?, ?, ?, ?, ?, ?);`
    values.push(req.body.capacity, req.body.price_per_gb, req.body.type, req.body.cache, req.body.form_factor, req.body.interface);
    console.log(values);
    db.run(sql, values, function (err) {
      if(err) {
        console.error(err.message);
      }
    });
    values = [];
    db.all("Select MAX(model_no) AS model_no FROM Storage",
    (err, rows) => {
      if (err) {
        console.error('Error executing query:', err);
      }
      else {
        model_no = rows[0].model_no;
        sql = `INSERT INTO Product(model_no, name, manufacture, retail_price, stock_qtty, tdp, ptype)
              VALUES (?, ?, ?, ?, ?, ?, ?);`
        values.push(model_no, req.body.pname, req.body.manufacture, req.body.retail_price, req.body.stock_qtty, req.body.tdp, 'storage');
        console.log(values);
        db.run(sql, values, function (err) {
          if(err) {
            console.error(err.message);
          }
        });
        res.status(200).json({msg: model_no});
      }
    });
  }

  values = [];
  model_no = null;
});

// selecting products in inventory by product type
app.post('/filter', (req, res) => {  
  res.status(200).json({msg: 'Yes', ptype: req.body.ptype, manufacture: req.body.manufacture});
});

// selecting products in inventory by searched model number
app.post('/search', (req, res) => {  
  res.status(200).json({num: req.body.num});
});

// deleting products from the inventory page
app.post('/delete', (req, res) => {  
  res.status(200).json();
  sql = `DELETE FROM Product WHERE model_no = $modelno;`
  db.run(sql, {$modelno: req.body.values}, function (err) {
    if(err) {
      console.error(err.message);
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});