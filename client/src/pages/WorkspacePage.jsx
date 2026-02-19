import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  Plus,
  ArrowLeft,
  Tag,
  BrainCircuit,
  Code,
  Clock,
  BarChartBig,
  Copy,
  Check,
  Link2,
  Upload,
  ChevronDown,
  Zap,
  Target,
  Trophy,
  Save,
  FileText,
  Edit3,
} from "lucide-react";
import QuestionHeader from "../components/layout/QuestionHeader";
import CodeBlock from "../components/common/CodeBlock";
import api from "../services/api.js";

const difficultyClass = {
  Easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Hard: "text-red-400 bg-red-400/10 border-red-400/20",
};

const solutionTypeConfig = {
  brute: {
    icon: Target,
    label: "Brute Force",
    color: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  },
  better: {
    icon: Zap,
    label: "Better",
    color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  },
  optimal: {
    icon: Trophy,
    label: "Optimal",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
};

const SolutionForm = ({ questionId, onCancel, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    type: "optimal",
    logic: "",
    code: "",
    language: "javascript",
    timeComplexity: "",
    spaceComplexity: "",
  });

  const timeComplexityOptions = [
    "O(1)",
    "O(log n)",
    "O(n)",
    "O(n log n)",
    "O(n²)",
    "O(2^n)",
    "O(n!)",
  ];
  const spaceComplexityOptions = ["O(1)", "O(log n)", "O(n)", "O(n²)"];

  const handleSubmit = () => {
    // Pass the form data to the parent component
    onFormSubmit(formData);
  };

  return (
    <div className="space-y-6">
      {/* Solution Type */}
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Solution Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(solutionTypeConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFormData({ ...formData, type: key })}
                className={`p-3 rounded-lg border transition-all duration-200 flex flex-col items-center space-y-2 ${
                  formData.type === key
                    ? config.color
                    : "border-slate-700 text-slate-400 hover:border-slate-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logic */}
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Logic/Approach
        </label>
        <textarea
          value={formData.logic}
          onChange={(e) => setFormData({ ...formData, logic: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600 resize-none"
          placeholder="Explain your approach..."
          required
        />
      </div>

      {/* Code */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-slate-300 text-sm font-medium">Code</label>
          <select
            value={formData.language}
            onChange={(e) =>
              setFormData({ ...formData, language: e.target.value })
            }
            className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        <textarea
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          rows={8}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-slate-600 resize-none"
          placeholder="Paste your solution code here..."
          required
        />
      </div>

      {/* Complexity */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Time Complexity
          </label>
          <select
            value={formData.timeComplexity}
            onChange={(e) =>
              setFormData({ ...formData, timeComplexity: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600"
            required
          >
            <option value="">Select complexity</option>
            {timeComplexityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Space Complexity
          </label>
          <select
            value={formData.spaceComplexity}
            onChange={(e) =>
              setFormData({ ...formData, spaceComplexity: e.target.value })
            }
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600"
            required
          >
            <option value="">Select complexity</option>
            {spaceComplexityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all duration-200"
        >
          Add Solution
        </button>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <span className="text-slate-400 text-xl">×</span>
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default function WorkspacePage() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [activeSolutionId, setActiveSolutionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  // Mock data based on questionId
  useEffect(() => {
    if (questionId === "new") {
      setQuestion(null);
      setActiveSolutionId(null);
      setIsLoading(false);
      return;
    }

    // For existing questions, fetch from backend
    if (questionId && questionId !== "new") {
      setIsLoading(true);
      // TODO: Fetch question from backend
      // For now, set loading to false
      setIsLoading(false);
    }
  }, [questionId]);

  const handleFormSubmit = (solutionData) => {
    // Create a new solution with a unique ID
    const newSolution = {
      _id: `sol_${Date.now()}`,
      type: solutionData.type,
      logic: solutionData.logic,
      code: solutionData.code,
      language: solutionData.language,
      timeComplexity: solutionData.timeComplexity,
      spaceComplexity: solutionData.spaceComplexity,
    };

    // Add the solution to the question
    const updatedQuestion = {
      ...question,
      solutions: [...(question.solutions || []), newSolution],
    };

    // Update the question state
    setQuestion(updatedQuestion);

    // Set the new solution as active
    setActiveSolutionId(newSolution._id);

    // Close the modal
    setIsModalOpen(false);
  };

  const handleSaveQuestion = async () => {
    if (!question) return;

    try {
      // Extract question name from title
      const questionName = question.title;

      // Prepare the question data for saving
      const questionData = {
        title: questionName,
        description: question.description,
        difficulty: question.difficulty,
        tags: question.tags || [],
        topic: question.topic || { name: "Dynamic Programming" },
        leetCodeSlug: question.leetCodeSlug,
        notes: notes,
        solutions: question.solutions || [],
      };

      console.log("Saving question:", questionData);

      // Call backend API to save the question
      const response = await api.post("/questions", questionData);
      console.log("Question saved successfully:", response.data);

      // After saving, navigate to topic page
      const topicName = questionData.topic.name
        .toLowerCase()
        .replace(/ /g, "-");
      navigate(`/topics/${topicName}`);
    } catch (error) {
      console.error("Failed to save question:", error);
      // TODO: Show error message to user
      alert("Failed to save question. Please try again.");
    }
  };

  const handleNotesSave = () => {
    setIsNotesModalOpen(false);
    // Notes are saved in local state
  };

  const handleEditField = (field, currentValue) => {
    setEditingField(field);
    setEditingValue(currentValue);
  };

  const handleSaveEdit = () => {
    if (editingField && question) {
      const updatedQuestion = { ...question };
      if (editingField.startsWith("solution.")) {
        const solutionId = editingField.split(".")[1];
        const field = editingField.split(".")[2];
        const solutionIndex = updatedQuestion.solutions.findIndex(
          (s) => s._id === solutionId
        );
        if (solutionIndex !== -1) {
          updatedQuestion.solutions[solutionIndex] = {
            ...updatedQuestion.solutions[solutionIndex],
            [field]: editingValue,
          };
        }
      } else {
        updatedQuestion[editingField] = editingValue;
      }
      setQuestion(updatedQuestion);
    }
    setEditingField(null);
    setEditingValue("");
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditingValue("");
  };

  const handleQuestionImported = (importedQuestion) => {
    setQuestion(importedQuestion);
    setActiveSolutionId(null);
    setIsLoading(false);
  };

  const handleBackClick = () => {
    navigate("/topics/dynamic-programming");
  };

  const activeSolution = question?.solutions.find(
    (s) => s._id === activeSolutionId
  );

  const renderContent = (content) => {
    return (
      <div
        className="prose prose-invert prose-slate max-w-none prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-emerald-400 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700"
        dangerouslySetInnerHTML={{
          __html: content
            .replace(/\n/g, "<br>")
            .replace(/`([^`]+)`/g, "<code>$1</code>"),
        }}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          <span className="text-slate-300 text-lg">Loading problem...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">
            {error || "Question not found."}
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen bg-slate-950 text-slate-100 flex flex-col">
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Question */}
          <div
            className={`${
              showNotes ? "w-3/4" : "w-1/2"
            } border-r border-slate-800 flex flex-col`}
          >
            <QuestionHeader
              question={question}
              onQuestionImported={handleQuestionImported}
              onBackClick={handleBackClick}
              onAddSolution={() => setIsModalOpen(true)}
            />
            {question && (
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose prose-invert prose-slate max-w-none">
                  {renderContent(question.description)}
                </div>
              </div>
            )}
          </div>

          {/* Notes Panel */}
          {showNotes && (
            <div className="w-1/4 border-r border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                <h3 className="text-lg font-semibold text-slate-100">Notes</h3>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="prose prose-invert prose-slate max-w-none">
                  {notes ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: notes.replace(/\n/g, "<br>"),
                      }}
                    />
                  ) : (
                    <p className="text-slate-400">No notes added yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Right Panel - Solutions */}
          <div className="w-1/2 flex flex-col">
            <div className="p-6 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-100">Solutions</h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsNotesModalOpen(true)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm ${
                      notes
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500"
                        : "bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600"
                    }`}
                  >
                    {notes ? <FileText size={16} /> : <Plus size={16} />}
                    <span>{notes ? "Edit Notes" : "Add Notes"}</span>
                  </button>
                  {notes && (
                    <button
                      onClick={() => setShowNotes(!showNotes)}
                      className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all duration-200 text-sm"
                    >
                      <FileText size={16} />
                      <span>{showNotes ? "Hide" : "Show"} Notes</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all duration-200"
                  >
                    <Plus size={18} />
                    <span>Add Solution</span>
                  </button>
                </div>
              </div>
              {question?.solutions && question.solutions.length > 0 && (
                <div className="flex space-x-1">
                  {question.solutions.map((sol, index) => {
                    const config = solutionTypeConfig[sol.type];
                    const Icon = config.icon;
                    return (
                      <button
                        key={sol._id}
                        onClick={() => setActiveSolutionId(sol._id)}
                        className={`px-4 py-2 rounded-lg border transition-all duration-200 flex items-center space-x-2 ${
                          activeSolutionId === sol._id
                            ? config.color
                            : "border-slate-700 text-slate-400 hover:border-slate-600"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {config.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Active Solution Content */}
            {activeSolution ? (
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Logic */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
                        <BrainCircuit className="w-5 h-5" />
                        <span>Logic</span>
                      </h3>
                      <button
                        onClick={() =>
                          handleEditField(
                            `solution.${activeSolution._id}.logic`,
                            activeSolution.logic
                          )
                        }
                        className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                    {editingField === `solution.${activeSolution._id}.logic` ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600 resize-none"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-300 leading-relaxed">
                        {activeSolution.logic}
                      </p>
                    )}
                  </div>

                  {/* Code */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
                        <Code className="w-5 h-5" />
                        <span>Code ({activeSolution.language})</span>
                      </h3>
                    </div>
                    <CodeBlock
                      code={activeSolution.code}
                      language={activeSolution.language}
                    />
                  </div>

                  {/* Complexity */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
                          <Clock className="w-5 h-5" />
                          <span>Time Complexity</span>
                        </h3>
                        <button
                          onClick={() =>
                            handleEditField(
                              `solution.${activeSolution._id}.timeComplexity`,
                              activeSolution.timeComplexity
                            )
                          }
                          className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                      </div>
                      {editingField ===
                      `solution.${activeSolution._id}.timeComplexity` ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-300 font-mono">
                          {activeSolution.timeComplexity}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
                          <BarChartBig className="w-5 h-5" />
                          <span>Space Complexity</span>
                        </h3>
                        <button
                          onClick={() =>
                            handleEditField(
                              `solution.${activeSolution._id}.spaceComplexity`,
                              activeSolution.spaceComplexity
                            )
                          }
                          className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                      </div>
                      {editingField ===
                      `solution.${activeSolution._id}.spaceComplexity` ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600"
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-300 font-mono">
                          {activeSolution.spaceComplexity}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <Code className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                  <p className="text-lg">No solutions yet</p>
                  <p className="text-sm">
                    Add your first solution to get started!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        {question && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <div className="flex justify-end">
              <button
                onClick={handleSaveQuestion}
                className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg border border-emerald-500 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-600/20"
              >
                <Save size={18} />
                <span>Save Question</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Solution Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Add Solution for ${question?.title || "Question"}`}
      >
        <SolutionForm
          questionId={question?._id}
          onCancel={() => setIsModalOpen(false)}
          onFormSubmit={handleFormSubmit}
        />
      </Modal>

      {/* Add Notes Modal */}
      <Modal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        title="Add Notes"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600 resize-none"
              placeholder="Add your notes here..."
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setIsNotesModalOpen(false)}
              className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleNotesSave}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all duration-200"
            >
              Save Notes
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
