const store = new Map();
const TTL_MS = 5 * 60 * 1000;

function setOtp(phone, otp) {
  store.set(phone, { otp, expiresAt: Date.now() + TTL_MS });
}

function verifyOtp(phone, otp) {
  const entry = store.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    store.delete(phone);
    return false;
  }
  if (entry.otp !== otp) return false;
  store.delete(phone);
  return true;
}

module.exports = { setOtp, verifyOtp };
