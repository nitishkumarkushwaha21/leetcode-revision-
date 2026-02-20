const axios = require("axios");

/**
 * leetcodeService — fetches full problem data from LeetCode's public GraphQL API.
 */

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

// GraphQL query to fetch problem details by slug
const PROBLEM_DETAIL_QUERY = `
  query getProblemDetail($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      title
      titleSlug
      difficulty
      content
      exampleTestcases
      codeSnippets {
        lang
        langSlug
        code
      }
    }
  }
`;

/**
 * Fetches full problem data from LeetCode by title slug.
 * Returns a simplified problem object or null on failure.
 */
async function fetchProblemBySlug(titleSlug) {
  try {
    const response = await axios.post(
      LEETCODE_GRAPHQL_URL,
      {
        query: PROBLEM_DETAIL_QUERY,
        variables: { titleSlug },
      },
      {
        headers: {
          "Content-Type": "application/json",
          // LeetCode requires a referer header to avoid blocks
          Referer: `https://leetcode.com/problems/${titleSlug}/`,
          "User-Agent": "Mozilla/5.0 (compatible; AlgoNoteAI/1.0)",
        },
        timeout: 10000,
      },
    );

    const question = response.data?.data?.question;
    if (!question) return null;

    // Extract JavaScript starter code as the default
    const jsSnippet = question.codeSnippets?.find(
      (s) => s.langSlug === "javascript",
    );
    const starterCode =
      jsSnippet?.code || question.codeSnippets?.[0]?.code || "";

    return {
      title: question.title,
      titleSlug: question.titleSlug,
      difficulty: question.difficulty,
      description: question.content || "",
      exampleTestcases: question.exampleTestcases || "",
      starterCode,
      leetcodeLink: `https://leetcode.com/problems/${question.titleSlug}/`,
    };
  } catch (err) {
    console.error(`LeetCode fetch error for slug "${titleSlug}":`, err.message);
    return null;
  }
}

module.exports = { fetchProblemBySlug };
