import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp, sendOtp } from '../services/authService';
import useAuthStore from '../stores/authStore';
import OTPInput from '../components/OTPInput';

export default function OTPVerify() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    if (!phone) {
      navigate('/login');
      return;
    }

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phone, navigate]);

  const handleOtpComplete = async (otp) => {
    setLoading(true);
    setError('');

    try {
      const response = await verifyOtp(phone, otp);
      login(response.token, response.user);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');

    try {
      await sendOtp(phone);
      setCanResend(false);
      setResendTimer(30);
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-app-bg">
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
            <p className="text-gray-600 mt-2">
              Enter the 6-digit code sent to {phone}
            </p>
          </div>

          <div className="mb-8">
            <OTPInput onComplete={handleOtpComplete} />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-indigo-500 hover:text-indigo-600 font-medium text-sm"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-600 text-sm">
                Resend OTP in <span className="font-bold">{resendTimer}s</span>
              </p>
            )}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
