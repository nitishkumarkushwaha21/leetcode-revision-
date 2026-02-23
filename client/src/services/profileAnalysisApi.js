import axios from 'axios';

const BASE_URL = '/api/profile-analysis';

const profileAnalysisApi = {
  /**
   * Fetch a LeetCode user's profile stats
   * @param {string} username
   */
  analyzeProfile: (username) => axios.get(`${BASE_URL}/${username}`),

  /**
   * Add a problem to the user's revision list
   * @param {{ username, problemName, difficulty, leetcodeUrl }} body
   */
  addRevision: (body) => axios.post(`${BASE_URL}/revision`, body),

  /**
   * Get all revision problems for a user
   * @param {string} username
   */
  getRevisions: (username) => axios.get(`${BASE_URL}/revision/${username}`),

  /**
   * Remove a revision problem by its MongoDB _id
   * @param {string} id
   */
  deleteRevision: (id) => axios.delete(`${BASE_URL}/revision/${id}`),
};

export default profileAnalysisApi;
