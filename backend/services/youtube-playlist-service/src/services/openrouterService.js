const axios = require("axios");

/**
 * openrouterService — uses OpenRouter API with DeepSeek to identify
 * the LeetCode problem from a YouTube video title.
 */

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-chat";

/**
 * Given a DSA tutorial video title, asks DeepSeek (via OpenRouter) to
 * identify the corresponding LeetCode problem.
 *
 * Returns: { title, titleSlug, difficulty, confidence }
 * Returns null if no problem could be identified or on error.
 */
async function identifyLeetCodeProblem(videoTitle) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables");
  }

  const prompt = `Match this YouTube DSA video title to exact LeetCode problem. Return ONLY a valid JSON object (no markdown, no explanation):
{
  "title": "string - the exact LeetCode problem title",
  "titleSlug": "string - the LeetCode URL slug (e.g. two-sum)",
  "difficulty": "string - Easy | Medium | Hard",
  "confidence": number between 0 and 1
}

If you cannot identify a specific LeetCode problem, return:
{ "title": null, "titleSlug": null, "difficulty": null, "confidence": 0 }

Title: ${videoTitle}`;

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      },
    );

    const raw = response.data?.choices?.[0]?.message?.content?.trim();
    if (!raw) return null;

    // Strip markdown code fences if the model wraps the JSON
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    if (!parsed.titleSlug) return null;

    return parsed;
  } catch (err) {
    console.error(`OpenRouter error for title "${videoTitle}":`, err.message);
    return null;
  }
}

module.exports = { identifyLeetCodeProblem };
