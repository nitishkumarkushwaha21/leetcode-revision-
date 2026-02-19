import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Folder,
  Plus,
  Loader2,
  WifiOff,
  BookOpen,
  ChevronRight,
  Code2,
  Target,
  TrendingUp,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api.js";
import Modal from "../components/common/Modal.jsx";
import TopicForm from "../components/forms/TopicForm.jsx";

const gradientClasses = [
  "from-blue-600/20 to-purple-600/20",
  "from-emerald-600/20 to-teal-600/20",
  "from-orange-600/20 to-red-600/20",
  "from-pink-600/20 to-rose-600/20",
  "from-indigo-600/20 to-blue-600/20",
  "from-cyan-600/20 to-blue-600/20",
];

const iconColors = [
  "text-blue-400",
  "text-emerald-400",
  "text-orange-400",
  "text-pink-400",
  "text-indigo-400",
  "text-cyan-400",
];

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTopics = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/topics");
      setTopics(data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch topics:", err);
      setError("Failed to connect to the server.");
      setTopics([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleFormSubmit = () => {
    setIsModalOpen(false);
    fetchTopics();
  };

  const handleLogout = () => {
    logout();
  };

  const totalQuestions = topics.reduce(
    (sum, topic) => sum + (topic.questionCount || 0),
    0
  );

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-inter overflow-y-auto">
        {/* Header with Auth Status */}
        <div className="bg-slate-900/50 border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600">
                  <Code2 className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-100">
                    My DSA Journey
                  </h1>
                  <p className="text-slate-400 text-sm">
                    Master data structures and algorithms
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 text-sm">
                        {user?.name}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg border border-blue-500 transition-all duration-200"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-emerald-600/5"></div>

          <div className="relative px-6 md:px-8 pt-12 pb-16">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                    My DSA Journey
                  </h1>
                  <p className="text-lg text-slate-400 max-w-2xl">
                    Master data structures and algorithms with your personal
                    practice tracker
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {/* <button
                    onClick={() => setIsModalOpen(true)}
                    className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 font-medium"
                  >
                    <Plus size={20} />
                    <span>New Topic</span>
                  </button> */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 font-medium"
                  >
                    <Folder size={20} />
                    <span>New Folder</span>
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-blue-600/10 rounded-xl">
                      <BookOpen className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {topics.length}
                    </span>
                  </div>
                  <h3 className="text-slate-400 text-sm font-medium">
                    Active Topics
                  </h3>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-emerald-600/10 rounded-xl">
                      <Target className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {totalQuestions}
                    </span>
                  </div>
                  <h3 className="text-slate-400 text-sm font-medium">
                    Total Questions
                  </h3>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-purple-600/10 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {topics.length > 0
                        ? Math.round((totalQuestions / topics.length) * 10) / 10
                        : 0}
                    </span>
                  </div>
                  <h3 className="text-slate-400 text-sm font-medium">
                    Avg per Topic
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 md:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-blue-400 mb-4" />
                <p className="text-slate-400">Loading your topics...</p>
              </div>
            ) : (
              <div>
                {error && (
                  <div className="mb-8 p-4 bg-amber-900/20 border border-amber-700/30 text-amber-300 rounded-xl flex items-center backdrop-blur-sm">
                    <WifiOff size={20} className="mr-3 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {topics.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="max-w-md mx-auto">
                      <div className="p-4 bg-slate-800/50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <Code2 className="w-10 h-10 text-slate-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        No Topics Yet
                      </h3>
                      <p className="text-slate-400 mb-6">
                        Start your DSA journey by creating your first topic
                      </p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
                      >
                        <Plus size={18} />
                        <span>Create First Topic</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold text-white">
                        Your Topics
                      </h2>
                      <span className="text-slate-400 text-sm">
                        {topics.length}{" "}
                        {topics.length === 1 ? "topic" : "topics"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {topics.map((topic, index) => (
                        <Link
                          key={topic._id}
                          to={`/topics/${topic.name
                            .toLowerCase()
                            .replace(/ /g, "-")}`}
                          className="group relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 hover:bg-slate-900/70 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-2xl"
                        >
                          {/* Gradient Background */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${
                              gradientClasses[index % gradientClasses.length]
                            } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                          ></div>

                          <div className="relative">
                            {/* Topic Icon & Title */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="p-3 bg-slate-800/50 rounded-xl group-hover:bg-slate-800/70 transition-colors">
                                  <Folder
                                    className={`w-6 h-6 ${
                                      iconColors[index % iconColors.length]
                                    } group-hover:scale-110 transition-transform duration-200`}
                                  />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-white group-hover:text-white transition-colors">
                                    {topic.name}
                                  </h3>
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200" />
                            </div>

                            {/* Description */}
                            <p className="text-slate-400 text-sm mb-4 line-clamp-2 group-hover:text-slate-300 transition-colors">
                              {topic.description || "No description available"}
                            </p>

                            {/* Question Count */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="px-3 py-1 bg-slate-800/50 rounded-full">
                                  <span className="text-xs font-medium text-slate-300">
                                    {topic.questionCount || 0} questions
                                  </span>
                                </div>
                              </div>

                              {/* Progress Indicator */}
                              <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${gradientClasses[
                                    index % gradientClasses.length
                                  ].replace(
                                    "/20",
                                    ""
                                  )} transition-all duration-500`}
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      ((topic.questionCount || 0) / 20) * 100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Topic"
      >
        <TopicForm
          onCancel={() => setIsModalOpen(false)}
          onFormSubmit={handleFormSubmit}
        />
      </Modal>
    </>
  );
}
