import { useState, useEffect } from "react";
import {
    Briefcase,
    Bookmark,
    Bell
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const Navbar = () => {

    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [savedCount, setSavedCount] = useState(0);
    const [notifCount, setNotifCount] = useState(0);

    useEffect(() => {
        if (!user) return;
        axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS)
            .then(res => setSavedCount(res.data?.length || 0))
            .catch(() => {});
        axiosInstance.get(API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS)
            .then(res => setNotifCount(res.data?.length || 0))
            .catch(() => {});
    }, [user]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (profileDropdownOpen) {
                setProfileDropdownOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);

    }, [profileDropdownOpen]);

    return <header className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
                {/* logo */}
                <Link to='/find-jobs' className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
                        <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <span className="text-slate-900 font-bold text-xl block">
                            JobAxis
                        </span>
                        <span className="text-xs text-slate-500">
                            Jobseeker Workspace
                        </span>
                    </div>
                </Link>

                {/* auth buttons */}
                <div className="flex items-center space-x-5">
                    {user && (
                        <button
                            className="relative p-1 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                            onClick={() => navigate("/saved-jobs")}
                        >
                            <Bookmark className="h-5 w-5 text-gray-700" />
                            {savedCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                                    {savedCount}
                                </span>
                            )}
                        </button>
                    )}
                    <button
                        onClick={() => navigate("/notifications")}
                        className="relative p-1 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                    >
                        <Bell className="h-5 w-5 text-gray-700" />
                        {notifCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                                {notifCount}
                            </span>
                        )}
                    </button>

                    {isAuthenticated ? (
                        <ProfileDropdown
                            isOpen={profileDropdownOpen}
                            onToggle={(e) => {
                                e.stopPropagation();
                                setProfileDropdownOpen(!profileDropdownOpen);
                            }}
                            avatar={user?.avatar || ""}
                            companyName={user?.name || ""}
                            email={user?.email || ""}
                            userRole={user.role || ""}
                            onLogout={logout}
                        />
                    ) : (
                        <>
                            <a
                                href="/login"
                                className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-50"
                            >
                                Login
                            </a>
                            <a
                                href="/signup"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                Sign Up
                            </a>
                        </>
                    )}
                </div>
            </div>
        </div>
    </header>
}

export default Navbar