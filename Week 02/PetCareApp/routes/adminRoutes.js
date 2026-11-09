const express = require('express');
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', isAdmin, adminController.showDashboard);
router.get('/users', isAdmin, adminController.listUsers);
router.get('/users/:id', isAdmin, adminController.showUserDetails);
router.get('/users/delete/:id', isAdmin, adminController.deleteUser);

module.exports = router;
