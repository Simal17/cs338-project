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

// inputting data into the DB, uncomment for restoring database
// inputData();

// table for low stock
// sql = "CREATE TABLE LowStock(model_no INT, name VARCHAR(30), manufacture VARCHAR(30), quantity INT, ptype VARCHAR(30))";
// db.run(sql);

// adding data to the low stock table
let counter = 1;

if(counter == 1) {
  sql = `DELETE FROM LowStock`;
  db.run(sql);
  counter = 0;

  sql = `INSERT INTO LowStock(model_no, name, manufacture, quantity, ptype)
        SELECT model_no, name, manufacture, stock_qtty as quantity, ptype
        FROM Product
        WHERE quantity < 3;`
  db.run(sql);
}

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

// query for sending the Product data to inventory page and includes filtering conditions
  app.get('/data', (req, res) => {
    const ptype = req.query.ptype;
    let name_ptype;
    const num = req.query.num;
    const manufacture = req.query.manufacture;
    const plow = req.query.plow;
    const phigh = req.query.phigh;

    if (ptype == '1') {
      name_ptype = 'case';
    }
    else if (ptype == '2') {
      name_ptype = 'cpu_cooler';
    }
    else if (ptype == '3') {
      name_ptype = 'cpu';
    }
    else if (ptype == '4') {
      name_ptype = 'gpu';
    }
    else if (ptype == '5') {
      name_ptype = 'memory';
    }
    else if (ptype == '7') {
      name_ptype = 'mobo';
    }
    else if (ptype == '8') {
      name_ptype = 'psu';
    }
    else if (ptype == '9') {
      name_ptype = 'storage';
    }

    if (num != '0') {
      sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE model_no = $num;";
    } else if (manufacture != "" && plow != '-1' && phigh != '-1') {
      if(ptype == '0') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE manufacture = $manufacture AND retail_price BETWEEN $plow AND $phigh;";
      } else {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = $ptype AND manufacture = $manufacture AND retail_price BETWEEN $plow AND $phigh;";
      }
    } else if (manufacture == "" && plow != '-1' && phigh != '-1') {
      if(ptype == '0') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE retail_price BETWEEN $plow AND $phigh;";
      }
      else {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = $ptype && retail_price BETWEEN $plow AND $phigh;";
      }
    } else if (manufacture != "") {
      if(ptype == '0') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE manufacture = $manufacture;";
      } else {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = $ptype and manufacture = $manufacture;";
      }
    } else if (manufacture == "") {
      if(ptype == '0') {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product;";
      }
      else {
        sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product WHERE ptype = $ptype;";
      }
    } else {
      sql = "SELECT model_no, ptype, name, manufacture, retail_price, stock_qtty FROM Product;";
    }

    const pars = {};
    if (num != 0) {
      pars.$num = num;
    } else if (manufacture != "" && ptype != '0' && plow != '-1' && phigh != '-1') {
      pars.$manufacture = manufacture;
      pars.$ptype = name_ptype;
      pars.$plow = plow;
      pars.$phigh = phigh;
    } else if (manufacture != "" && ptype != '0') {
      pars.$manufacture = manufacture;
      pars.$ptype = name_ptype;
    } else if (manufacture != "" && plow != '-1' && phigh != '-1') {
      pars.$manufacture = manufacture;
      pars.$plow = plow;
      pars.$phigh = phigh;
    } else if (ptype != '0' && plow != '-1' && phigh != '-1') {
      pars.$ptype = name_ptype;
      pars.$plow = plow;
      pars.$phigh = phigh;
    } else if (plow != '-1' && phigh != '-1') {
      pars.$plow = plow;
      pars.$phigh = phigh;
    } else if (manufacture != "") {
      pars.$manufacture = manufacture;
    } else if (ptype != '0') {
      pars.$ptype = name_ptype;
    }

    db.all(sql, pars, (err, rows) => {
      if (err) {
        throw err;
      }
      res.send(JSON.stringify(rows));
    });
  });

// dashboard page
app.get('/dashdata', (req, res) => {
  sql = "SELECT manufacture as x, COUNT(*) AS y FROM Product GROUP BY x ORDER BY y DESC LIMIT 10;";
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(JSON.stringify(rows));
  });
});

// dashboard page
app.get('/lowstock', (req, res) => {
  sql = "SELECT model_no, name, manufacture, quantity, ptype FROM LowStock;";
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(JSON.stringify(rows));
  });
});

// login feature
app.post('/auth/login', (req, res) => {
  const {type, userName, password} = req.body;
  db.all("Select fname, pwd, role FROM Users where user_id=$user", {
    $user: userName
  },
  (err, rows) => {
    if (rows.length == 1) {
      rows.forEach((row) => {
        if(row.pwd == password) {
          return res.status(200).json({msg: 'ok', name: row.fname, role: row.role});
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
  db.run('PRAGMA foreign_keys = OFF;', (err) => {
    if (err) {
      console.error('Error with foreign keys:', err.message);
    } else {
      console.log("pragma off");
    }
  });

  // motherboard
  if(req.body.ptype == 7) {
      values = [];
      sql = `INSERT INTO Motherboard(model_no, socket, ram_slots, storage_slots, has_wifi)
             VALUES ((SELECT MAX(model_no) + 1 FROM Motherboard), ?, ?, ?, ?);`
      values.push(req.body.socket, req.body.RAM_slots, req.body.storage_slots, req.body.has_wifi);
      db.run(sql, values, function (err) {
        if(err) {
          console.error(err.message);
        } else {
          console.log("Success");
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
          console.log(model_no);
          sql = `INSERT INTO Product(model_no, name, manufacture, retail_price, stock_qtty, tdp, ptype)
          VALUES (?, ?, ?, ?, ?, ?, ?);`
          values.push(model_no, req.body.pname, req.body.manufacture, req.body.retail_price, req.body.stock_qtty, req.body.tdp, req.body.ptype);
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
      values = [];
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
      values = [];
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
      values = [];
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
      values = [];
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
      values = [];
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
    values = [];
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
    values = [];
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

// selecting products in inventory by searched model number
app.post('/search', (req, res) => {  
  res.status(200).json({num: req.body.num});
});

// deleting products from the inventory page
app.post('/del', (req, res) => {  
  res.status(200).json();
  db.run('PRAGMA foreign_keys = ON;', (err) => {
    if (err) {
      console.error('Error with foreign keys:', err.message);
    }
  });
  sql = `DELETE FROM Product WHERE model_no = $modelno;`
  db.run(sql, {$modelno: req.body.modelNo}, function (err) {
    if(err) {
      console.error(err.message);
    }
  });
});

// editing products from the inventory page
app.post('/price', (req, res) => {  
  res.status(200).json();
  sql = `UPDATE Product SET retail_price = $retailprice WHERE model_no = $modelno;`
  db.run(sql, {$modelno: req.body.model_no, $retailprice: req.body.retail_price}, function (err) {
    if(err) {
      console.error(err.message);
    }
  });
});

// view detail for all products on the inventory page
app.get('/viewdetail', (req, res) => {  
  const ptype = req.query.ptype;
  const num = req.query.num;
  console.log(num);
  console.log(ptype);
  if (req.query.ptype == 'case') {
    sql = `SELECT model_no, type, psu, side_panel, external_volume, internal_35_bays FROM ProdCase WHERE model_no = $modelno`;
  } else if (ptype == 'cpu_cooler') {
    sql = `SELECT model_no, rpm_low, rpm_high, noise_level, water_cooled FROM CPUCooler WHERE model_no = $modelno`;
  } else if(ptype == 'cpu') {
    sql = `SELECT model_no, core_count, core_clock, boost_clock, graphics, socket FROM CPU WHERE model_no = $modelno`;
  } else if (ptype == 'gpu') {
    sql = `SELECT model_no, chipset, memory_size, memory_type, core_clock, boost_clock FROM GPU WHERE model_no = $modelno`;
  } else if (ptype == 'memory') {
    sql = `SELECT model_no, type, speed, kit_size, size_per_stick, first_word_latency, cas_latency FROM Memory WHERE model_no = $modelno`;
  } else if (ptype == 'mobo') {
    sql = `SELECT model_no, socket, ram_slots, storage_slots, has_wifi FROM Motherboard WHERE model_no = $modelno`;
  } else if (ptype == 'psu') {
    sql = `SELECT model_no, type, efficiency, wattage, modular FROM PSU WHERE model_no = $modelno`;
  } else if (ptype == 'storage') {
    sql = `SELECT model_no, capacity, price_per_gb, type, cache, form_factor, interface FROM Storage WHERE model_no = $modelno`;
  }
  db.all(sql, {$modelno: num}, (err, rows) => {
    if (err) {
      throw err;
    }
    console.log(rows);
    res.send(JSON.stringify(rows));
  });
});

// view order details in the order view tab
app.get('/order', (req, res) => {  
  const ptype = req.query.ptype;
  const num = req.query.num;
  sql = `SELECT order_id,buyer_first,buyer_last,titems,email,address,order_date,status FROM ProductOrder`;
 
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(JSON.stringify(rows));
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});