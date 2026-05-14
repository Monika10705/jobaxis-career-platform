import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EmployerNotifications from "./EmployerNotifications";
import JobSeekerNotifications from "./JobSeekerNotifications";
import Navbar from "../../components/layout/Navbar";
import { useEffect } from "react";

const NotificationsPage = () => {
  const { user } = useAuth();

  // Mark notifications as seen when page is visited
  useEffect(() => {
    localStorage.setItem(`lastNotifSeen_${user?._id}`, new Date().toISOString());
  }, [user]);

  if (user?.role === "employer") {
    return (
      <DashboardLayout activeMenu="notifications">
        <EmployerNotifications />
      </DashboardLayout>
    );
  }

  else {
    return (
      <div className="bg-slate-50 min-h-screen">
        <Navbar />
        <div className="pt-16">
          <JobSeekerNotifications />
        </div>
      </div>
    );
  }
};

export default NotificationsPage;