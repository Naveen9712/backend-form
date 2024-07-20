const db = require('../config/db');

const User = {
    create: (userData, callback) => {
        const sql = 'INSERT INTO users SET ?';
        db.query(sql, userData, callback);
    }
};

module.exports = User;
