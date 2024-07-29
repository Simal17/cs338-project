function inputData() {
  
    const sqlite3 = require('sqlite3').verbose();
    let sql;  
    let counter = 0;
    const db = new sqlite3.Database('./prod.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) return console.error(err.message);
    });
    
    // read CSV files of data
    const fs = require('fs');
    const { parse } = require('csv-parse');
    const { serialize } = require('v8');
    const { kMaxLength } = require('buffer');
    
    const importCSV = (CSVfile, insertionquery) => {
      fs.createReadStream(CSVfile)
      .pipe(parse({ delimiter: ",", from_line: 2}))
      .on("data", function(row) {
        db.serialize(function() {
          db.run(
            insertionquery,
            [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7]],
            function(error) {
              if(error) { return console.log(error.message);}
            }
          );
        });
      })
    
    .on("end", function(){
       console.log("finished");
     })
     .on("error", function(error){
       console.log(error.message);
     });
     counter = counter + 1;
     console.log(counter);
    }
    
    // USER TABLE
    sql = "CREATE TABLE User(fname VARCHAR(30) NOT NULL, lname VARCHAR(30) NOT NULL, user_id INT NOT NULL PRIMARY KEY, pwd VARCHAR(30) NOT NULL)";
    db.run(sql);
    importCSV("./production-data/user.csv", "INSERT INTO User VALUES (?,?,?,?)");
    
    // PRODUCT TABLE
    sql = "CREATE TABLE Product(model_no INT NOT NULL PRIMARY KEY, name VARCHAR(30) NOT NULL, manufacture VARCHAR(30) NOT NULL, retail_price DECIMAL(10, 2) NOT NULL, stock_qtty INT, tdp INT, color varchar(50), ProdType VARCHAR(50))";
    db.run(sql);
    importCSV("./production-data/Product.csv", "INSERT INTO Product VALUES (?,?,?,?,?,?,?,?)");
    
    // ORDER TABLE
    sql = "CREATE TABLE Orders(order_id INT NOT NULL, buyer_first VARCHAR(30) NOT NULL, buyer_last VARCHAR(30) NOT NULL, items INT NOT NULL, email VARCHAR(30) NOT NULL, address VARCHAR(30) NOT NULL, order_date DATE NOT NULL, status INT, CONSTRAINT pk_item PRIMARY KEY (order_id, items), CONSTRAINT fk_item FOREIGN KEY (items) REFERENCES Product(model_no) ON DELETE CASCADE ON UPDATE CASCADE)";
    db.run(sql);
    importCSV("./production-data/order.csv", "INSERT INTO Orders VALUES (?,?,?,?,?,?,?,?)");
    
    // CPU TABLE
    sql = "CREATE TABLE CPU(model_no INT NOT NULL PRIMARY KEY, core_count INT NOT NULL, core_clock DECIMAL(10, 2) NOT NULL, boost_clock DECIMAL(10, 2) NOT NULL, graphics VARCHAR(30), socket VARCHAR(30), CONSTRAINT fk_cpu FOREIGN KEY (model_no) REFERENCES Product(model_no) ON DELETE CASCADE ON UPDATE CASCADE)";
    db.run(sql);
    importCSV("./production-data/CPU.csv", "INSERT INTO CPU VALUES (?,?,?,?,?,?)");
    
    // CPU COOLER TABLE
    sql = "CREATE TABLE CPUCooler(model_no INT NOT NULL PRIMARY KEY, rpm_low INT NOT NULL, rpm_high INT NOT NULL, noise_level DECIMAL(10, 2) NOT NULL, water_cooled BOOLEAN, CONSTRAINT fk_cpucooler FOREIGN KEY (model_no) REFERENCES Product(model_no) ON DELETE CASCADE ON UPDATE CASCADE)";
    db.run(sql);
    importCSV("./production-data/CPUCOOLER.csv", "INSERT INTO CPUCooler VALUES (?,?,?,?,?)");
    
    // MOTHERBOARD TABLE
    sql = "CREATE TABLE Motherboard(model_no INT NOT NULL PRIMARY KEY, socket varchar(30), ram_slots INT NOT NULL, storage_slots INT, has_wifi BOOLEAN, CONSTRAINT fk_mb FOREIGN KEY (model_no) REFERENCES Product(model_no) ON DELETE CASCADE ON UPDATE CASCADE)";
    db.run(sql);
    importCSV("./production-data/MOBO.csv", "INSERT INTO Motherboard VALUES (?,?,?,?,?)");
    
    // MEMORY TABLE
    sql = "CREATE TABLE Memory(model_no INT NOT NULL PRIMARY KEY, type varchar(30), speed INT NOT NULL, kit_size INT NOT NULL, size_per_stick INT NOT NULL, first_word_latency DECIMAL(10,4) NOT NULL, cas_latency INT NOT NULL, CONSTRAINT fk_me FOREIGN KEY (model_no) REFERENCES Product(model_no) ON DELETE CASCADE ON UPDATE CASCADE)";
    db.run(sql);
    importCSV("./production-data/MEMORY.csv", "INSERT INTO Memory VALUES (?,?,?,?,?,?,?)");
    
    // CASE TABLE
    sql = "CREATE TABLE ProdCase(model_no INT NOT NULL PRIMARY KEY, type varchar(30), psu varchar(50) NOT NULL, side_panel varchar(50) NOT NULL, external_volume DECIMAL(10,4) NOT NULL, internal_35_bays INT NOT NULL, CONSTRAINT fk_case FOREIGN KEY (model_no) REFERENCES Product(model_no) ON DELETE CASCADE ON UPDATE CASCADE)";
    db.run(sql);
    importCSV("./production-data/Case.csv", "INSERT INTO ProdCase VALUES (?,?,?,?,?,?)");
    
    // PSU TABLE
    sql = "CREATE TABLE PSU(model_no INT NOT NULL PRIMARY KEY, type varchar(30), efficiency varchar(50) NOT NULL, wattage INT NOT NULL, modular varchar(50) NOT NULL, CONSTRAINT fk_psu FOREIGN KEY (model_no) REFERENCES Product(model_no) ON DELETE CASCADE ON UPDATE CASCADE)";
    db.run(sql);
    importCSV("./production-data/PSU.csv", "INSERT INTO PSU VALUES (?,?,?,?,?)");
    
    // GPU TABLE
    sql = "CREATE TABLE GPU(model_no INT NOT NULL PRIMARY KEY, chipset varchar(50) NOT NULL, memory_size varchar(30) NOT NULL, memory_type varchar(30), core_clock varchar(30) NOT NULL, boost_clock varchar(30) NOT NULL, CONSTRAINT fk_gpu FOREIGN KEY (model_no) REFERENCES Product(model_no) ON DELETE CASCADE ON UPDATE CASCADE)";
    db.run(sql);
    importCSV("./production-data/GPU.csv", "INSERT INTO GPU VALUES (?,?,?,?,?,?)");
    
    // STORAGE TABLE
    sql = "CREATE TABLE Storage(model_no INT NOT NULL PRIMARY KEY, capacity INT NOT NULL, price_per_gb DECIMAL(10,4) NOT NULL, type varchar(30) NOT NULL, cache INT NOT NULL, form_factor varchar(30) NOT NULL, interface varchar(50) NOT NULL, CONSTRAINT fk_stg FOREIGN KEY (model_no) REFERENCES Product(model_no) ON DELETE CASCADE ON UPDATE CASCADE)";
    db.run(sql);
    importCSV("./production-data/STORAGE.csv", "INSERT INTO Storage VALUES (?,?,?,?,?,?,?)");


    }
    
    module.exports = {inputData};