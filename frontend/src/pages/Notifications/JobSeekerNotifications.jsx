import { useState, useEffect } from "react";
import {
  Bell,
  CheckCheck,
  ArrowLeft,
  Eye,
  MapPin,
  Clock3,
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
      console.log("Applications Response:", applications);
      console.log("Mapped Notifications:", mappedNotifications);

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

  const statusStyles = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Applied: "bg-blue-50 text-blue-700 border-blue-200",
    "In Review": "bg-violet-50 text-violet-700 border-violet-200",
    Shortlisted: "bg-cyan-50 text-cyan-700 border-cyan-200",
    Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Rejected: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Top */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
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
                Track all your application updates in one place
              </p>
            </div>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
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
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-slate-700" />
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                    All Notifications
                  </h2>
                  <p className="text-xs text-slate-500">
                    Latest updates on your applications
                  </p>
                </div>
              </div>

              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-900 px-2 text-xs font-semibold text-white">
                {notifications.length}
              </span>
            </div>

            <div className="divide-y divide-slate-200">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className="px-5 sm:px-6 py-5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                            statusStyles[item.status] ||
                            "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          {item.status}
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Clock3 className="h-3.5 w-3.5" />
                          {moment(item.createdAt).fromNow()}
                        </span>
                      </div>

                      <p className="text-base font-medium text-slate-900 leading-relaxed">
                        Your application for{" "}
                        <span className="font-semibold">{item.jobTitle}</span> at{" "}
                        <span className="font-semibold">{item.companyName}</span>{" "}
                        was updated to{" "}
                        <span className="font-semibold lowercase">
                          {item.status}
                        </span>
                        .
                      </p>

                      <div className="flex items-center gap-1 text-sm text-slate-500 mt-2">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleViewJob(item.jobId)}
                        className="px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Job
                      </button>

                      <button
                        onClick={() => handleDismiss(item.id)}
                        className="px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerNotifications;