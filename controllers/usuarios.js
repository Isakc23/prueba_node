const usuariosStore = require('../store/usuarios');

const getAll = async (_req, res) => {
    try {
        const users = await usuariosStore.getAll();
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
};

const getById = async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        res.status(400).json({ message: 'Identificador inválido' });
        return;
    }

    try {
        const user = await usuariosStore.getById(id);
        if (!user) {
            res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error(`Error al obtener usuario ${id}:`, error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

module.exports = {
    getAll,
    getById
};
