const { inputData } = require('./input');

const express = require('express');
var cors = require('cors');
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const sqlite3 = require('sqlite3').verbose();
let sql; // used to define sql statements

//connection to DB
const db = new sqlite3.Database('./sampletest.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

// inputting data into the DB
//inputData();

app.use(cors({
  origin: 'http://localhost:4200',  // Allow only your Angular app to access
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// login feature
app.post('/auth/login', (req, res) => {
  const {type, userName, password} = req.body;
  db.all("Select pwd FROM User where user_id=$user", {
    $user: userName
  },
  (err, rows) => {
    if (rows.length == 1) {
      rows.forEach((row) => {
        console.log(row.pwd)
        if(row.pwd == password) {
          return res.status(200).json({msg: 'ok'});
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

// query data
// app.get('/data', (req, res) => {
//     sql = "SELECT * FROM User;";
//     db.all(sql, [], (err, rows) => {
//         if (err) {
//           throw err;
//         }
//         res.send(JSON.stringify(rows));
//       });
//   });


const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});