const express = require('express');
const router = express.Router();
const controller = require('../controllers/index.controller');
const investmentController = require('../controllers/investment.controller');

router.get('/', controller.handle_index);
router.get('/dashboard', 
    controller.get_user, 
    controller.get_roommates, 
    controller.set_investments,
    investmentController.set_names,
    controller.handle_dashboard
);

module.exports = router;