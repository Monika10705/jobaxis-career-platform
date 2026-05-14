import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import defaultAvatar from "../../assets/default-avatar.webp"

const ProfileDropdown = ({
    isOpen,
    onToggle,
    avatar,
    companyName,
    email,
    onLogout,
    userRole
}) => {
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    return (
        <>
            <div className="relative">
                <button
                    onClick={onToggle}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                    {avatar ? (
                        <img src={avatar} alt="Avatar" className="h-9 w-9 object-cover rounded-xl" />
                    ) : (
                        <img src={defaultAvatar} alt="Avatar" className="h-9 w-9 object-cover rounded-xl" />
                    )}
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-900">{companyName}</p>
                        <p className="text-xs text-gray-500">
                            {userRole === "jobseeker" ? "Job Seeker" : "Employer"}
                        </p>
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -8 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                        >
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900">{companyName}</p>
                                <p className="text-xs text-gray-500">{email}</p>
                            </div>
                            <a
                                onClick={() => navigate(userRole === 'jobseeker' ? '/profile' : '/company-profile')}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                View Profile
                            </a>
                            <div className="border-t border-gray-100 mt-2 pt-2">
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); setShowLogoutConfirm(true); }}
                                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Sign out
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {createPortal(
                <AnimatePresence>
                    {showLogoutConfirm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.85, y: 20 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-sm mx-4"
                            >
                                <h3 className="text-lg font-semibold text-slate-900 mb-1">Sign out?</h3>
                                <p className="text-sm text-slate-500 mb-6">Are you sure you want to sign out of your account?</p>
                                <div className="flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowLogoutConfirm(false)}
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => { setShowLogoutConfirm(false); onLogout(); }}
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                                    >
                                        Sign out
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}

export default ProfileDropdown
