const express = require('express');
const router = express.Router();
const controller = require('../controllers/investment.controller');
const passport = require('passport');

router.post('/', controller.create_investment);
router.get('/', controller.set_names, controller.show_all);

router.get('/:id', controller.set_investment, controller.show_single);
router.post('/:id/update', controller.update_investment);
router.post('/:id/delete', controller.delete_investment);

module.exports = router;