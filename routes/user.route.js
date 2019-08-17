const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

router.get('/register', controller.register_get);
router.post('/register', controller.set_current_user_is_admin, controller.register_post);

router.get('/login', controller.login_get);
router.post('/login', controller.login_post);
router.get('/logout', controller.logout);

router.get('/', controller.show_all);
router.get('/:id', controller.show_one);

router.post('/:id/set_name', controller.set_current_user_is_admin, controller.set_house_name);
router.post('/:id/set_admin', controller.set_current_user_is_admin, controller.set_admin);
router.post('/:id/set_not_admin', controller.set_current_user_is_admin, controller.set_not_admin);
router.post('/:id/set_moved_out', controller.set_current_user_is_admin, controller.set_moved_out);
router.post('/:id/set_not_moved_out', controller.set_current_user_is_admin, controller.set_not_moved_out);
router.post('/:id/set_password', controller.set_password);



module.exports = router;