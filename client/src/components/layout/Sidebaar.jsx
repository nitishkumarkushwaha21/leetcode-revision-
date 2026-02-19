import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronsRight, Folder, FileText, Plus, Loader2 } from "lucide-react";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Modal from "../common/Modal.jsx";
import TopicForm from "../forms/TopicForm.jsx";
import QuestionForm from "../forms/QuestionForm.jsx";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { topicName, questionId } = useParams();

  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState({}); // { topicId: [questions] }
  const [expandedTopics, setExpandedTopics] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [activeTopicForNewQuestion, setActiveTopicForNewQuestion] =
    useState(null);

  const fetchTopics = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/topics");
      setTopics(data);
    } catch (error) {
      console.error("Failed to fetch topics", error);
    }
    setIsLoading(false);
  }, []);

  const fetchQuestionsForTopic = useCallback(
    async (topicId) => {
      if (questions[topicId]) return; // Already fetched
      try {
        const response = await api.get(`/topics/${topicId}/questions`);
        setQuestions((prev) => ({
          ...prev,
          [topicId]: response.data.questions,
        }));
      } catch (error) {
        console.error(`Failed to fetch questions for topic ${topicId}`, error);
      }
    },
    [questions]
  );

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const toggleTopic = (topicId) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
      fetchQuestionsForTopic(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const handleAddQuestion = (topic) => {
    setActiveTopicForNewQuestion(topic);
    setIsQuestionModalOpen(true);
  };

  return (
    <>
      <aside className="w-72 bg-gray-800 text-gray-300 flex flex-col border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">DSA Tracker</h2>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          <button
            onClick={() => setIsTopicModalOpen(true)}
            className="w-full flex items-center justify-center space-x-2 p-2 text-sm text-gray-400 hover:text-gray-200 border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg transition"
          >
            <Plus size={16} />
            <span>Add Topic</span>
          </button>

          {isLoading && <Loader2 className="animate-spin mx-auto my-4" />}

          {topics.map((topic) => (
            <div key={topic._id}>
              <div
                onClick={() => toggleTopic(topic._id)}
                className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-700"
              >
                <div className="flex items-center space-x-2">
                  <Folder size={18} />
                  <span className="font-semibold">{topic.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Plus
                    size={16}
                    className="text-gray-500 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddQuestion(topic);
                    }}
                  />
                  <ChevronsRight
                    size={18}
                    className={`transition-transform ${
                      expandedTopics.has(topic._id) ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </div>
              {expandedTopics.has(topic._id) && (
                <div className="pl-6 space-y-1 py-1">
                  {questions[topic._id] ? (
                    questions[topic._id].map((q) => (
                      <Link
                        key={q._id}
                        to={`/workspace/${topic.name
                          .toLowerCase()
                          .replace(/ /g, "-")}/${q._id}`}
                        className={`flex items-center space-x-2 p-2 rounded-md text-sm transition-colors ${
                          q._id === questionId
                            ? "bg-slate-700 text-white"
                            : "hover:bg-gray-700/50"
                        }`}
                      >
                        <FileText size={16} />
                        <span className="truncate">{q.title}</span>
                      </Link>
                    ))
                  ) : (
                    <Loader2 className="animate-spin ml-2" size={16} />
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full text-left p-2 rounded-md hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Modals */}
      <Modal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        title="Create New Topic"
      >
        <TopicForm
          onCancel={() => setIsTopicModalOpen(false)}
          onFormSubmit={() => {
            setIsTopicModalOpen(false);
            fetchTopics();
          }}
        />
      </Modal>

      {activeTopicForNewQuestion && (
        <Modal
          isOpen={isQuestionModalOpen}
          onClose={() => setIsQuestionModalOpen(false)}
          title={`Add Question to ${activeTopicForNewQuestion.name}`}
        >
          <QuestionForm
            topicId={activeTopicForNewQuestion._id}
            onCancel={() => setIsQuestionModalOpen(false)}
            onFormSubmit={() => {
              setIsQuestionModalOpen(false);
              fetchQuestionsForTopic(activeTopicForNewQuestion._id);
            }}
          />
        </Modal>
      )}
    </>
  );
}
