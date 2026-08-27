const express = require('express');
const router = express.Router();
const { login, register, verifyEmail, forgotPassword, resetPassword } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;