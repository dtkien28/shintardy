const express = require('express');
const todosController = require('./todos.controller');
const authenticate = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate); // Require authentication for all todo routes

router.get('/', todosController.getAll);
router.post('/', todosController.create);
router.patch('/:id', todosController.update);
router.delete('/:id', todosController.delete);

module.exports = router;
