import React, { useState } from 'react';
import { Database, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import { handleError, handleSuccess } from '../../utils/toast';
import axiosInstance from '../../utils/axiosInstance';
import apiPaths from '../../utils/apiPaths';

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
  e.preventDefault();

  // Validation
  if (!fullName) return handleError("Please enter full name.");
  if (!validateEmail(email)) return handleError("Please enter a valid email address.");
  if (!username) return handleError("Please enter username.");
  if (!password) return handleError("Please enter password.");
  if (password !== confirmPassword) return handleError("Passwords do not match.");

  try {
    const { data } = await axiosInstance.post(apiPaths.auth.signup, {
      name: fullName,
      email,
      username,
      password,
    });

    console.log(data);
    handleSuccess(data?.message || "Account created successfully!");
    navigate("/login", { replace: true });
  } catch (error) {
    handleError(error.response?.data?.message || "Signup failed!");
  }
};


  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak', color: '#ef4444' };
    if (password.length < 10) return { strength: 2, label: 'Fair', color: '#f97316' };
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, label: 'Strong', color: '#22c55e' };
    }
    return { strength: 2, label: 'Fair', color: '#f97316' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FFF1D5' }}>
      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#9FB3DF' }}>
                <Database className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-semibold text-gray-900">DataVault</span>
            </div>
            <h2 className="text-3xl font-light text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600 font-light">Start your data management journey today</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <form onSubmit={handleSignup}>
              <div className="space-y-6">
                {/* Full Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={({ target }) => setFullName(target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FB3DF] focus:ring-opacity-20 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FB3DF] focus:ring-opacity-20 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FB3DF] focus:ring-opacity-20 transition-all"
                    placeholder="johndoe"
                  />
                </div>
                
                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={({ target }) => setPassword(target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FB3DF] focus:ring-opacity-20 transition-all"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-300"
                            style={{ 
                              width: `${(passwordStrength.strength / 3) * 100}%`,
                              backgroundColor: passwordStrength.color 
                            }}
                          ></div>
                        </div>
                        <span 
                          className="text-xs font-medium"
                          style={{ color: passwordStrength.color }}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={({ target }) => setConfirmPassword(target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9FB3DF] focus:ring-opacity-20 transition-all"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>

                {error && <p className='text-red-500 text-xs text-center'>{error}</p>}
                
                <button
                  type='submit'
                  className="w-full py-3 rounded-lg font-medium text-white hover:shadow-lg transition-all duration-200"
                  style={{ backgroundColor: '#9FB3DF' }}
                >
                  Create Account
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600 font-light">
                Already have an account?{' '}
                <Link
                  className="font-medium hover:underline"
                  style={{ color: '#9FB3DF' }}
                  to="/login"
                >
                  Sign in
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

export default Signup;