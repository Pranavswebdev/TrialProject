const router = require('express').Router();
const { sendOtp, verifyOtpHandler } = require('../controllers/auth.controller');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtpHandler);

module.exports = router;
