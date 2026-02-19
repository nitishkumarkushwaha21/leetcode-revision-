import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Code2, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    // Clear API error when user starts typing
    if (apiError) {
      setApiError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setApiError("");

    try {
      const response = await api.post("/users/login", formData);
      const { user, token } = response.data;

      // Use the login function from AuthContext
      login(user, token);

      // Navigate to home page after successful login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError("Failed to login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-slate-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Geometric Patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-20 h-20 border border-slate-600 rotate-45"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 border border-slate-500 rotate-12"></div>
        <div className="absolute top-1/2 left-20 w-8 h-8 bg-slate-700 rotate-45"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl mb-6 shadow-2xl border border-slate-600">
            <Code2 className="w-8 h-8 text-slate-300" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to continue your DSA journey</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50"
        >
          {/* API Error Display */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{apiError}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 ${
                    errors.email
                      ? "border-red-500/50 focus:ring-red-500/50"
                      : "border-slate-600/50"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-4 bg-slate-800/50 border rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 ${
                    errors.password
                      ? "border-red-500/50 focus:ring-red-500/50"
                      : "border-slate-600/50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-slate-800 border-slate-600 rounded focus:ring-slate-500 focus:ring-2"
                />
                <span className="text-sm text-slate-400">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-slate-700"></div>
            <span className="px-4 text-slate-500 text-sm">or</span>
            <div className="flex-1 border-t border-slate-700"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-slate-300 hover:text-white font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            Powered by modern web technologies
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
