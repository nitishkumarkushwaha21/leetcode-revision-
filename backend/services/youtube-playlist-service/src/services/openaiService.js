const OpenAI = require("openai");

/**
 * openaiService — uses OpenAI to identify the LeetCode problem from a YouTube video title.
 */

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Given a DSA tutorial video title, asks GPT to identify the corresponding LeetCode problem.
 * Returns: { title, titleSlug, difficulty, confidence }
 * Returns null if no problem could be identified.
 */
async function identifyLeetCodeProblem(videoTitle) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }

  const prompt = `Given the following YouTube video title from a DSA tutorial playlist, identify the exact LeetCode problem.

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "title": "string - the exact LeetCode problem title",
  "titleSlug": "string - the LeetCode URL slug (e.g. two-sum)",
  "difficulty": "string - Easy | Medium | Hard",
  "confidence": number between 0 and 1
}

If you cannot identify a specific LeetCode problem from this title, return:
{ "title": null, "titleSlug": null, "difficulty": null, "confidence": 0 }

Video Title: ${videoTitle}`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 200,
    });

    const raw = response.choices[0]?.message?.content?.trim();
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed.titleSlug) return null;

    return parsed;
  } catch (err) {
    console.error(`OpenAI error for title "${videoTitle}":`, err.message);
    return null;
  }
}

module.exports = { identifyLeetCodeProblem };
