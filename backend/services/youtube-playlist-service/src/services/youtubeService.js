const axios = require("axios");

/**
 * youtubeService — fetches video list from a YouTube playlist using the YouTube Data API v3.
 */

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

/**
 * Extracts the playlist ID from a YouTube playlist URL.
 * Supports formats like:
 *  - https://www.youtube.com/playlist?list=PLxxxx
 *  - https://youtube.com/playlist?list=PLxxxx
 */
function extractPlaylistId(url) {
  try {
    const parsed = new URL(url);
    const listParam = parsed.searchParams.get("list");
    if (!listParam) throw new Error("No playlist ID found in URL");
    return listParam;
  } catch (err) {
    throw new Error(`Invalid YouTube playlist URL: ${err.message}`);
  }
}

/**
 * Fetches all videos from a playlist, handling pagination automatically.
 * Returns an array of { videoTitle, videoUrl } objects.
 */
async function fetchPlaylistVideos(playlistUrl) {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YOUTUBE_API_KEY is not set in environment variables");
  }

  const playlistId = extractPlaylistId(playlistUrl);
  const videos = [];
  let nextPageToken = null;

  do {
    const params = {
      part: "snippet",
      playlistId,
      maxResults: 50,
      key: YOUTUBE_API_KEY,
    };
    if (nextPageToken) params.pageToken = nextPageToken;

    const response = await axios.get(`${YOUTUBE_API_BASE}/playlistItems`, {
      params,
    });
    const items = response.data.items || [];

    for (const item of items) {
      const snippet = item.snippet;
      const videoId = snippet?.resourceId?.videoId;
      if (!videoId) continue;

      videos.push({
        videoTitle: snippet.title,
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      });
    }

    nextPageToken = response.data.nextPageToken || null;
  } while (nextPageToken);

  return videos;
}

module.exports = { fetchPlaylistVideos };
