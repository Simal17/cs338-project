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

//connect to DB
const db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

// create Table
//sql = "CREATE TABLE student(uid DECIMAL(3, 0) NOT NULL PRIMARY KEY, name VARCHAR(30), score DECIMAL(3, 2))";
//db.run(sql);

// insert data
//sql = "INSERT INTO student VALUES(?,?,?)";
//db.run(sql, ["1", "alice", "0.1"], (err) => {
 //   if (err) return console.error(err.message);
//})

// query data
app.get('/data', (req, res) => {
    sql = "SELECT * FROM student";
    db.all(sql, [], (err, rows) => {
        if (err) {
          throw err;
        }
        console.log("Hi");
        res.send(JSON.stringify(rows));
      });
  });