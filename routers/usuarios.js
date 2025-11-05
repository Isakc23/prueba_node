const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios');

router.get('/', usuariosController.getAll);
router.get('/:id(\\d+)', usuariosController.getById);

module.exports = router;