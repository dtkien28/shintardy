const express = require('express');
const studyController = require('./study.controller');
const authenticate = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate); // Require authentication for all study routes

router.get('/', studyController.getAll);
router.post('/', studyController.create);

module.exports = router;
