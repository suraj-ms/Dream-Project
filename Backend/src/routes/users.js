const express = require('express');
const { me } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/me', authenticate, me);

module.exports = router;