import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, KeyRound, Lock } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [step, setStep] = useState("email"); // email | otp | password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
      toast.success("OTP sent to your email");
      setStep("otp");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Enter the 6-digit OTP");
    setStep("password");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords don't match");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, { email, otp, newPassword });
      toast.success("Password reset successfully");
      setStep("done");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>

        {step === "email" && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Forgot Password</h1>
              <p className="text-sm text-slate-500 mt-1">Enter your email and we'll send you an OTP</p>
            </div>
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">Enter OTP</h1>
              <p className="text-sm text-slate-500 mt-1">We sent a 6-digit code to <strong>{email}</strong></p>
            </div>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  placeholder="6-digit OTP"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none tracking-widest text-center text-xl font-bold"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition-colors"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full py-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
              >
                Resend OTP
              </button>
            </form>
          </>
        )}

        {step === "password" && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900">New Password</h1>
              <p className="text-sm text-slate-500 mt-1">Choose a strong new password</p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="New password"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm password"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

        {step === "done" && (
          <div className="text-center py-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Password Reset!</h2>
            <p className="text-sm text-slate-500 mb-6">You can now log in with your new password.</p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
