import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Lock,
  Upload,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader,
  Briefcase,
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import { validateEmail, validatePassword, validateAvatar } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';
import { useAuth } from '../../context/AuthContext';

const SignUp = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    avatar: null,
    confirmPassword: '',
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    showConfirmPassword: false,
    avatarPreview: null,
    success: false,
  });

  //handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    //clear error when user starts typing
    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, [name]: '' }
      }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      role
    }));
    if (formState.errors.role) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, role: '' }
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateAvatar(file);
      if (error) {
        setFormState((prev) => ({
          ...prev,
          errors: { ...prev.errors, avatar: error },

        }))
        return;
      }

      setFormData((prev) => ({ ...prev, avatar: file }))

      //create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormState((prev) => ({
          ...prev,
          avatarPreview: e.target.result,
          errors: { ...prev.errors, avatar: "" },
        }))
      }
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {
      fullName: !formData.fullName ? "Enter full name" : "",
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword:
        formData.password !== formData.confirmPassword ? "Passwords do not match" : "",
      role: !formData.role ? "Please select a role" : "",
      avatar: '',
    };

    //remove empty errors
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    })

    setFormState((prev) => ({ ...prev, errors }))
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormState((prev) => ({ ...prev, loading: true }))

    try {
      let avatarUrl = "";

      // Upload image if present
      if (formData.avatar) {
        try {
          const imgUploadRes = await uploadImage(formData.avatar);
          avatarUrl = imgUploadRes.imageUrl || "";
        } catch {
          avatarUrl = ""; // continue without avatar
        }
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        avatar: avatarUrl || "",
      });

      // Handle successful registration
      setFormState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        errors: {},
      }));

      const { token } = response.data;

      if (token) {
        login(response.data, token);

        //redirect based on role
        setTimeout(() => {
          window.location.href =
            formData.role === "employer"
              ? "/employer-dashboard"
              : "/find-jobs";
        }, 2000);
      }
    } catch (error) {
      console.log("REGISTER ERROR:", error.response?.data || error);

      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit:
            error.response?.data?.message ||
            "Registration failed. Please try again.",

        }
      }))
    }
  };

  if (formState.success) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50 px-4'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200 max-w-md w-full text-center'
        >
          <div className='w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5'>
            <CheckCircle className='w-10 h-10 text-green-500' />
          </div>
          <h2 className='text-2xl sm:text-3xl font-bold text-slate-900 mb-2'>Account Created!</h2>
          <p className='text-slate-600 mb-5'>
            Welcome to JobAxis! Your account has been successfully created.
          </p>
          <div className='animate-spin w-7 h-7 border-[3px] border-blue-600 border-t-transparent rounded-full mx-auto' />
          <p className='text-sm text-slate-500 mt-3'>Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='min-h-screen grid lg:grid-cols-2'>
        {/* Left Panel */}
        <div className='hidden lg:flex flex-col justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-10 xl:px-14 py-12 border-r border-slate-200'>
          <div>
            <a href='/' className='flex items-center gap-3 mb-14'>
              <div className='w-11 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-md'>
                <Briefcase className='w-5 h-5 text-white' />
              </div>
              <span className='text-2xl font-bold text-slate-900'>JobAxis</span>
            </a>

            <div className='max-w-xl'>
              <h1 className='text-4xl xl:text-5xl font-bold leading-tight text-slate-900 mb-4'>
                Start Your Journey <br />
                <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Build your future
                </span>
              </h1>

              <p className='text-base xl:text-lg text-slate-600 leading-7 xl:leading-8 mb-10'>
                Join JobAxis and connect with better opportunities, smarter hiring, and a platform built for modern careers.
              </p>

              <div className='space-y-6'>
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0'>
                    <Sparkles className='w-5 h-5 text-blue-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-slate-900 text-lg'>Smarter Careers</h3>
                    <p className='text-slate-600'>Get matched with opportunities that align with your goals.</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0'>
                    <ShieldCheck className='w-5 h-5 text-purple-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-slate-900 text-lg'>Secure & Trusted</h3>
                    <p className='text-slate-600'>Your data stays protected with secure and reliable infrastructure.</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0'>
                    <Building2 className='w-5 h-5 text-emerald-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-slate-900 text-lg'>Built for Everyone</h3>
                    <p className='text-slate-600'>Whether you hire talent or seek jobs, JobAxis helps you grow.</p>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4 mt-10'>
                <div className='rounded-2xl bg-white border border-slate-200 p-4 text-center shadow-sm'>
                  <h4 className='text-xl font-bold text-slate-900'>10K+</h4>
                  <p className='text-xs text-slate-500 mt-1'>Active Jobs</p>
                </div>
                <div className='rounded-2xl bg-white border border-slate-200 p-4 text-center shadow-sm'>
                  <h4 className='text-xl font-bold text-slate-900'>5K+</h4>
                  <p className='text-xs text-slate-500 mt-1'>Companies</p>
                </div>
                <div className='rounded-2xl bg-white border border-slate-200 p-4 text-center shadow-sm'>
                  <h4 className='text-xl font-bold text-slate-900'>25K+</h4>
                  <p className='text-xs text-slate-500 mt-1'>Hires Made</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className='flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='w-full max-w-xl'
          >
            <div className='bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-xl border border-slate-200 w-full'>
              <div className='text-center mb-8'>
                <div className='flex lg:hidden items-center justify-center gap-2 mb-5'>
                  <div className='w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-md'>
                    <Briefcase className='w-5 h-5 text-white' />
                  </div>
                  <span className='text-2xl font-bold text-slate-900'>JobAxis</span>
                </div>

                <h2 className='text-2xl sm:text-3xl font-bold text-slate-900 mb-2'>
                  Create Account
                </h2>
                <p className='text-sm sm:text-base text-slate-600'>
                  Join thousands of professionals finding their dream jobs
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-5'>
                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-2'>
                    Full Name *
                  </label>
                  <div className='relative'>
                    <User className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5' />
                    <input
                      type='text'
                      name='fullName'
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border ${formState.errors.fullName ? 'border-red-500' : 'border-slate-300'} focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all`}
                      placeholder='Enter your full name'
                    />
                  </div>
                  {formState.errors.fullName && (
                    <p className='text-red-500 text-sm mt-2 flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {formState.errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-2'>
                    Email *
                  </label>
                  <div className='relative'>
                    <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5' />
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border ${formState.errors.email ? 'border-red-500' : 'border-slate-300'} focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all`}
                      placeholder='Enter your email'
                    />
                  </div>
                  {formState.errors.email && (
                    <p className='text-red-500 text-sm mt-2 flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {formState.errors.email}
                    </p>
                  )}
                </div>

                <div className='grid sm:grid-cols-2 gap-5'>
                  <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-2'>
                      Password *
                    </label>
                    <div className='relative'>
                      <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5' />
                      <input
                        type={formState.showPassword ? 'text' : 'password'}
                        name='password'
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border ${formState.errors.password ? 'border-red-500' : 'border-slate-300'} focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all`}
                        placeholder='Create password'
                      />
                      <button
                        type='button'
                        onClick={() =>
                          setFormState((prev) => ({
                            ...prev,
                            showPassword: !prev.showPassword,
                          }))
                        }
                        className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
                      >
                        {formState.showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                      </button>
                    </div>
                    {formState.errors.password && (
                      <p className='text-red-500 text-sm mt-2 flex items-center'>
                        <AlertCircle className='w-4 h-4 mr-1' />
                        {formState.errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-semibold text-slate-700 mb-2'>
                      Confirm Password *
                    </label>
                    <div className='relative'>
                      <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5' />
                      <input
                        type={formState.showConfirmPassword ? 'text' : 'password'}
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border ${formState.errors.confirmPassword ? 'border-red-500' : 'border-slate-300'} focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all`}
                        placeholder='Confirm password'
                      />
                      <button
                        type='button'
                        onClick={() =>
                          setFormState((prev) => ({
                            ...prev,
                            showConfirmPassword: !prev.showConfirmPassword,
                          }))
                        }
                        className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600'
                      >
                        {formState.showConfirmPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                      </button>
                    </div>
                    {formState.errors.confirmPassword && (
                      <p className='text-red-500 text-sm mt-2 flex items-center'>
                        <AlertCircle className='w-4 h-4 mr-1' />
                        {formState.errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-2'>
                    Profile Picture (Optional)
                  </label>
                  <div className='flex items-center gap-4'>
                    <div className='w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0'>
                      {formState.avatarPreview ? (
                        <img src={formState.avatarPreview} alt="Avatar Preview" className='w-full h-full object-cover' />
                      ) : (
                        <User className='w-7 h-7 text-slate-400' />
                      )}
                    </div>
                    <div className='flex-1'>
                      <input
                        type='file'
                        id='avatar'
                        accept='.jpg,.jpeg,.png'
                        onChange={handleAvatarChange}
                        className='hidden'
                      />
                      <label
                        htmlFor='avatar'
                        className='cursor-pointer bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2 w-fit'
                      >
                        <Upload className='w-4 h-4' />
                        <span>Upload Photo</span>
                      </label>
                      <p className='text-xs text-slate-500 mt-2'>JPG, PNG up to 5MB</p>
                    </div>
                  </div>
                  {formState.errors.avatar && (
                    <p className='text-red-500 text-sm mt-2 flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {formState.errors.avatar}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-3'>
                    I am a *
                  </label>
                  <div className='grid grid-cols-2 gap-4'>
                    <button
                      type='button'
                      onClick={() => handleRoleChange("jobseeker")}
                      className={`p-4 rounded-2xl border-2 transition-all ${formData.role === "jobseeker" ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <UserCheck className='w-7 h-7 mx-auto mb-2' />
                      <div className='font-semibold text-sm sm:text-base'>Job Seeker</div>
                      <div className='text-xs text-slate-500 mt-1'>Looking for jobs</div>
                    </button>

                    <button
                      type='button'
                      onClick={() => handleRoleChange("employer")}
                      className={`p-4 rounded-2xl border-2 transition-all ${formData.role === 'employer' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <Building2 className='w-7 h-7 mx-auto mb-2' />
                      <div className='font-semibold text-sm sm:text-base'>Employer</div>
                      <div className='text-xs text-slate-500 mt-1'>Hiring talent</div>
                    </button>
                  </div>
                  {formState.errors.role && (
                    <p className='text-red-500 text-sm mt-2 flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {formState.errors.role}
                    </p>
                  )}
                </div>

                {formState.errors.submit && (
                  <div className='bg-red-50 border border-red-200 rounded-2xl p-3'>
                    <p className='text-red-700 text-sm flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {formState.errors.submit}
                    </p>
                  </div>
                )}

                <button
                  type='submit'
                  disabled={formState.loading}
                  className='cursor-pointer w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-blue-100'
                >
                  {formState.loading ? (
                    <>
                      <Loader className='w-5 h-5 animate-spin' />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <span>Create account</span>
                  )}
                </button>

                <div className='text-center pt-2'>
                  <p className='text-slate-600 text-sm sm:text-base'>
                    Already have an account?{" "}
                    <a href='/login' className='text-blue-700 hover:text-purple-700 hover:underline font-semibold'>
                      Sign in here
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SignUp