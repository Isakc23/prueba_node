const Usuario = require('../models/usuario');
const usuariosStore = require('../store/usuarios');

const usuarios = [
    new Usuario(1, 'erik'),
    new Usuario(2, 'frida'),
    new Usuario(3, 'david')
];

const getAll = async (_req,res) => {
    const users = await usuariosStore.getAll();
    res.json(users);
};

const getById = (req,res) => {
    const id = req.params.id;
    const user = usuarios.find(u => u.id == id);
    if (!user) {
        res.status(404).json({status:404});
        return;
    }
    res.json(user);
};

module.exports = {
    getAll,
    getById
};