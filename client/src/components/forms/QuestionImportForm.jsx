import React, { useState } from "react";
import { Link, Download, AlertCircle, CheckCircle } from "lucide-react";

const QuestionImportForm = ({ onQuestionImported, onCancel }) => {
  const [questionUrl, setQuestionUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getSlugFromUrl = (url) => {
    try {
      // Remove trailing slash if present
      const cleanUrl = url.replace(/\/$/, "");

      // Split by "/" and find the "problems" index
      const parts = cleanUrl.split("/");
      const problemsIndex = parts.indexOf("problems");

      if (problemsIndex === -1) return "";

      // Get the slug (the part after "problems")
      const slug = parts[problemsIndex + 1];

      // If slug is empty or undefined, return empty string
      if (!slug) return "";

      // If the next part is "description", we have the right slug
      // If not, we still have the right slug (for URLs without /description/)
      return slug;
    } catch {
      return "";
    }
  };

  const fetchLeetCodeQuestion = async (slug) => {
    console.log("Fetching question for slug:", slug);

    try {
      const res = await fetch("/api/leetcode/fetch-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        // Try to parse error response, but handle cases where it's not JSON
        let errorMessage = `HTTP error! status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If we can't parse JSON, use the status text
          errorMessage = res.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log("Response data:", data);

      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      // Check if it's a network error (backend not running)
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        throw new Error(
          "Backend server is not running. Please start the server first."
        );
      }
      throw error;
    }
  };

  const handleImport = async () => {
    if (!questionUrl.trim()) {
      setError("Please enter a LeetCode URL");
      return;
    }

    const slug = getSlugFromUrl(questionUrl);
    console.log("Extracted slug:", slug);
    console.log("Original URL:", questionUrl);

    if (!slug) {
      setError(
        "Invalid LeetCode URL. Please use format: https://leetcode.com/problems/problem-name/"
      );
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const questionData = await fetchLeetCodeQuestion(slug);
      console.log("Question data received:", questionData);

      const formattedQuestion = {
        _id: questionData.questionId.toString(),
        title: questionData.title,
        difficulty: questionData.difficulty,
        tags: questionData.topicTags.map((t) => t.name),
        description: questionData.content,
        topic: { name: "Dynamic Programming" }, // Default topic, can be changed
        solutions: [],
        leetCodeSlug: slug,
      };

      setSuccess("Question imported successfully!");
      onQuestionImported(formattedQuestion);
    } catch (err) {
      console.error("Import error:", err);
      setError(`Failed to import question: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-2">
          Import LeetCode Question
        </h3>
        <p className="text-slate-400 text-sm">
          Paste a LeetCode problem URL to automatically import the question
          details.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            LeetCode URL
          </label>
          <div className="flex space-x-3">
            <input
              type="url"
              value={questionUrl}
              onChange={(e) => setQuestionUrl(e.target.value)}
              placeholder="https://leetcode.com/problems/two-sum/"
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-600"
            />
            <button
              onClick={handleImport}
              disabled={isLoading || !questionUrl.trim()}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg flex items-center space-x-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Import</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-700/30 text-red-300 rounded-lg">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 p-3 bg-emerald-900/20 border border-emerald-700/30 text-emerald-300 rounded-lg">
            <CheckCircle size={16} />
            <span className="text-sm">{success}</span>
          </div>
        )}
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default QuestionImportForm;
