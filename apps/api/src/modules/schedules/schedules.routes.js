const express = require('express');
const schedulesController = require('./schedules.controller');
const authenticate = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate); // Require authentication for all schedule routes

router.get('/', schedulesController.getAll);
router.post('/', schedulesController.create);
router.patch('/:id', schedulesController.update);
router.delete('/:id', schedulesController.delete);

module.exports = router;
