const { getLeetCodeQuestion } = require("../services/leetcodeService");
const { htmlToText } = require("html-to-text");

exports.importLeetCodeProblem = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    // Extract slug from URL
    // Expected format: https://leetcode.com/problems/two-sum/ or .../two-sum
    const parts = url.split("/").filter((part) => part !== "");
    const slugIndex = parts.indexOf("problems");

    let slug;
    if (slugIndex !== -1 && slugIndex + 1 < parts.length) {
      slug = parts[slugIndex + 1];
    } else {
      return res.status(400).json({ message: "Invalid LeetCode URL" });
    }

    console.log(`Fetching LeetCode problem: ${slug}`);
    const questionData = await getLeetCodeQuestion(slug);

    if (!questionData) {
      return res
        .status(404)
        .json({ message: "Problem not found regarding this slug" });
    }

    // Clean HTML content to text (optional, but requested)
    // We might want to keep HTML for rich text display, but let's provide both or just clean if requested.
    // The user's example showed cleaning it. I'll store the clean text in description for now,
    // or maybe we should store HTML in description and clean text in a new field?
    // The attributes in Problem model are: description (TEXT).
    // I'll store the HTML in description because it's usually better for display.
    // Wait, the user said "Convert HTML to Clean Text... const cleanText = htmlToText(htmlContent)".
    // I will return the data to the frontend, and let the frontend decide what to save or save it directly.
    // Actually, the user flow says: extract -> graphql -> save -> return.

    // However, to save, we need a fileId.
    // IF this is a pure import to get data, we should just return the data.
    // IF we want to save immediately, we need a fileId.
    // The frontend triggers this. usage: "POST /api/problems/import" with body { link }.

    // I will return the data so the frontend can create the file and THEN save the problem details.
    // OR, I can accept a fileId if provided to save it.

    // Let's stick to: Return the data. The frontend will then call createProblem/updateProblem.
    // This decouples the "fetching" from the "saving" which is robust.

    const cleanDescription = htmlToText(questionData.content, {
      wordwrap: 130,
    });

    const formattedData = {
      title: questionData.title,
      slug: questionData.titleSlug,
      difficulty: questionData.difficulty,
      description: questionData.content, // Keep HTML for rich display
      descriptionText: cleanDescription, // Clean text if needed
      exampleTestcases: questionData.exampleTestcases || "", // Keep as string
      codeSnippets: questionData.codeSnippets || [],
      tags: questionData.topicTags || [],
    };

    res.json(formattedData);
  } catch (error) {
    console.error("Import Error:", error);
    res.status(500).json({ message: "Failed to import problem" });
  }
};
