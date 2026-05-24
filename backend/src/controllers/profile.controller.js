const User = require('../models/User');

async function getProfile(req, res) {
  const user = await User.findById(req.userId).select('name phone defaultAddress').lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
}

async function updateProfile(req, res) {
  const { name, defaultAddress } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userId,
    { name, defaultAddress },
    { new: true, runValidators: true }
  ).select('name phone defaultAddress');
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
}

module.exports = { getProfile, updateProfile };
