import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Users,
  Calendar,
  MapPin,
  Briefcase,
  Download,
  Eye,
  ArrowLeft,
  BriefcaseBusiness,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { getInitials } from "../../utils/helper";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import ApplicantProfilePreview from "../../components/Cards/ApplicantProfilePreview";

const ApplicationViewer = () => {
  const location = useLocation();
  const jobId = location.state?.jobId || null;
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId)
      );
      setApplications(response.data);
    } catch (err) {
      console.log("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchApplications();
    else navigate("/manage-jobs");
  }, []);

  const groupedApplications = useMemo(() => {
    const filtered = applications.filter((app) => app?.job?.title);

    return filtered.reduce((acc, app) => {
      const currentJobId = app.job._id;

      if (!acc[currentJobId]) {
        acc[currentJobId] = {
          job: app.job,
          applications: [],
        };
      }

      acc[currentJobId].applications.push(app);
      return acc;
    }, {});
  }, [applications]);

  const handleDownloadResume = (resumeUrl) => {
  if (!resumeUrl || resumeUrl === "null" || resumeUrl === "undefined") {
    toast.error("Resume not available");
    return;
  }

  window.open(resumeUrl, "_blank");
};

  return (
    <DashboardLayout activeMenu="manage-jobs">
      {loading ? (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-500">Loading applications...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate("/manage-jobs")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Applications Overview
              </h1>
            </div>

            {Object.keys(groupedApplications).length === 0 ? (
              <div className="text-center py-20">
                <Users className="mx-auto h-20 w-20 text-slate-300" />
                <h3 className="mt-5 text-xl font-semibold text-slate-900">
                  No applications available
                </h3>
                <p className="mt-2 text-slate-500">
                  No applications found for this role yet.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.values(groupedApplications).map(({ job, applications }) => (
                  <div
                    key={job._id}
                    className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                  >
                    {/* Job Header */}
                    <div className="px-6 sm:px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-500">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                        <div className="flex items-start gap-4">
                          <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                            <BriefcaseBusiness className="h-7 w-7 text-white" />
                          </div>

                          <div>
                            <h2 className="text-2xl font-bold text-white">
                              {job.title}
                            </h2>

                            <div className="flex flex-wrap items-center gap-5 mt-2 text-blue-100">
                              <span className="inline-flex items-center gap-1.5 text-sm">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </span>

                              <span className="inline-flex items-center gap-1.5 text-sm">
                                <Briefcase className="h-4 w-4" />
                                {job.type}
                              </span>

                              <span className="inline-flex items-center gap-1.5 text-sm">
                                {job.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/15 backdrop-blur-sm text-white font-semibold">
                          <Users className="h-4 w-4" />
                          {applications.length} Application
                          {applications.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>

                    {/* Applicants */}
                    <div className="p-6 sm:p-8">
                      <h3 className="text-sm font-bold tracking-wide uppercase text-slate-500 mb-5">
                        Applicants
                      </h3>

                      <div className="space-y-4">
                        {applications.map((application) => (
                          <div
                            key={application._id}
                            className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-white px-5 py-5 hover:shadow-sm transition-all"
                          >
                            {/* Left */}
                            <div className="flex items-center gap-4 min-w-0">
                              {application?.applicant?.avatar ? (
                                <img
                                  src={application.applicant.avatar}
                                  alt={application.applicant.name}
                                  className="h-14 w-14 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                  <span className="text-blue-700 font-bold text-base">
                                    {getInitials(application?.applicant?.name)}
                                  </span>
                                </div>
                              )}

                              <div className="min-w-0">
                                <h3 className="text-xl font-semibold text-slate-900">
                                  {application?.applicant?.name || "Unknown Applicant"}
                                </h3>

                                <p className="text-slate-500 text-base truncate">
                                  {application?.applicant?.email || "No email available"}
                                </p>

                                <div className="flex items-center gap-1.5 mt-1 text-slate-500 text-sm">
                                  <Calendar className="h-4 w-4" />
                                  Applied{" "}
                                  {moment(application.createdAt).format("DD MMM YYYY")}
                                </div>
                              </div>
                            </div>

                            {/* Right */}
                            <div className="flex flex-wrap items-center gap-3">
                              <StatusBadge status={application.status} />

                              <button
                                onClick={() =>
                                  handleDownloadResume(application?.applicant?.resume)
                                }
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                              >
                                <Download className="h-4 w-4" />
                                Resume
                              </button>

                              <button
                                onClick={() => setSelectedApplicant(application)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                                View Profile
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedApplicant && (
              <ApplicantProfilePreview
                selectedApplicant={selectedApplicant}
                setSelectedApplicant={setSelectedApplicant}
                handleDownloadResume={handleDownloadResume}
                handleClose={() => {
                  setSelectedApplicant(null);
                  fetchApplications();
                }}
              />
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ApplicationViewer;