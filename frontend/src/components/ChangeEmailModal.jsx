import { useState } from "react";
import { X, Mail, KeyRound, CheckCircle } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ChangeEmailModal = ({ onClose }) => {
  const { updateUser } = useAuth();
  const [step, setStep] = useState("email"); // email | otp | done
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.AUTH.REQUEST_EMAIL_CHANGE, { newEmail });
      toast.success("OTP sent to your new email");
      setStep("otp");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.CONFIRM_EMAIL_CHANGE, { otp });
      updateUser({ email: res.data.email });
      toast.success("Email updated successfully");
      setStep("done");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="h-4 w-4 text-slate-500" />
        </button>

        {step === "email" && (
          <>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Change Email</h2>
            <p className="text-sm text-slate-500 mb-6">Enter your new email address. We'll send an OTP to confirm.</p>
            <form onSubmit={handleRequestChange} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  placeholder="new@email.com"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <h2 className="text-xl font-bold text-slate-900 mb-1">Verify New Email</h2>
            <p className="text-sm text-slate-500 mb-6">Enter the 6-digit OTP sent to <strong>{newEmail}</strong></p>
            <form onSubmit={handleConfirmChange} className="space-y-4">
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
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Verifying..." : "Confirm Change"}
              </button>
              <button
                type="button"
                onClick={handleRequestChange}
                disabled={loading}
                className="w-full py-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
              >
                Resend OTP
              </button>
            </form>
          </>
        )}

        {step === "done" && (
          <div className="text-center py-4">
            <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Email Updated!</h2>
            <p className="text-sm text-slate-500 mb-6">Your email address has been changed successfully.</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeEmailModal;
