const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12719870',
    password: 'RrzFqyXBGu',
    database: 'sql12719870'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

module.exports = db;
