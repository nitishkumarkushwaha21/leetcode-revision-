// @desc    Fetch question from LeetCode GraphQL API
// @route   POST /api/leetcode/fetch-question
// @access  Private
export const fetchLeetCodeQuestion = async (req, res) => {
  const { slug } = req.body;

  if (!slug) {
    return res.status(400).json({ message: 'Slug is required' });
  }

  try {
    const query = `
      query getQuestion($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          title
          difficulty
          content
          topicTags { name }
        }
      }
    `;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      },
      body: JSON.stringify({ query, variables: { titleSlug: slug } }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({ 
        message: 'Failed to fetch question from LeetCode',
        errors: data.errors 
      });
    }

    if (!data.data || !data.data.question) {
      return res.status(404).json({ 
        message: 'Question not found on LeetCode' 
      });
    }

    res.json(data.data.question);
  } catch (error) {
    console.error('LeetCode API error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch question from LeetCode',
      error: error.message 
    });
  }
};
