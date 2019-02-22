const express = require('express');
const router = express.Router();
const controller = require('../controllers/index.controller');
const investmentController = require('../controllers/investment.controller');
const finance_controller = require('../controllers/finance.controller');

router.get('/', controller.handle_index);
router.get('/dashboard', 
    controller.get_user, 
    controller.get_roommates, 
    controller.set_investments,
    investmentController.set_names,
    controller.set_corrections,

    finance_controller.set_all_corrections,
    finance_controller.set_all_investment,
    finance_controller.set_all_housemates,
    finance_controller.set_financial_information,

    controller.handle_dashboard
);

module.exports = router;