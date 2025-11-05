const Usuario = require('../models/usuario');
const mysqlManager = require('./_mysql');

const getAll = async function() {
    const db = await mysqlManager.connect();
    const [result, columns] = await db.query("SELECT * FROM usuarios");
    const usuarios = [];
    result.forEach(row => usuarios.push(new Usuario(row.id, row.username)));
    return usuarios;
}

module.exports = {
    getAll
};