import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  DollarSign,
  Building2,
  Clock,
  Users,
  Briefcase,
  CheckCircle,
  Loader,
} from "lucide-react";
import BackButton from "../../components/BackButton";
import defaultCompanyLogo from "../../assets/default-company-logo.jpg";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Navbar from "../../components/layout/Navbar";
import moment from "moment";
import StatusBadge from "../../components/StatusBadge";
import toast from "react-hot-toast";

const JobDetails = () => {
  const { user } = useAuth();
  const { jobId } = useParams();

  const [jobDetails, setJobDetails] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [applying, setApplying] = useState(false);

  const fetchJob = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.JOBS.GET_JOB_BY_ID(jobId),
        { params: { userId: user?._id || null } }
      );
      setJobDetails(response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const applyToJob = async () => {
    try {
      setApplying(true);
      await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
      await fetchJob();
      setShowConfirm(false);
      toast.success("Applied to job successfully!");
    } catch (err) {
      const errorMsg = err?.response?.data?.message;
      toast.error(errorMsg || "Something went wrong! Try again later");
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    if (jobId && user) fetchJob();
  }, [jobId, user]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="mb-5">
          <BackButton />
        </motion.div>
        {jobDetails && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
          >

            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-slate-100">
              <div className="flex items-start gap-5">
                {jobDetails?.company?.companyLogo ? (
                <img
                    src={jobDetails.company.companyLogo || defaultCompanyLogo}
                    alt="Company Logo"
                    className="h-16 w-16 object-cover rounded-2xl border border-slate-200 shadow-sm shrink-0"
                  />
                ) : (
                  <img
                    src={defaultCompanyLogo}
                    alt="Company Logo"
                    className="h-16 w-16 object-cover rounded-2xl border border-slate-200 shadow-sm shrink-0"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mb-1">
                    {jobDetails.title}
                  </h1>
                  <p className="text-slate-500 text-sm flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {jobDetails.location}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                      {jobDetails.category}
                    </span>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-100">
                      {jobDetails.type}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {jobDetails.createdAt ? moment(jobDetails.createdAt).format("Do MMM YYYY") : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {jobDetails?.applicationStatus ? (
                    <StatusBadge status={jobDetails.applicationStatus} />
                  ) : (
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md shadow-blue-100 hover:shadow-lg hover:-translate-y-0.5"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Salary */}
            <div className="px-6 sm:px-8 py-6 border-b border-slate-100">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-0.5">Compensation</p>
                    <p className="text-lg font-bold text-slate-900">
                      ${jobDetails.salaryMin?.toLocaleString()} – ${jobDetails.salaryMax?.toLocaleString()}
                      <span className="text-sm text-slate-500 font-normal ml-1">/ year</span>
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full">
                  <Users className="h-3.5 w-3.5" />
                  Competitive
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 sm:px-8 py-6 space-y-8">
              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                  About This Role
                </h3>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {jobDetails.description}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full" />
                  What We're Looking For
                </h3>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-5 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {jobDetails.requirements}
                </div>
              </div>


            </div>
          </motion.div>
        )}
      </div>

      {/* Apply Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {showConfirm && (
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
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 text-center mb-1">Apply for this job?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              You're about to apply for <span className="font-semibold text-slate-700">{jobDetails?.title}</span> at <span className="font-semibold text-slate-700">{jobDetails?.company?.companyName}</span>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={applying}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyToJob}
                disabled={applying}
                className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {applying ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {applying ? "Applying..." : "Confirm"}
              </button>
            </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default JobDetails;
