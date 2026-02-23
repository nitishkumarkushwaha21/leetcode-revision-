import React, { useState } from 'react';

const RecommendationSection = ({ recommendations, onAddToRevision }) => {
  const [addingState, setAddingState] = useState({});

  if (!recommendations || Object.keys(recommendations).length === 0) return null;

  const handleAdd = async (problem, topic) => {
    const key = `${topic}-${problem.name}`;
    setAddingState(prev => ({ ...prev, [key]: 'adding' }));
    
    try {
      await onAddToRevision(problem, topic);
      setAddingState(prev => ({ ...prev, [key]: 'added' }));
      setTimeout(() => {
        setAddingState(prev => ({ ...prev, [key]: null }));
      }, 2000);
    } catch (error) {
      setAddingState(prev => ({ ...prev, [key]: 'error' }));
      setTimeout(() => {
        setAddingState(prev => ({ ...prev, [key]: null }));
      }, 3000);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/40 dark:text-yellow-400';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-6 mb-6 border border-gray-100 dark:border-neutral-800">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-lg mr-4">
          <span className="text-2xl">🎯</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">Smart Recommendations</h2>
      </div>

      <div className="space-y-6">
        {Object.entries(recommendations).map(([topic, problems]) => (
          <div key={topic} className="border dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-50 dark:bg-neutral-950 px-5 py-3 border-b dark:border-neutral-800">
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
                Focus: <span className="text-blue-600 dark:text-blue-400">{topic}</span>
              </h3>
            </div>
            <div className="divide-y dark:divide-neutral-800">
              {problems.map((prob, idx) => {
                const addKey = `${topic}-${prob.name}`;
                const state = addingState[addKey];
                
                return (
                  <div key={idx} className="px-5 flex flex-row items-center justify-between gap-4 py-3 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800/80 transition-colors">
                    <div className="flex items-center gap-4 flex-grow truncate">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-800 text-sm font-bold text-gray-600 dark:text-gray-300 shrink-0">
                        {idx + 1}
                      </div>
                      <a 
                        href={prob.leetcodeUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-base font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                      >
                        {prob.name}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap ${getDifficultyColor(prob.difficulty)}`}>
                        {prob.difficulty}
                      </span>
                      <button
                        onClick={() => handleAdd(prob, topic)}
                        disabled={state === 'adding' || state === 'added'}
                        className={`
                          min-w-[140px] px-4 py-1.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2
                          ${state === 'added' ? 'bg-green-500 hover:bg-green-600 text-white' : 
                            state === 'error' ? 'bg-red-500 hover:bg-red-600 text-white' : 
                            'bg-indigo-50 dark:bg-neutral-800 text-indigo-700 dark:text-white hover:bg-indigo-100 dark:hover:bg-neutral-700 border border-indigo-200 dark:border-neutral-700'}
                        `}
                      >
                        {state === 'adding' ? (
                          <><div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> Adding...</>
                        ) : state === 'added' ? (
                          <><span>✓</span> Added to Revision</>
                        ) : state === 'error' ? (
                          <><span>✕</span> Failed</>
                        ) : (
                          <><span>+</span> Add to Revision</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationSection;
