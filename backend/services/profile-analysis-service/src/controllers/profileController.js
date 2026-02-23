const axios = require('axios');
const Revision = require('../models/Revision');

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql/';

// GraphQL query for public profile stats
const USER_STATS_QUERY = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      username
      profile {
        ranking
        reputation
      }
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

const fetchLeetCodeProfile = async (username) => {
  const { data: body } = await axios.post(
    LEETCODE_GRAPHQL,
    { query: USER_STATS_QUERY, variables: { username } },
    {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
    }
  );

  if (body.errors) {
    throw new Error(`User "${username}" not found on LeetCode.`);
  }

  const user = body.data?.matchedUser;
  if (!user) throw new Error(`User "${username}" not found on LeetCode.`);

  const stats = user.submitStats?.acSubmissionNum || [];

  const getCount = (diff) => stats.find((s) => s.difficulty === diff)?.count ?? 0;

  const totalSolved   = getCount('All');
  const easySolved    = getCount('Easy');
  const mediumSolved  = getCount('Medium');
  const hardSolved    = getCount('Hard');

  // Compute acceptance rate from allQuestionsCount totals
  const totalAvailable = body.data?.allQuestionsCount?.find((q) => q.difficulty === 'All')?.count ?? 1;
  const acceptanceRate = ((totalSolved / totalAvailable) * 100).toFixed(1);

  return {
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    acceptanceRate,
    ranking: user.profile?.ranking ?? 0,
    contributionPoints: user.profile?.reputation ?? 0,
    reputation: user.profile?.reputation ?? 0,
  };
};

/**
 * GET /api/profile-analysis/:username
 */
const analyzeProfile = async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) return res.status(400).json({ error: 'Username is required.' });

  try {
    const data = await fetchLeetCodeProfile(username.trim());
    return res.json(data);
  } catch (err) {
    console.error('analyzeProfile error:', err.message);
    if (err.message.includes('not found')) return res.status(404).json({ error: err.message });
    if (err.code === 'ECONNABORTED') return res.status(504).json({ error: 'LeetCode API timed out. Please try again.' });
    return res.status(502).json({ error: 'Could not reach LeetCode. Please try again.' });
  }
};

/**
 * POST /api/profile-analysis/revision
 */
const addRevision = async (req, res) => {
  const { username, problemName, difficulty, leetcodeUrl } = req.body;
  if (!username || !problemName || !difficulty)
    return res.status(400).json({ error: 'username, problemName, and difficulty are required.' });

  try {
    const revision = await Revision.findOneAndUpdate(
      { username: username.toLowerCase().trim(), problemName: problemName.trim() },
      { username: username.toLowerCase().trim(), problemName: problemName.trim(), difficulty, leetcodeUrl: leetcodeUrl || '' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.status(201).json({ message: 'Added to revision', data: revision });
  } catch (err) {
    console.error('addRevision error:', err.message);
    return res.status(500).json({ error: 'Failed to save revision.' });
  }
};

/**
 * GET /api/profile-analysis/revision/:username
 */
const getRevisions = async (req, res) => {
  const { username } = req.params;
  if (!username) return res.status(400).json({ error: 'Username is required.' });
  try {
    const revisions = await Revision.find({ username: username.toLowerCase().trim() }).sort({ createdAt: -1 });
    return res.json({ data: revisions });
  } catch (err) {
    console.error('getRevisions error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch revisions.' });
  }
};

/**
 * DELETE /api/profile-analysis/revision/:id
 */
const deleteRevision = async (req, res) => {
  try {
    const deleted = await Revision.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Revision not found.' });
    return res.json({ message: 'Removed from revision', data: deleted });
  } catch (err) {
    console.error('deleteRevision error:', err.message);
    return res.status(500).json({ error: 'Failed to delete revision.' });
  }
};

module.exports = { analyzeProfile, addRevision, getRevisions, deleteRevision };
