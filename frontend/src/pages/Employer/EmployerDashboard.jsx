import { useEffect, useState } from "react";
import {
  Plus,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  CheckCircle2,
  Subtitles,
  ArrowRight
} from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout"
import LoadingSpinner from "../../components/LoadingSpinner"
import { title } from "framer-motion/client";
import JobDashboardCard from "../../components/Cards/JobDashboardCard";
import ApplicantDashboardCard from "../../components/Cards/ApplicantDashboardCard"

const Card = ({ title, headerAction, subtitle, className, children }) => {
  return <div
    className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
  >
    {(title || headerAction) && (
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray- -500 mt-1">{subtitle}</p>
          )}
        </div>
        {headerAction}
      </div>
    )}
    <div className={title ? "px-6 pb-6 " : "p-6"}>{children}</div>
  </div>
}
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-violet-500 to-violet-600",
    orange: "from-orange-500 to-orange-600"
  };

  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} text-white border-0`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className="bg-white/10 p-3 rounded-xl">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  )
}

const EmployerDashboard = () => {

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getDashboardOverview = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDashboardOverview();
    return () => { };
  }, []);
  return (
    <DashboardLayout activeMenu='employer-dashboard'>
      {isLoading ? (
        <LoadingSpinner />
      ) : (<div className="max-w-7xl mx-auto space-y-8">

        {/* dashboard stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title='Active Jobs'
            value={dashboardData?.counts?.totalActiveJobs || 0}
            icon={Briefcase}
            trend={true}
            trendValue={`${dashboardData?.counts?.trends?.activeJobs || 0}%`}
            color='blue'
          />

          <StatCard
            title='Total Applicants'
            value={dashboardData?.counts?.totalApplications || 0}
            icon={Users}
            trend={true}
            trendValue={`${dashboardData?.counts?.trends?.totalApplicants || 0
              }%`}
            color="green"
          />

          <StatCard
            title='Hired'
            value={dashboardData?.counts?.totalHired || 0}
            icon={CheckCircle2}
            trend={true}
            trendValue={`${dashboardData?.counts?.trends?.totalHired || 0}%`}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        {/* Quick Actions */}
        <Card
          title="Quick Actions"
          subtitle="Common tasks to get you started"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                title: "Post New Job",
                desc: "Create a listing and reach top candidates",
                icon: Plus,
                iconColor: "#7C3AED",
                iconBg: "#EDE9FE",
                dotColor: "#7C3AED",
                path: "/post-job",
              },
              {
                title: "Review Applications",
                desc: "Shortlist and manage incoming candidates",
                icon: Users,
                iconColor: "#059669",
                iconBg: "#D1FAE5",
                dotColor: "#059669",
                path: "/manage-jobs",
              },
              {
                title: "Company Settings",
                desc: "Update your profile and preferences",
                icon: Building2,
                iconColor: "#D97706",
                iconBg: "#FEF3C7",
                dotColor: "#D97706",
                path: "/company-profile",
              },
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="group relative flex flex-col gap-4 p-5 rounded-[14px] border border-gray-100 bg-gray-50 hover:bg-white hover:border-violet-200 hover:shadow-[0_4px_16px_rgba(124,58,237,0.08)] hover:-translate-y-0.5 transition-all duration-200 text-left cursor-pointer overflow-hidden"
              >
                {/* color dot accent */}
                <span
                  className="absolute top-3.5 right-3.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: action.dotColor }}
                />

                {/* icon row + arrow */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: action.iconBg }}
                  >
                    <action.icon
                      className="h-5 w-5"
                      style={{ color: action.iconColor }}
                    />
                  </div>
                  <ArrowRight
                    className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    style={{ color: action.iconColor }}
                  />
                </div>

                {/* text */}
                <div>
                  <p className="text-sm font-bold text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
        {/* recent activity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <Card
            title="Recent Job Posts"
            subtitle="Your latest job postings"
            headerAction={
              <button
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => navigate("/manage-jobs")}
              >
                View all
              </button>
            }
          >
            <div className="space-y-3">
              {dashboardData?.data?.recentJobs
                ?.slice(0, 3)
                ?.map((job, index) => (
                  <JobDashboardCard key={index} job={job} />
                ))
              }
            </div>
          </Card>

          <Card
            title="Recent Applications"
            subtitle="Latest candidate applications"
            headerAction={
              <button
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => navigate("/manage-jobs")}
              >
                View all
              </button>
            }
          >
            <div className="space-y-3">
              {dashboardData?.data?.recentApplications
                ?.slice(0, 3)
                ?.map((data, index) => (
                  <ApplicantDashboardCard
                    key={index}
                    applicant={data?.applicant || ""}
                    position={data?.job?.title || ""}
                    time={moment(data?.createdAt).format("DD MMM YYYY • hh:mm A")}
                  />
                ))}
            </div>
          </Card>
        </div>


      </div>
      )}
    </DashboardLayout>
  )
}

export default EmployerDashboard;