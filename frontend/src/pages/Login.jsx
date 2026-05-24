import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp } from '../services/authService';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePhone = (value) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(value);
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit Indian phone number');
      return;
    }

    setLoading(true);
    try {
      await sendOtp(`+91${phone}`);
      navigate('/otp', { state: { phone: `+91${phone}` } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-app-bg">
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🍽️</div>
            <h1 className="text-3xl font-bold text-gray-900">FoodRush</h1>
            <p className="text-gray-600 mt-2">Order food, delivered fast</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-3">
                <span className="text-gray-600 font-medium">+91</span>
                <input
                  type="text"
                  value={phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit number"
                  className="flex-1 ml-2 outline-none text-lg"
                  maxLength="10"
                  disabled={loading}
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? 'Sending OTP...' : 'Get OTP'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            We'll send a 6-digit code to verify your phone
          </p>
        </div>
      </div>
    </div>
  );
}
