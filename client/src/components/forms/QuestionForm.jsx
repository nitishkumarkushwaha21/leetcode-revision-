import React, { useState } from 'react';
import api from '../../services/api';

const difficultyOptions = ['Easy', 'Medium', 'Hard'];

export default function QuestionForm({ topicId, question, onFormSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: question?.title || '',
    description: question?.description || '',
    url: question?.url || '',
    difficulty: question?.difficulty || 'Medium',
    tags: question?.tags?.join(', ') || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      topic: topicId,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    try {
      // Logic to either create a new question or update an existing one
      // const response = question?.id 
      //   ? await api.put(`/api/questions/${question.id}`, payload)
      //   : await api.post('/api/questions', payload);

      console.log('Form submitted (mock):', payload);
      onFormSubmit(); // This would trigger a data refresh
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save question.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Question Title (e.g., Two Sum)"
        required
        className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Question description in Markdown format..."
        rows="6"
        required
        className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
      />
      <input
        name="url"
        value={formData.url}
        onChange={handleChange}
        placeholder="LeetCode URL (optional)"
        className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
      />
      <div className="flex gap-4">
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
        >
          {difficultyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <input
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (comma-separated)"
          className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-md text-white bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Question'}
        </button>
      </div>
    </form>
  );
}
