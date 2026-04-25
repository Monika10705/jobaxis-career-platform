import { useMemo, useState, useEffect } from "react";
import {
    Bell,
    CheckCheck,
    ArrowLeft,
    Briefcase,
    CheckCircle2,
    XCircle,
    Archive,
    Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";

const JobSeekerNotifications = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();

    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);

            const response = await axiosInstance.get(
                API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS
            );
             const applications = response.data || [];

            const mappedNotifications = applications
                .map((app) => ({
                    id: app._id,
                    jobId: app?.job?._id,
                    jobTitle: app?.job?.title || "Untitled Job",
                    companyName: app?.job?.company?.name || "Unknown Company",
                    location: app?.job?.location || "Unknown Location",
                    status: app?.status || "Pending",
                    createdAt: app?.createdAt,
                }))
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setNotifications(mappedNotifications);
        } catch (error) {
            console.error("Failed to fetch jobseeker notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const groupedNotifications = useMemo(() => {
        const lastSeen = user?.lastNotificationSeen
            ? new Date(user.lastNotificationSeen)
            : null;

        return {
            newUpdates: notifications.filter(
                (item) =>
                    (!lastSeen || new Date(item.createdAt) > lastSeen) &&
                    item.status !== "Accepted" &&
                    item.status !== "Rejected"
            ),
            accepted: notifications.filter((item) => item.status === "Accepted"),
            rejected: notifications.filter((item) => item.status === "Rejected"),
            older: notifications.filter(
                (item) =>
                    lastSeen &&
                    new Date(item.createdAt) <= lastSeen &&
                    item.status !== "Accepted" &&
                    item.status !== "Rejected"
            ),
        };
    }, [notifications, user]);

    const handleMarkAllRead = () => {
        updateUser({
            ...user,
            lastNotificationSeen: new Date().toISOString(),
        });
    };

    const handleViewJob = (jobId) => {
        navigate(`/job/${jobId}`);
    };

    const handleDismiss = (id) => {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
    };

    const Section = ({ title, items, icon: Icon }) => {
        if (!items.length) return null;

        return (
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-slate-700" />
                    </div>

                    <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                            {title}
                        </h2>
                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-900 px-2 text-xs font-semibold text-white">
                            {items.length}
                        </span>
                    </div>
                </div>

                <div>
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className={`px-5 sm:px-6 py-5 ${index !== items.length - 1 ? "border-b border-slate-200" : ""
                                }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                                <div className="min-w-0">
                                    <p className="text-base font-medium text-slate-900 leading-relaxed">
                                        Your application for{" "}
                                        <span className="font-semibold">{item.jobTitle}</span> at{" "}
                                        <span className="font-semibold">{item.companyName}</span>
                                    </p>

                                    <p className="text-sm text-slate-500 mt-1">{item.location}</p>

                                    <p className="text-sm text-slate-500 mt-1">
                                        {moment(item.createdAt).fromNow()}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <button
                                        onClick={() => handleViewJob(item.jobId)}
                                        className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        View Job
                                    </button>

                                    <button
                                        onClick={() => handleDismiss(item.id)}
                                        className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Top */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="h-11 w-11 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>

                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                Notifications
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Track your application updates
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleMarkAllRead}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                    >
                        <CheckCheck className="h-4 w-4" />
                        Mark all as read
                    </button>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center shadow-sm">
                        <Bell className="h-12 w-12 text-slate-300 mx-auto animate-pulse" />
                        <p className="text-slate-500 mt-4">Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center shadow-sm">
                        <Bell className="h-14 w-14 text-slate-300 mx-auto" />
                        <h3 className="mt-4 text-lg font-semibold text-slate-900">
                            No notifications
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            You're all caught up.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <Section title="New Updates" items={groupedNotifications.newUpdates} icon={Bell} />
                        <Section title="Accepted" items={groupedNotifications.accepted} icon={CheckCircle2} />
                        <Section title="Rejected" items={groupedNotifications.rejected} icon={XCircle} />
                        <Section title="Older Updates" items={groupedNotifications.older} icon={Archive} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobSeekerNotifications;