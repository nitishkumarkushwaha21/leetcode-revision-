import React from 'react';

const StrengthSection = ({ strongTopics }) => {
  if (!strongTopics || strongTopics.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-6 mb-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center mb-6">
        <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-lg mr-4">
          <span className="text-2xl">💪</span>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">Strong Areas</h2>
      </div>
      <div className="flex flex-wrap gap-4">
        {strongTopics.map((topic, index) => (
          <div key={index} className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-5 py-3 rounded-xl font-bold text-lg border border-green-200 dark:border-green-800/50 flex items-center gap-3 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
            <span>{topic.name}</span>
            <span className="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-300 text-sm px-3 py-1 rounded-full font-bold">{topic.solved} solved</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrengthSection;
