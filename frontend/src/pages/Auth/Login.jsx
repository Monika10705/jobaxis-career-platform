import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  CheckCircle,
  Briefcase,
  ShieldCheck,
  TrendingUp
} from 'lucide-react'
import { validateEmail } from '../../utils/helper'
import { useAuth } from '../../context/AuthContext'
import { API_PATHS } from '../../utils/apiPaths'
import axiosInstance from '../../utils/axiosInstance'

const Login = () => {
  const { login, user } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    success: false
  });

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    return '';
  };

  //handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    //clear error when user starts typing
    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, [name]: '' }
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password)
    };

    //Remove empty errors
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });

    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormState(prev => ({ ...prev, loading: true }));

    try {
      //login API integration
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      setFormState(prev => ({
        ...prev,
        loading: false,
        success: true,
        errors: {}
      }));

      const { token, role } = response.data;

      if (token) {
        login(response.data, token);

        // Redirect based on role
        setTimeout(() => {
          window.location.href =
            role === "employer"
              ? "/employer-dashboard"
              : "/find-jobs";
        }, 2000);
      }

      // Redirect based on user role
      setTimeout(() => {
        const redirectPath = user.role === "employer"
          ? "/employer-dashboard"
          : "/find-jobs";

        window.location.href = redirectPath;
      }, 1500);

    } catch (error) {
      setFormState(prev => ({
        ...prev,
        loading: false,
        errors: {
          submit: error.response?.data?.message || 'Login Failed. Please Check Your Credentials'
        }
      }));
    }
  };

  if (formState.success) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4'>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className='w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-xl p-10 text-center'
        >
          <div className='w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5'>
            <CheckCircle className='w-10 h-10 text-green-500' />
          </div>

          <h2 className='text-3xl font-bold text-slate-900 mb-2'>
            Welcome Back!
          </h2>

          <p className='text-slate-600 mb-6'>
            You have been successfully logged in.
          </p>

          <div className='w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin mx-auto' />
          <p className='text-sm text-slate-500 mt-3'>
            Redirecting to your dashboard...
          </p>
        </motion.div>
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='min-h-screen grid lg:grid-cols-2'>
        {/* Left Panel */}
        <div className='hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-14 py-12 border-r border-slate-200'>
          <div>
            <a href='/' className='flex items-center gap-3 mb-16'>
              <div className='w-11 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-md'>
                <Briefcase className='w-5 h-5 text-white' />
              </div>
              <span className='text-2xl font-bold text-slate-900'>JobAxis</span>
            </a>

            <div className='max-w-xl'>
              <h1 className='text-5xl font-bold leading-tight text-slate-900 mb-4'>
                Welcome Back! <br />
                <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Glad to see you again
                </span>
              </h1>

              <p className='text-lg text-slate-600 leading-8 mb-12'>
                Login to your account and continue your journey toward better opportunities and smarter hiring.
              </p>

              <div className='space-y-6'>
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center'>
                    <Briefcase className='w-5 h-5 text-blue-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-slate-900 text-lg'>Discover Opportunities</h3>
                    <p className='text-slate-600'>Find the perfect role that matches your skills and ambition.</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center'>
                    <ShieldCheck className='w-5 h-5 text-purple-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-slate-900 text-lg'>Trusted & Secure</h3>
                    <p className='text-slate-600'>Your profile and data stay protected with enterprise-grade security.</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center'>
                    <TrendingUp className='w-5 h-5 text-emerald-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-slate-900 text-lg'>Grow Faster</h3>
                    <p className='text-slate-600'>Advance your career with smarter applications and faster hiring.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className='rounded-3xl bg-white border border-slate-200 shadow-lg p-6 max-w-lg'>
            <div className='flex text-amber-400 mb-4 text-lg'>★★★★★</div>
            <p className='text-slate-700 leading-7 mb-5'>
              “JobAxis helped me land the perfect role faster than any platform I’ve used before.”
            </p>
            <div>
              <p className='font-semibold text-slate-900'>Sarah Johnson</p>
              <p className='text-sm text-slate-500'>Product Designer</p>
            </div>
          </div> */}
        </div>

        {/* Right Panel */}
        <div className='flex items-center justify-center px-4 py-10 sm:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='w-full max-w-xl'
          >
            <div className='rounded-3xl bg-white border border-slate-200 shadow-xl p-8 sm:p-10'>
              <div className='text-center mb-8'>
                <h2 className='text-3xl font-bold text-slate-900 mb-2'>
                  Welcome Back
                </h2>
                <p className='text-slate-600 text-base'>
                  Login to your JobAxis account to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Email */}
                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-2'>
                    Email Address
                  </label>
                  <div className='relative'>
                    <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5' />
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border ${formState.errors.email ? 'border-red-500' : 'border-slate-300'} focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all`}
                      placeholder='Enter your email address'
                    />
                  </div>
                  {formState.errors.email && (
                    <p className='text-red-500 text-sm mt-2 flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-1' />
                      {formState.errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-2'>
                    Password
                  </label>

                  <div className='relative'>
                    <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5' />

                    <input
                      type={formState.showPassword ? 'text' : 'password'}
                      name='password'
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border ${formState.errors.password ? 'border-red-500' : 'border-slate-300'} focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all`}
                      placeholder='Enter your password'
                    />

                    <button
                      type='button'
                      onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                      className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors'
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

                {/* Remember + Forgot */}
                <div className='flex items-center justify-between'>
                  <label className='flex items-center gap-2 text-sm text-slate-600 cursor-pointer'>
                    <input
                      type='checkbox'
                      name='rememberMe'
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className='w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500'
                    />
                    Remember me
                  </label>

                  <a
                    href='/forgot-password'
                    className='text-sm font-medium text-blue-600 hover:text-purple-600 transition-colors'
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* submit error */}
                {formState.errors.submit && (
                  <div className='bg-red-50 border border-red-200 rounded-2xl p-3'>
                    <p className='text-red-700 text-sm flex items-center'>
                      <AlertCircle className='w-4 h-4 mr-2' />
                      {formState.errors.submit}
                    </p>
                  </div>
                )}

                {/* submit button */}
                <button
                  type='submit'
                  disabled={formState.loading}
                  className='w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-blue-100'
                >
                  {formState.loading ? (
                    <>
                      <Loader className='w-5 h-5 animate-spin' />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>

                {/* Trust text */}
                <div className='text-center pt-1'>
                  <p className='text-sm text-slate-500'>
                    Your data is protected with enterprise-grade security.
                  </p>
                </div>

                {/* SignUp Link */}
                <div className='text-center pt-2'>
                  <p className='text-slate-600'>
                    Don&apos;t have an account?{' '}
                    <a href='/signup' className='text-blue-700 hover:text-purple-700 hover:underline font-semibold'>
                      Create one here
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

export default Login