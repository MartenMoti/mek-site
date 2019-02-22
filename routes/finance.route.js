const express = require('express');
const router = express.Router();
const finance_controller = require('../controllers/finance.controller');

router.get('/',
    finance_controller.set_all_corrections,
    finance_controller.set_all_investment,
    finance_controller.set_all_housemates,
    finance_controller.set_financial_information,
    finance_controller.show_all
);

module.exports = router;