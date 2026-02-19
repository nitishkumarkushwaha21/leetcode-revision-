import React, { useState } from 'react';
import { ArrowLeft, Tag, Download, Plus } from 'lucide-react';
import QuestionImportForm from '../forms/QuestionImportForm';
import Modal from '../common/Modal';

const QuestionHeader = ({ question, onQuestionImported, onBackClick, onAddSolution }) => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const difficultyClass = {
    Easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Hard: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  const handleQuestionImported = (importedQuestion) => {
    onQuestionImported(importedQuestion);
    setIsImportModalOpen(false);
  };

  return (
    <>
      <div className="p-6 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBackClick}
            className="flex items-center text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to {question?.topic?.name || 'Topics'}
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all duration-200 text-sm"
            >
              <Download size={16} />
              <span>Import Question</span>
            </button>
            <button
              onClick={onAddSolution}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 transition-all duration-200"
            >
              <Plus size={18} />
              <span>Add Solution</span>
            </button>
          </div>
        </div>
        
        {question ? (
          <>
            <h1 className="text-2xl font-bold text-slate-100 mb-3">
              {question.title}
            </h1>
            
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  difficultyClass[question.difficulty]
                }`}
              >
                {question.difficulty}
              </span>
              <div className="flex items-center text-sm text-slate-400 space-x-2">
                <Tag size={14} />
                <span>{question.tags?.join(", ") || 'No tags'}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="p-4 rounded-full bg-slate-800 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Download className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-100 mb-2">No Question Loaded</h2>
            <p className="text-slate-400 mb-4">
              Import a LeetCode question to get started
            </p>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
            >
              <Download size={16} />
              <span>Import Question</span>
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import LeetCode Question"
      >
        <QuestionImportForm
          onQuestionImported={handleQuestionImported}
          onCancel={() => setIsImportModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default QuestionHeader;
