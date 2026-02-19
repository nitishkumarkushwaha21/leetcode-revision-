import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Plus,
  CheckCircle,
  Clock,
  ArrowLeft,
  Search,
  Filter,
  Target,
  TrendingUp,
  Code2,
} from "lucide-react";
import api from "../services/api.js";

const TopicPage = () => {
  const { topicName } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [problems, setProblems] = useState([]);
  const [newProblem, setNewProblem] = useState({
    name: "",
    difficulty: "Easy",
    status: "Todo",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch topic and problems data
  useEffect(() => {
    const fetchTopicData = async () => {
      setLoading(true);
      try {
        // Convert topic name back to display format
        const displayName = topicName
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        // TODO: Fetch topic data from backend
        // const topicResponse = await api.get(`/topics/${topicName}`);
        // setTopic(topicResponse.data);

        // For now, create a basic topic object
        setTopic({
          id: topicName,
          name: displayName,
          description:
            "Master the art of breaking down complex problems into simpler subproblems",
          totalProblems: 0,
          solvedProblems: 0,
          progress: 0,
        });

        // TODO: Fetch problems for this topic from backend
        // const problemsResponse = await api.get(`/topics/${topicName}/problems`);
        // setProblems(problemsResponse.data);

        // For now, set empty problems array
        setProblems([]);
      } catch (error) {
        console.error("Failed to fetch topic data:", error);
        // Set empty data on error
        setTopic({
          id: topicName,
          name: displayName,
          description: "Error loading topic data",
          totalProblems: 0,
          solvedProblems: 0,
          progress: 0,
        });
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicData();
  }, [topicName]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "Medium":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "Hard":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Solved":
        return "text-emerald-400 bg-emerald-400/10";
      case "In Progress":
        return "text-blue-400 bg-blue-400/10";
      case "Todo":
        return "text-slate-400 bg-slate-400/10";
      default:
        return "text-slate-400 bg-slate-400/10";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Solved":
        return <CheckCircle className="w-4 h-4" />;
      case "In Progress":
        return <Clock className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      filterDifficulty === "All" || problem.difficulty === filterDifficulty;
    const matchesStatus =
      filterStatus === "All" || problem.status === filterStatus;
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const handleAddProblem = async () => {
    if (newProblem.name.trim()) {
      try {
        // TODO: Save problem to backend
        // const response = await api.post(`/topics/${topicName}/problems`, newProblem);
        // setProblems([...problems, response.data]);

        // For now, add to local state
        const problem = {
          id: Date.now(),
          ...newProblem,
          timeSpent: "0m",
        };
        setProblems([...problems, problem]);
        setNewProblem({ name: "", difficulty: "Easy", status: "Todo" });
        setShowAddForm(false);
      } catch (error) {
        console.error("Failed to add problem:", error);
      }
    }
  };

  const handleProblemClick = (problem) => {
    // Navigate to workspace with the problem ID
    navigate(`/workspace/${problem.id}`);
  };

  const handleNewQuestion = () => {
    // Navigate to empty workspace for new question
    navigate("/workspace/1");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-slate-600 border-t-slate-300 rounded-full animate-spin"></div>
          <span className="text-slate-300 text-lg">Loading topic...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 text-slate-300 group-hover:text-slate-100" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600">
                  <BookOpen className="w-6 h-6 text-slate-300" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-100">
                    {topic?.name}
                  </h1>
                  <p className="text-slate-400 text-sm">{topic?.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleNewQuestion}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg border border-emerald-500 transition-all duration-200 flex items-center space-x-2 hover:shadow-lg hover:shadow-emerald-600/20"
              >
                <Code2 className="w-4 h-4" />
                <span>New Question</span>
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all duration-200 flex items-center space-x-2 hover:shadow-lg hover:shadow-slate-700/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Problem</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Simple Stats */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>{filteredProblems.length} problems</span>
            <span>
              {problems.filter((p) => p.status === "Solved").length} solved
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-600 focus:border-slate-600 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-600 text-sm"
            >
              <option value="All">All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-600 text-sm"
            >
              <option value="All">Status</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Solved">Solved</option>
            </select>
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-2">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              onClick={() => handleProblemClick(problem)}
              className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-4 hover:border-slate-700/50 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${getStatusColor(
                      problem.status
                    )}`}
                  >
                    {problem.status === "Solved" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-100 group-hover:text-white transition-colors">
                      {problem.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                      problem.difficulty
                    )}`}
                  >
                    {problem.difficulty}
                  </span>
                  {problem.timeSpent !== "0m" && (
                    <span className="text-slate-400 text-xs">
                      {problem.timeSpent}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 rounded-full bg-slate-800 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-400 text-lg">
              No problems found matching your criteria
            </p>
          </div>
        )}
      </div>

      {/* Add Problem Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-slate-100 mb-4">
              Add New Problem
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Problem Name
                </label>
                <input
                  type="text"
                  value={newProblem.name}
                  onChange={(e) =>
                    setNewProblem({ ...newProblem, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600"
                  placeholder="Enter problem name..."
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Difficulty
                </label>
                <select
                  value={newProblem.difficulty}
                  onChange={(e) =>
                    setNewProblem({ ...newProblem, difficulty: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Status
                </label>
                <select
                  value={newProblem.status}
                  onChange={(e) =>
                    setNewProblem({ ...newProblem, status: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Solved">Solved</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProblem}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all duration-200"
              >
                Add Problem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicPage;
