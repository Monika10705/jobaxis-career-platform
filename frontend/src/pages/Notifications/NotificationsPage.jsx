import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EmployerNotifications from "./EmployerNotifications";
import JobSeekerNotifications from "./JobSeekerNotifications";
import Navbar from "../../components/layout/Navbar";

const NotificationsPage = () => {
  const { user } = useAuth();

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