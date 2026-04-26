export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://jobaxis-backend.onrender.com";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/user/profile",
    DELETE_RESUME: "/api/user/resume",

    // OTP / Password / Email
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    REQUEST_EMAIL_CHANGE: "/api/auth/request-email-change",
    CONFIRM_EMAIL_CHANGE: "/api/auth/confirm-email-change",
    SEND_VERIFY_EMAIL: "/api/auth/send-verify-email",
    VERIFY_EMAIL: "/api/auth/verify-email",
    SEND_REGISTER_OTP: "/api/auth/send-register-otp",
    VERIFY_REGISTER_OTP: "/api/auth/verify-register-otp",
  },

  DASHBOARD: {
    OVERVIEW: `/api/analytics/overview`,
  },

  JOBS: {
    GET_ALL_JOBS: '/api/jobs',
    GET_JOB_BY_ID: (id) => `/api/jobs/${id}`,
    POST_JOB: "/api/jobs",
    GET_JOBS_EMPLOYER: "/api/jobs/get-jobs-employer",
    // GET_JOB_BY_ID: (id) => `/api/jobs/${id}`,
    UPDATE_JOB: (id) => `/api/jobs/${id}`,
    TOGGLE_CLOSE: (id) => `/api/jobs/${id}/toggle-close`,
    DELETE_JOB: (id) => `/api/jobs/${id}`,
    // DELETE_JOB: (id) => `/api/jobs/${id}`,

    SAVE_JOB: (id) => `/api/save-jobs/${id}`,
    UNSAVE_JOB: (id) => `/api/save-jobs/${id}`,
    GET_SAVED_JOBS: `/api/save-jobs/my`,
  },

  APPLICATIONS: {
    APPLY_TO_JOB: (id) => `/api/applications/${id}`,
    GET_ALL_APPLICATIONS: (id) => `/api/applications/job/${id}`,
    UPDATE_STATUS: (id) => `/api/applications/${id}/status`,
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image", // Upload profile picture
  },
};