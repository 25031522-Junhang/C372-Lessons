const express = require('express');
const upload = require('../config/upload');
const petController = require('../controllers/petController');
const { isLoggedIn } = require('../middleware/auth');

const router = express.Router();

router.get('/new', isLoggedIn, petController.showNewPet);
router.post('/', upload.single('pet_image'), isLoggedIn, petController.createPet);

module.exports = router;
