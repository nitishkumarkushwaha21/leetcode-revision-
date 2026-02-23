import React from 'react';

const WeaknessSection = ({ weakTopics }) => {
  if (!weakTopics || weakTopics.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-6 mb-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center mb-2">
        <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mr-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">Weak Areas</h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6 ml-16 text-base font-medium">Focus on these topics to improve your coding profile.</p>
      
      <div className="flex flex-wrap gap-4">
        {weakTopics.map((topic, index) => (
          <div key={index} className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-5 py-3 rounded-xl font-bold text-lg border border-red-200 dark:border-red-800/50 flex items-center gap-3 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
            <span>{topic.name}</span>
            <span className="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-300 text-sm px-3 py-1 rounded-full font-bold">{topic.solved} solved</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeaknessSection;
