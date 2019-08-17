const express = require ('express');
const router = express.Router();
const controller = require('../controllers/investment.controller');
const userController = require('../controllers/user.controller');
const passport = require('passport');

router.post('/', userController.set_active_housemates, controller.create_investment);
router.get('/', controller.set_names, controller.show_all);

router.get('/:id', controller.set_investment, controller.show_single);
router.post('/:id/update', userController.set_current_user_is_admin ,controller.update_investment);
router.post('/:id/delete', userController.set_current_user_is_admin, controller.set_investment, controller.delete_investment);

router.put('/:id', userController.set_current_user_is_admin, controller.set_investment, controller.update_investment);
router.delete('/:id', userController.set_current_user_is_admin, controller.set_investment, controller.delete_investment);
module.exports = router;