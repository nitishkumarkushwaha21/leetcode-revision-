import React, { useState } from 'react';
import  api  from '../../services/api.js';
import { Loader2 } from 'lucide-react';

export default function TopicForm({ onFormSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/topics', { name, description });
      onFormSubmit();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create topic.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       {error && <div className="p-3 bg-red-900/20 text-red-300 border border-red-600 rounded-lg text-sm">{error}</div>}
      <div>
        <label htmlFor="topic-name" className="block text-sm font-medium text-gray-300 mb-1">
          Topic Name
        </label>
        <input
          id="topic-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          placeholder="e.g., Arrays"
          required
        />
      </div>
      <div>
        <label htmlFor="topic-description" className="block text-sm font-medium text-gray-300 mb-1">
          Description (Optional)
        </label>
        <textarea
          id="topic-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          placeholder="A short description of the topic"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center disabled:opacity-50"
        >
          {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
          {isLoading ? 'Creating...' : 'Create Topic'}
        </button>
      </div>
    </form>
  );
}
