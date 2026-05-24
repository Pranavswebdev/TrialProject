const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { setOtp, verifyOtp } = require('../utils/otpStore');

const PHONE_RE = /^[6-9]\d{9}$/;

async function sendOtp(req, res) {
  const { phone } = req.body;
  if (!phone || !PHONE_RE.test(phone)) {
    return res.status(400).json({ message: 'Invalid Indian phone number' });
  }
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  setOtp(phone, otp);
  console.log(`[OTP] ${phone} → ${otp}`);
  return res.json({ message: 'OTP sent' });
}

async function verifyOtpHandler(req, res) {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ message: 'phone and otp are required' });
  }
  const valid = verifyOtp(phone, otp);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid or expired OTP' });
  }
  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, user: { _id: user._id, phone: user.phone, name: user.name, defaultAddress: user.defaultAddress } });
}

module.exports = { sendOtp, verifyOtpHandler };
