const express = require('express');
const router = express.Router();
const controller = require('../controllers/correction.controller');
const investment_controller = require('../controllers/investment.controller');


router.post('/', controller.create_correction);

router.get('/', investment_controller.set_names, controller.show_all);

module.exports = router;