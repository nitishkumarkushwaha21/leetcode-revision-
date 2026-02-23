import React from 'react';

const VerdictSection = ({ score, level, message }) => {
  if (score === undefined) return null;

  // Determine colors based on score
  let strokeColor = '#EF4444'; // Red for Beginner
  let gradientClass = 'from-red-500 to-orange-500';
  let badgeColor = 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
  
  if (score >= 70) {
    strokeColor = '#10B981'; // Green for SDE Ready
    gradientClass = 'from-green-500 to-emerald-500';
    badgeColor = 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
  } else if (score >= 40) {
    strokeColor = '#F59E0B'; // Yellow/Orange for Intermediate
    gradientClass = 'from-yellow-400 to-orange-500';
    badgeColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
  }

  // Calculate SVG arc for progress
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-6 mb-6 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
      {/* Decorative background element */}
      <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${gradientClass} opacity-10 dark:opacity-5 rounded-full blur-3xl`} />
      
      <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-6">Profile Verdict</h2>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* Circular Progress Bar */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="transform -rotate-90 w-40 h-40">
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-gray-100 dark:text-gray-700"
            />
            {/* Progress Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={strokeColor}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-gray-800 dark:text-white">{Math.round(score)}</span>
            <span className="text-sm text-gray-600 dark:text-gray-300 font-bold">/ 100</span>
          </div>
        </div>
        
        {/* Verdict Details */}
        <div className="flex-grow text-center md:text-left z-10">
          <div className="mb-3">
            <span className="text-base font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Current Status</span>
            <div className="mt-1 flex items-center justify-center md:justify-start gap-4">
              <h3 className="text-3xl font-extrabold text-gray-800 dark:text-white">{level}</h3>
              <span className={`px-4 py-1.5 text-sm font-bold rounded-full ${badgeColor}`}>
                Score: {Math.round(score)}
              </span>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/40 p-5 rounded-lg border border-gray-100 dark:border-gray-600 mt-5">
            <p className="text-lg text-gray-800 dark:text-gray-200 font-semibold whitespace-pre-line">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerdictSection;
