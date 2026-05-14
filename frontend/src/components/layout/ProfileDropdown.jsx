import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { createPortal } from "react-dom"
import { useNavigate } from "react-router-dom"

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
                        <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                                {companyName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-900">{companyName}</p>
                        <p className="text-xs text-gray-500">
                            {userRole === "jobseeker" ? "Job Seeker" : "Employer"}
                        </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
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
                    </div>
                )}
            </div>

            {showLogoutConfirm && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-sm mx-4">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Sign out?</h3>
                        <p className="text-sm text-slate-500 mb-6">Are you sure you want to sign out of your account?</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { setShowLogoutConfirm(false); onLogout(); }}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default ProfileDropdown
