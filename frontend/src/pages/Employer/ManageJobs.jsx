import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Edit,
  X,
  Trash2,
  ChevronUp,
  ChevronDown,
  Users,
  ArrowLeft,
  Briefcase,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";

const ManageJobs = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;
  const [jobs, setJobs] = useState([]);

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "applicants") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortDirection === "asc") return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [jobs, searchTerm, statusFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredAndSortedJobs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleStatusChange = async (jobId) => {
    try {
      await axiosInstance.put(API_PATHS.JOBS.TOGGLE_CLOSE(jobId));
      getPostedJobs(true);
    } catch (error) {
      console.error("Error toggling job status:", error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await axiosInstance.delete(API_PATHS.JOBS.DELETE_JOB(jobId));
      setJobs(jobs.filter((job) => job.id !== jobId));
      toast.success("Job listing deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field)
      return <ChevronUp className="w-4 h-4 text-slate-300" />;

    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  const getPostedJobs = async (disableLoader) => {
    setIsLoading(!disableLoader);
    try {
      const response = await axiosInstance.get(API_PATHS.JOBS.GET_JOBS_EMPLOYER);

      if (response.status === 200 && response.data?.length >= 0) {
        const formattedJobs = response.data?.map((job) => ({
          id: job._id,
          title: job?.title,
          company: job?.company?.name,
          status: job?.isClosed ? "Closed" : "Active",
          applicants: job?.applicationCount || 0,
          datePosted: moment(job?.createdAt).format("DD-MM-YYYY"),
        }));

        setJobs(formattedJobs);
      }
    } catch (error) {
      console.error(error?.response?.data?.message || "Error loading jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPostedJobs();
  }, []);

  return (
    <DashboardLayout activeMenu="manage-jobs">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="flex items-start gap-3">
              <button
                onClick={() => navigate(-1)}
                className="shrink-0 h-11 w-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Job Management
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Manage your job postings and track applications
                </p>
              </div>
            </div>

            <button
              className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-sm text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              onClick={() => navigate("/post-job")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Job
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Jobs",
                value: jobs.length,
                color: "text-slate-900",
              },
              {
                label: "Active",
                value: jobs.filter((j) => j.status === "Active").length,
                color: "text-emerald-600",
              },
              {
                label: "Closed",
                value: jobs.filter((j) => j.status === "Closed").length,
                color: "text-orange-600",
              },
              {
                label: "Applicants",
                value: jobs.reduce((sum, j) => sum + j.applicants, 0),
                color: "text-blue-600",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
              >
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {item.label}
                </p>
                <h3 className={`text-2xl font-bold mt-2 ${item.color}`}>
                  {item.value}
                </h3>
              </div>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm border border-slate-200 rounded-2xl bg-slate-50 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="sm:w-52 px-4 py-3 text-sm border border-slate-200 rounded-2xl bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <p className="text-sm text-slate-500 mt-4">
              Showing {paginatedJobs.length} of {filteredAndSortedJobs.length} jobs
            </p>
          </div>

          {/* Table */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {filteredAndSortedJobs.length === 0 && !isLoading ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <Briefcase className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No jobs found</h3>
                <p className="text-slate-500 mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th
                        onClick={() => handleSort("title")}
                        className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase cursor-pointer"
                      >
                        Job Title
                      </th>

                      <th
                        onClick={() => handleSort("status")}
                        className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase cursor-pointer"
                      >
                        <div className="flex items-center justify-center gap-1">
                          Status <SortIcon field="status" />
                        </div>
                      </th>

                      <th
                        onClick={() => handleSort("applicants")}
                        className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase cursor-pointer"
                      >
                        <div className="flex items-center justify-center gap-1">
                          Applicants <SortIcon field="applicants" />
                        </div>
                      </th>

                      <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {paginatedJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-5 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                            <p className="text-xs text-slate-500">{job.company}</p>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-center">
                          <div className="flex justify-center">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${job.status === "Active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-600"
                                }`}
                            >
                              {job.status}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-center">
                          <div className="flex justify-center">
                            <button
                              className="flex items-center justify-center text-sm text-blue-600 font-medium hover:text-blue-700"
                              onClick={() =>
                                navigate("/applicants", { state: { jobId: job.id } })
                              }
                            >
                              <Users className="w-4 h-4 mr-1.5" />
                              {job.applicants}
                            </button>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50"
                              onClick={() =>
                                navigate("/post-job", { state: { jobId: job.id } })
                              }
                            >
                              <Edit className="w-4 h-4 text-slate-700" />
                            </button>

                            <button
                              onClick={() => handleStatusChange(job.id)}
                              className={`px-3 py-2 rounded-xl text-xs font-medium ${job.status === "Active"
                                  ? "bg-orange-50 text-orange-700"
                                  : "bg-emerald-50 text-emerald-700"
                                }`}
                            >
                              {job.status === "Active" ? "Close" : "Activate"}
                            </button>

                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-2 rounded-xl border border-slate-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageJobs;