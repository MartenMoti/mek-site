const express = require('express');
const router = express.Router();
const controller = require('../controllers/correction.controller');
const investment_controller = require('../controllers/investment.controller');
const index_controller = require('../controllers/index.controller');
const user_controller = require('../controllers/user.controller');


router.post('/', controller.create_correction);

router.get('/', investment_controller.set_names, controller.show_all);
router.get('/:id', index_controller.get_roommates,
    investment_controller.set_names,
    controller.show_one
);
router.post('/:id/update', user_controller.set_current_user_is_admin, controller.update);
router.post('/:id/delete', controller.set_correction, user_controller.set_current_user_is_admin, controller.delete);

module.exports = router;
