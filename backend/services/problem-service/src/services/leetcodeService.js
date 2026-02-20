const axios = require("axios");

const LEETCODE_API_ENDPOINT = "https://leetcode.com/graphql";

const getLeetCodeQuestion = async (slug) => {
    const query = `
    query getQuestion($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        title
        titleSlug
        content
        difficulty
        exampleTestcases
        codeSnippets {
          lang
          code
        }
        topicTags {
          name
          slug
        }
      }
    }
  `;

    try {
        const response = await axios.post(
            LEETCODE_API_ENDPOINT,
            {
                query,
                variables: { titleSlug: slug }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }
            }
        );

        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }

        return response.data.data.question;
    } catch (error) {
        console.error("Error fetching LeetCode question:", error.message);
        throw error;
    }
};

module.exports = { getLeetCodeQuestion };
