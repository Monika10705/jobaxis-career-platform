import {
  MapPin,
  DollarSign,
  ArrowLeft,
  Building2,
  Clock,
  Send,
} from "lucide-react";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";
import { useAuth } from "../../context/AuthContext";

const JobPostingPreview = ({ formData, setIsPreview, onSubmit, isSubmitting }) => {
  const { user } = useAuth();
  const currencies = [{ value: "usd", label: "$" }];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIsPreview(false)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Edit
          </button>

          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Publishing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Post Job
              </>
            )}
          </button>
        </div>

        {/* Main Preview Card */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Job Header */}
          <div className="border-t-4 border-purple-500 px-6 sm:px-8 py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                  {formData.jobTitle}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                  <span>{user?.companyName || user?.name || "Your Company"}</span>

                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {formData.location}
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Posted today
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 mt-5">
                  <span className="px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold border border-purple-200">
                    {CATEGORIES.find((c) => c.value === formData.category)?.label}
                  </span>

                  <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-200">
                    {JOB_TYPES.find((j) => j.value === formData.jobType)?.label}
                  </span>
                </div>
              </div>

              {user?.companyLogo ? (
                <img
                  src={user.companyLogo}
                  alt="Company Logo"
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border border-slate-200"
                />
              ) : (
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-purple-600" />
                </div>
              )}
            </div>
          </div>

          {/* Salary */}
          <div className="px-6 sm:px-8 py-5 border-t border-slate-200">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    Salary (Annual)
                  </p>
                  <h3 className="text-lg font-bold text-slate-900">
                    {currencies.find((c) => c.value === formData.currency)?.label}
                    {formData.salaryMin?.toLocaleString()} -{" "}
                    {currencies.find((c) => c.value === formData.currency)?.label}
                    {formData.salaryMax?.toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="px-6 sm:px-8 py-5 border-t border-slate-200">
            <div className="border-l-4 border-blue-500 pl-4 mb-4">
              <h3 className="text-sm font-bold tracking-wide uppercase text-slate-800">
                About This Role
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {formData.description}
            </div>
          </div>

          {/* Requirements */}
          <div className="px-6 sm:px-8 py-5 border-t border-slate-200">
            <div className="border-l-4 border-emerald-500 pl-4 mb-4">
              <h3 className="text-sm font-bold tracking-wide uppercase text-slate-800">
                What We&apos;re Looking For
              </h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {formData.requirements}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingPreview;