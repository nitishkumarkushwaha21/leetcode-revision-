import React, { useState } from 'react';

// Extract plain username from a full LeetCode URL or return as-is
const extractUsername = (input) => {
  const trimmed = input.trim();
  try {
    // Match both formats:
    //   https://leetcode.com/u/username/
    //   https://leetcode.com/username/
    const match = trimmed.match(/leetcode\.com\/(?:u\/)?([^/?#]+)/);
    if (match && match[1]) return match[1].replace(/\/$/, '');
  } catch (_) {}
  return trimmed; // Already a plain username
};

const ProfileInput = ({ onAnalyze, isLoading }) => {
  const [input, setInput] = useState('');
  const parsedUsername = extractUsername(input);
  const isUrl = input.trim().startsWith('http');

  const handleAnalyze = () => {
    const username = extractUsername(input);
    if (username) onAnalyze(username);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-6 mb-6 mt-4 border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Analyze LeetCode Profile</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow flex flex-col gap-1">
          <input
            type="text"
            placeholder="Enter username or paste leetcode.com profile URL..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && input.trim() && handleAnalyze()}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all text-base"
          />
          {/* Show extracted username preview when URL is pasted */}
          {isUrl && parsedUsername && (
            <p className="text-xs text-green-600 dark:text-green-400 ml-1">
              ✓ Username detected: <strong>{parsedUsername}</strong>
            </p>
          )}
        </div>
        <button
          onClick={handleAnalyze}
          disabled={!input.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center min-w-[140px] shadow-sm hover:shadow self-start"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Analyze'
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfileInput;
