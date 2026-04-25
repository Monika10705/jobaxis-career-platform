import DashboardLayout from '../../components/layout/DashboardLayout'
import { useState, useEffect } from "react";
import {
  AlertCircle,
  MapPin,
  DollarSign,
  Briefcase,
  Users,
  Eye,
  ArrowLeft
} from "lucide-react";
import { API_PATHS } from "../../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";
import InputField from '../../components/Input/InputField';
import SelectField from '../../components/Input/SelectField';
import TextareaField from '../../components/Input/TextareaField';
import JobPostingPreview from '../../components/Cards/JobPostingPreview';
import toast from "react-hot-toast";

const JobPostingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId || null;

  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
  });

  const [errors, setErrors] = useState({});
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
  if (e) e.preventDefault();

  const validationErrors = validateForm(formData);

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setIsSubmitting(true);

  const jobPayload = {
    title: formData.jobTitle,
    description: formData.description,
    requirements: formData.requirements,
    location: formData.location,
    category: formData.category,
    type: formData.jobType,
    salaryMin: formData.salaryMin,
    salaryMax: formData.salaryMax,
  };

  try {
    const response = jobId
      ? await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobId), jobPayload)
      : await axiosInstance.post(API_PATHS.JOBS.POST_JOB, jobPayload);

    if (response.status === 200 || response.status === 201) {
      toast.success(
        jobId ? "Job Updated Successfully!" : "Job Posted Successfully!"
      );

      setFormData({
        jobTitle: "",
        location: "",
        category: "",
        jobType: "",
        description: "",
        requirements: "",
        salaryMin: "",
        salaryMax: "",
      });

      navigate("/employer-dashboard");
      return;
    }

    toast.error("Something went wrong. Please try again.");
  } catch (error) {
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Failed to post/update job. Please try again.");
    }
  } finally {
    setIsSubmitting(false);
  }
};

  // Form validation helper
  const validateForm = (formData) => {
    const errors = {};

    if (!formData.jobTitle.trim()) {
      errors.jobTitle = "Job title is required";
    }

    if (!formData.category) {
      errors.category = "Please select a category";
    }

    if (!formData.jobType) {
      errors.jobType = "Please select a job type";
    }

    if (!formData.description.trim()) {
      errors.description = "Job description is required";
    }

    if (!formData.requirements.trim()) {
      errors.requirements = "Job requirements are required";
    }

    if (!formData.salaryMin || !formData.salaryMax) {
      errors.salary = "Both minimum and maximum salary are required";
    } else if (parseInt(formData.salaryMin) >= parseInt(formData.salaryMax)) {
      errors.salary = "Maximum salary must be greater than minimum salary";
    }

    return errors;
  };

  const isFormValid = () => {
    const validationErrors = validateForm(formData);
    return Object.keys(validationErrors).length === 0;
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (jobId) {
        try {
          const response = await axiosInstance.get(
            API_PATHS.JOBS.GET_JOB_BY_ID(jobId)
          );

          const jobData = response.data;

          if (jobData) {
            setFormData({
              jobTitle: jobData.title,
              location: jobData.location,
              category: jobData.category,
              jobType: jobData.type,
              description: jobData.description,
              requirements: jobData.requirements,
              salaryMin: jobData.salaryMin,
              salaryMax: jobData.salaryMax,
            });
          }
        } catch (error) {
          console.error("Error fetching job details:", error);
          if (error.response) {
            console.error("API Error:", error.response.data.message);
          }
        }
      }
    };

    fetchJobDetails();

    return () => { };
  }, []);

  if (isPreview) {
    return (
      <DashboardLayout activeMenu='post-job'>
        <JobPostingPreview
          formData={formData}
          setIsPreview={setIsPreview}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu='post-job'>
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white shadow-xl rounded-2xl p-6 sm:p-8'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8'>
              <div className='flex items-start sm:items-center gap-3'>
                <button
                  type='button'
                  onClick={() => navigate(-1)}
                  className='shrink-0 h-11 w-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200'
                >
                  <ArrowLeft className='h-5 w-5' />
                </button>

                <div>
                  <h2 className='text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent'>
                    Post a New Job
                  </h2>
                  <p className='text-sm text-slate-600 mt-1'>
                    Fill out the form below to create your job posting
                  </p>
                </div>
              </div>

              <div className='hidden sm:block px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-500'>
                Complete the form to preview your job post
              </div>
            </div>

            <div className='space-y-6'>
              <InputField
                label="Job Title"
                id="jobTitle"
                placeholder="e.g., Senior Frontend Developer"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                error={errors.jobTitle}
                required
                icon={Briefcase}
              />

              <div className='space-y-4'>
                <div className='flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0'>
                  <div className='flex-1'>
                    <InputField
                      label="Location"
                      id="location"
                      placeholder="e.g., New York, NY"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      error={errors.location}
                      icon={MapPin}
                    />
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <SelectField
                  label='Category'
                  id='category'
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  options={CATEGORIES}
                  placeholder="Select a category"
                  error={errors.category}
                  required
                  icon={Users}
                />

                <SelectField
                  label="Job Type"
                  id='jobType'
                  value={formData.jobType}
                  onChange={(e) => handleInputChange("jobType", e.target.value)}
                  options={JOB_TYPES}
                  placeholder="Select job type"
                  error={errors.jobType}
                  required
                  icon={Briefcase}
                />
              </div>

              <TextareaField
                label="Job Description"
                id="description"
                placeholder='Describe the role and responsibilities...'
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                error={errors.description}
                helperText='Include key responsibilities, day-to-day tasks, and what makes this role exciting'
                required
              />

              <TextareaField
                label="Requirements"
                id='requirements'
                placeholder="List key qualifications and skills..."
                value={formData.requirements}
                onChange={(e) =>
                  handleInputChange("requirements", e.target.value)
                }
                error={errors.requirements}
                helperText="Include required skills, experience level, education and any preferred qualifications"
                required
              />

              <div className='space-y-2'>
                <label className='block text-sm font-medium text-slate-700'>
                  Salary Range <span className='text-red-500'>*</span>
                </label>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                      <DollarSign className='h-5 w-5 text-slate-400' />
                    </div>
                    <input
                      type='number'
                      placeholder='Minimum Salary'
                      value={formData.salaryMin}
                      onChange={(e) =>
                        handleInputChange("salaryMin", e.target.value)
                      }
                      className='w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors duration-200'
                    />
                  </div>

                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                      <DollarSign className='h-5 w-5 text-slate-400' />
                    </div>
                    <input
                      type='number'
                      placeholder='Maximum Salary'
                      value={formData.salaryMax}
                      onChange={(e) =>
                        handleInputChange("salaryMax", e.target.value)
                      }
                      className='w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors duration-200'
                    />
                  </div>
                </div>

                {errors.salary && (
                  <div className='flex items-center space-x-1 text-sm text-red-600'>
                    <AlertCircle className='h-4 w-4' />
                    <span>{errors.salary}</span>
                  </div>
                )}
              </div>

              <div className='pt-4 flex flex-col sm:flex-row items-center gap-3'>
                <button
                  type='button'
                  onClick={() => navigate(-1)}
                  className='w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors duration-200'
                >
                  Back
                </button>

                <button
                  type='button'
                  onClick={() => setIsPreview(true)}
                  disabled={!isFormValid()}
                  className='w-full sm:flex-1 flex items-center justify-center px-4 py-3 rounded-xl text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
                >
                  <Eye className='h-5 w-5 mr-2' />
                  Preview Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobPostingForm;