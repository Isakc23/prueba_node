const mysql2 = require('mysql2/promise');

const connect = () => {
    return mysql2.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DATABASE
    });
};


module.exports = {
    connect
};