const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// Read file
const sql = fs.readFileSync('./sample_sql_queries/test-sample.sql', 'utf8');

// Empty file of previous content in test-sample.out
fs.writeFileSync('./sample_sql_queries/test-sample.out', '');

// Connect db
const db = new sqlite3.Database('./sampletest.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
});

function testSample(sql, output) {
    const queries = sql.split(';').map(q=> q.trim()).filter(q => q.length > 0);

    db.serialize(() => {
        queries.forEach((query) => {
            if (query.toUpperCase().startsWith('SELECT')) {
                db.all(query, [], (err, rows) => {
                    if(err) {
                        console.error(err.message);
                        fs.appendFileSync(output, `Error: ${err.message}\n`);
                    } else {
                        fs.appendFileSync(output, JSON.stringify(rows, null, 2) + '\n');
                    }
                });
            } else {
                db.run(query, [], function (err) {
                    if(err) {
                        console.error(err.message);
                        fs.appendFileSync(output, `Error: ${err.message}\n`);
                    } else {
                        fs.appendFileSync(output, `Query executed successfully.\n`);
                    }
                });
            }
        });
    });

    db.close(console.log("Database connection closed!"));
}

testSample(sql, './sample_sql_queries/test-sample.out');