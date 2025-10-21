import React, { useState } from 'react';
import { Database, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import apiPaths from '../../utils/apiPaths';
import { handleError, handleSuccess } from '../../utils/toast';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axiosInstance.post(apiPaths.auth.login, {
        username: formData.username,
        password: formData.password,
      });

      console.log("Login response:", data);

      if (data?.jwtoken) {
        localStorage.setItem("token", data.jwtoken);
        localStorage.setItem("name", data.name);
      }

      handleSuccess(data?.message || "Login successful!");
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      handleError(error.response?.data?.message || "Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FFF1D5' }}>
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#9FB3DF' }}
              >
                <Database className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-semibold text-gray-900">
                DataVault
              </span>
            </div>
            <h2 className="text-3xl font-light text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600 font-light">
              Please sign in to your account
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FB3DF] focus:ring-opacity-20 transition-all"
                  placeholder="Enter your username"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FB3DF] focus:ring-opacity-20 transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-medium text-white hover:shadow-lg transition-all duration-200 disabled:opacity-70"
                style={{ backgroundColor: '#9FB3DF' }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 font-light">
                Don&apos;t have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium hover:underline"
                  style={{ color: '#9FB3DF' }}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-light transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
