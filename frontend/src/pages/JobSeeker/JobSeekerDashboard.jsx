import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  X,
  SlidersHorizontal,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import FilterContent from "./components/FilterContent";
import Navbar from "../../components/layout/Navbar";
import SearchHeader from "./components/SearchHeader";
import JobCard from "../../components/Cards/JobCard";

const JobSeekerDashboard = () => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "",
    type: "",
    minSalary: "",
    maxSalary: "",
  });

  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    salary: true,
    categories: true,
  });

  const fetchJobs = async (filterParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (filterParams.keyword) params.append("keyword", filterParams.keyword);
      if (filterParams.location) params.append("location", filterParams.location);
      if (filterParams.minSalary) params.append("minSalary", filterParams.minSalary);
      if (filterParams.maxSalary) params.append("maxSalary", filterParams.maxSalary);
      if (filterParams.type) params.append("type", filterParams.type);
      if (filterParams.category) params.append("category", filterParams.category);
      if (user) params.append("userId", user?._id);

      const response = await axiosInstance.get(
        `${API_PATHS.JOBS.GET_ALL_JOBS}?${params.toString()}`
      );

      const jobsData = Array.isArray(response.data)
        ? response.data
        : response.data.jobs || [];

      setJobs(jobsData);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to fetch jobs. Please try again later.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const apiFilters = {
        keyword: filters.keyword,
        location: filters.location,
        minSalary: filters.minSalary,
        maxSalary: filters.maxSalary,
        category: filters.category,
        type: filters.type,
        experience: filters.experience,
        remoteOnly: filters.remoteOnly,
      };

      const hasFilters = Object.values(apiFilters).some(
        (value) =>
          value !== "" &&
          value !== false &&
          value !== null &&
          value !== undefined
      );

      if (hasFilters) {
        fetchJobs(apiFilters);
      } else {
        fetchJobs();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters, user]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearAllFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      category: "",
      type: "",
      minSalary: "",
      maxSalary: "",
    });
  };

  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "" && value !== null && value !== undefined
  ).length;

  const MobileFilterOverlay = () => (
    <div className={`fixed inset-0 z-50 lg:hidden ${showMobileFilters ? "" : "hidden"}`}>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => setShowMobileFilters(false)}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">Filters</h3>
              <p className="text-xs text-slate-500">Refine your search</p>
            </div>
          </div>

          <button
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            onClick={() => setShowMobileFilters(false)}
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-full pb-24">
          <FilterContent
            toggleSection={toggleSection}
            clearAllFilters={clearAllFilters}
            expandedSections={expandedSections}
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        </div>
      </div>
    </div>
  );

  const toggleSaveJob = async (jobId, isSaved) => {
    try {
      if (isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        toast.success("Job removed successfully!");
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        toast.success("Job saved successfully!");
      }

      fetchJobs();
    } catch (err) {
      console.log("Error:", err);
      toast.error("Something went wrong! Try again later");
    }
  };

  const applyToJob = async (jobId) => {
    try {
      if (!user) {
        toast(
          () => (
            <div>
              <p>Please login to apply</p>
              <button
                onClick={() => navigate("/login")}
                className="bg-slate-900 text-white px-3 py-1 rounded-lg mt-2"
              >
                Login
              </button>
            </div>
          ),
          { duration: 3000 }
        );
        return;
      }

      if (jobId) {
        await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
        toast.success("Applied to job successfully!");
      }

      fetchJobs();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Something went wrong";

      toast.error(errorMsg);
    }
  };

  if (jobs.length === 0 && loading) return <LoadingSpinner />;

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <div className="min-h-screen mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-8">
          <SearchHeader
            filters={filters}
            handleFilterChange={handleFilterChange}
          />

          <div className="flex gap-6 lg:gap-8 mt-6">
            {/* Desktop Filters */}
            <div className="hidden lg:block w-80 shrink-0">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-xl">
                      Filter Jobs
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Narrow your search
                    </p>
                  </div>

                  {activeFilterCount > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-xs font-medium">
                      {activeFilterCount}
                    </span>
                  )}
                </div>

                <FilterContent
                  toggleSection={toggleSection}
                  clearAllFilters={clearAllFilters}
                  expandedSections={expandedSections}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Results Top Bar */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-5 sm:px-6 py-4 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <p className="text-slate-500 text-sm">Available opportunities</p>
                    <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                      {jobs.length} Jobs Found
                    </h2>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4">
                    <button
                      onClick={() => setShowMobileFilters(true)}
                      className="lg:hidden flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="h-5 min-w-5 px-1 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>

                    <div className="flex items-center border border-slate-200 rounded-2xl p-1 bg-slate-50">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2.5 rounded-xl transition-colors ${
                          viewMode === "grid"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2.5 rounded-xl transition-colors ${
                          viewMode === "list"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Empty */}
              {jobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <div className="text-slate-300 mb-6">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    No jobs found
                  </h3>
                  <p className="text-slate-500 mb-6">
                    Try adjusting your search criteria or filters.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-5"
                      : "space-y-4 lg:space-y-5"
                  }
                >
                  {jobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      onClick={() => navigate(`/job/${job._id}`)}
                      onToggleSave={() => toggleSaveJob(job._id, job.isSaved)}
                      onApply={() => applyToJob(job._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <MobileFilterOverlay />
      </div>
    </div>
  );
};

export default JobSeekerDashboard;