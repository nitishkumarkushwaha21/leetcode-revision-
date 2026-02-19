import React, { useState } from 'react';
import  api  from '../../services/api';
import { Loader2 } from 'lucide-react';

export default function SolutionForm({ questionId, onCancel, onFormSubmit }) {
  const [formData, setFormData] = useState({
    logic: '',
    code: '',
    language: 'javascript',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post(`/questions/${questionId}/solutions`, formData);
      onFormSubmit();
    } catch (err) {
      console.error("Failed to submit solution:", err);
      setError(err.response?.data?.message || 'Failed to submit solution. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      {error && <div className="p-3 bg-red-900/40 text-red-300 border border-red-700 rounded-md">{error}</div>}
      
      <div>
        <label htmlFor="logic" className="block mb-1 font-medium text-gray-300">Logic / Approach</label>
        <input
          id="logic"
          name="logic"
          type="text"
          value={formData.logic}
          onChange={handleChange}
          required
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
          placeholder="e.g., Two Pointers with a Set"
        />
      </div>

      <div>
        <label htmlFor="code" className="block mb-1 font-medium text-gray-300">Code</label>
        <textarea
          id="code"
          name="code"
          rows="10"
          value={formData.code}
          onChange={handleChange}
          required
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
          placeholder="Paste your code solution here..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
            <label htmlFor="language" className="block mb-1 font-medium text-gray-300">Language</label>
            <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="cpp">C++</option>
                <option value="typescript">TypeScript</option>
                <option value="go">Go</option>
            </select>
        </div>
        <div>
            <label htmlFor="timeComplexity" className="block mb-1 font-medium text-gray-300">Time Complexity</label>
            <input
                id="timeComplexity"
                name="timeComplexity"
                type="text"
                value={formData.timeComplexity}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="e.g., O(n)"
            />
        </div>
        <div>
            <label htmlFor="spaceComplexity" className="block mb-1 font-medium text-gray-300">Space Complexity</label>
            <input
                id="spaceComplexity"
                name="spaceComplexity"
                type="text"
                value={formData.spaceComplexity}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                placeholder="e.g., O(1)"
            />
        </div>
      </div>

       <div>
        <label htmlFor="notes" className="block mb-1 font-medium text-gray-300">Additional Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
          placeholder="Any tricks, alternative approaches, or important details..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors flex items-center disabled:opacity-50">
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
          {isLoading ? 'Saving...' : 'Save Solution'}
        </button>
      </div>
    </form>
  );
}
