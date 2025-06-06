const express = require('express');
const router = express.Router();
const { handleSearch } = require('../controllers/openLibraryController');

router.get('/search', handleSearch);

module.exports = router;
