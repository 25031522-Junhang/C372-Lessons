const express = require('express');
const journalController = require('../controllers/journalController');
const { isLoggedIn } = require('../middleware/auth');

const router = express.Router();

router.get('/', isLoggedIn, journalController.listJournals);
router.get('/new', isLoggedIn, journalController.showNewJournal);
router.post('/new', isLoggedIn, journalController.createJournal);
router.get('/edit/:id', isLoggedIn, journalController.showEditJournal);
router.post('/edit/:id', isLoggedIn, journalController.editJournal);
router.get('/delete/:id', isLoggedIn, journalController.deleteJournal);
router.get('/search', isLoggedIn, journalController.searchJournals);

module.exports = router;
