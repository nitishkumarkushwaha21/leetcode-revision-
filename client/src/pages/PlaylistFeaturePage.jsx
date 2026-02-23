import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Youtube,
  Sparkles,
  Loader2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Trash2,
  BookOpen,
  ListVideo,
  ArrowRight,
  FolderPlus,
  CheckCircle2,
} from "lucide-react";
import playlistApi from "../services/playlistApi";

// ── Difficulty badge ─────────────────────────────────────────────────────────
const DifficultyBadge = ({ difficulty }) => {
  const map = {
    Easy: "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-400/10 border-green-200 dark:border-green-500/30",
    Medium: "text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-400/10 border-yellow-200 dark:border-yellow-500/30",
    Hard: "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-400/10 border-red-200 dark:border-red-500/30",
  };
  const cls = map[difficulty] || "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700";
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${cls}`}>
      {difficulty || "Unknown"}
    </span>
  );
};

// ── Single problem row ────────────────────────────────────────────────────────
const ProblemRow = ({ problem, index }) => {
  const navigate = useNavigate();

  const handleOpen = () => {
    // Opens the problem in the existing ProblemWorkspace editor.
    // The problem must exist in the file system; for a playlist-sourced
    // problem we open the LeetCode link in a new tab as a fallback since
    // the problem hasn't been imported into the local file system yet.
    if (problem.leetcode_link) {
      window.open(problem.leetcode_link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow transition-all group"
    >
      {/* Index */}
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 shrink-0">
        {index + 1}
      </div>

      {/* Title */}
      <span 
        className="flex-1 text-base text-gray-800 dark:text-gray-200 font-semibold truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" 
        onClick={handleOpen}
      >
        {problem.title}
      </span>

      {/* Confidence */}
      {problem.confidence_score != null && (
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0 hidden sm:block bg-gray-100 dark:bg-gray-700/50 px-2.5 py-1 rounded-lg">
          {Math.round(problem.confidence_score * 100)}% match
        </span>
      )}

      {/* Difficulty */}
      <div className="shrink-0 w-20 flex justify-center">
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      {/* YouTube link */}
      {problem.youtube_link && (
        <a
          href={problem.youtube_link}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-2 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors"
          title="Watch on YouTube"
          onClick={(e) => e.stopPropagation()}
        >
          <Youtube size={18} />
        </a>
      )}

      {/* Open button */}
      <button
        onClick={handleOpen}
        className="shrink-0 flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
        title="Open on LeetCode"
      >
        Open
        <ExternalLink size={14} />
      </button>
    </motion.div>
  );
};

// ── Sheet card (collapsed / expanded) ────────────────────────────────────────
const SheetCard = ({ sheet, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [folderCreated, setFolderCreated] = useState(false);
  const [folderError, setFolderError] = useState(null);
  const navigate = useNavigate();

  const handleExpand = async () => {
    if (!expanded && problems.length === 0) {
      setLoading(true);
      try {
        const { data } = await playlistApi.getSheet(sheet.id);
        setProblems(data.problems || []);
      } catch (_) {
        setProblems([]);
      } finally {
        setLoading(false);
      }
    }
    setExpanded((v) => !v);
  };

  const handleCreateFolder = async (e) => {
    e.stopPropagation();
    setIsCreatingFolder(true);
    setFolderError(null);
    try {
      await playlistApi.createFolderFromSheet(sheet.id);
      setFolderCreated(true);
      // Navigate to home so user sees the new folder in the explorer
      navigate("/");
    } catch (err) {
      setFolderError(
        err.response?.data?.error || err.message || "Failed to create folder",
      );
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const easyCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardCount = problems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700 overflow-hidden mb-6 transition-all hover:shadow-lg">
      {/* Header */}
      <button
        className="w-full flex items-center gap-4 px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
        onClick={handleExpand}
      >
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg shrink-0">
          <BookOpen size={24} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
            {sheet.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
            {sheet.playlist_url}
          </p>
        </div>

        {/* Stats — visible once loaded */}
        {problems.length > 0 && (
          <div className="hidden sm:flex items-center gap-3 shrink-0 mr-4">
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold">{easyCount} Easy</span>
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-bold">{mediumCount} Med</span>
            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold">{hardCount} Hard</span>
          </div>
        )}

        <span className="text-sm font-medium text-gray-400 dark:text-gray-500 shrink-0 hidden md:block">
          {new Date(sheet.created_at).toLocaleDateString()}
        </span>

        {/* Add to Explorer */}
        <button
          className={`shrink-0 flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ml-4 shadow-sm hover:shadow ${
            folderCreated
              ? "bg-green-500 hover:bg-green-600 text-white cursor-default"
              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/50"
          }`}
          title={
            folderCreated
              ? "Folder already created"
              : "Create folder in File Explorer"
          }
          onClick={handleCreateFolder}
          disabled={isCreatingFolder || folderCreated}
        >
          {isCreatingFolder ? (
            <Loader2 size={16} className="animate-spin" />
          ) : folderCreated ? (
            <CheckCircle2 size={16} />
          ) : (
            <FolderPlus size={16} />
          )}
          <span className="hidden sm:inline">
            {isCreatingFolder ? "Creating…" : folderCreated ? "Added!" : "Add to Explorer"}
          </span>
        </button>

        {/* Delete */}
        <button
          className="shrink-0 p-2.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-2"
          title="Delete sheet"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(sheet.id);
          }}
        >
          <Trash2 size={18} />
        </button>

        <div className="ml-2 p-1">
          {expanded ? (
            <ChevronUp size={20} className="text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-400" />
          )}
        </div>
      </button>

      {/* Folder creation error */}
      {folderError && (
        <div className="px-6 py-3 bg-red-50 dark:bg-red-900/10 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 border-t border-red-100 dark:border-red-900/30">
          <AlertCircle size={16} />
          {folderError}
        </div>
      )}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-12 gap-3 text-gray-500 dark:text-gray-400">
                  <Loader2 size={24} className="animate-spin text-blue-500" />
                  <span className="text-base font-medium">Loading problems…</span>
                </div>
              ) : problems.length === 0 ? (
                <p className="text-base text-gray-500 dark:text-gray-400 text-center py-10">
                  No problems found in this sheet.
                </p>
              ) : (
                problems.map((problem, i) => (
                  <ProblemRow key={problem.id} problem={problem} index={i} />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main Page ───────────────────────────────────────────────────────────────
const PlaylistFeaturePage = () => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null); // { sheetId, sheetName, totalVideos, savedProblems }
  const [sheets, setSheets] = useState([]);
  const [loadingSheets, setLoadingSheets] = useState(true);

  // Fetch existing sheets on mount
  const loadSheets = useCallback(async () => {
    try {
      const { data } = await playlistApi.getAllSheets();
      setSheets(data.sheets || []);
    } catch (_) {
      // Non-critical — just show empty state
      setSheets([]);
    } finally {
      setLoadingSheets(false);
    }
  }, []);

  useEffect(() => {
    loadSheets();
  }, [loadSheets]);

  // ── Generate sheet ─────────────────────────────────────────────────────────
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!playlistUrl.trim()) return;

    setIsGenerating(true);
    setError(null);
    setSuccessInfo(null);

    try {
      const { data } = await playlistApi.importPlaylist(playlistUrl.trim());
      setSuccessInfo(data);
      setPlaylistUrl("");
      // Refresh sheets list
      await loadSheets();
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || "Something went wrong";
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Delete sheet ───────────────────────────────────────────────────────────
  const handleDelete = async (sheetId) => {
    if (!confirm("Delete this sheet and all its problems?")) return;
    try {
      await playlistApi.deleteSheet(sheetId);
      setSheets((prev) => prev.filter((s) => s.id !== sheetId));
    } catch (_) {
      alert("Failed to delete sheet.");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <Youtube size={28} />
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Playlist → DSA Sheet
            </h1>
          </div>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 ml-2">
            Paste a YouTube DSA playlist URL and let AI generate a structured
            LeetCode study sheet.
          </p>
        </div>

        {/* ── Import form ── */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] p-8 border border-gray-100 dark:border-gray-700 space-y-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white tracking-wide flex items-center gap-2">
            <Sparkles size={20} className="text-blue-500" /> Import YouTube Playlist
          </h2>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                YouTube Playlist URL
              </label>
              <input
                type="url"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                placeholder="https://www.youtube.com/playlist?list=PLxxxxxx"
                disabled={isGenerating}
                required
                className="w-full px-5 py-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all text-base placeholder-gray-400 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating || !playlistUrl.trim()}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold text-lg transition-colors shadow-sm hover:shadow"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating Sheet… (this may take a minute)
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Sheet
                </>
              )}
            </button>
          </form>

          {/* Generation progress hint */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 mt-4 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-5 py-4 border border-gray-200 dark:border-gray-600"
            >
              <Loader2
                size={18}
                className="animate-spin mt-0.5 shrink-0 text-blue-500"
              />
              <span>
                Fetching playlist videos → Identifying LeetCode problems with AI
                → Pulling problem data…
                <br />
                Large playlists can take a few minutes. Please don't close this
                tab.
              </span>
            </motion.div>
          )}

          {/* Error state */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 mt-4 text-base text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-lg px-5 py-4"
              >
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success state */}
          <AnimatePresence>
            {successInfo && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 mt-4 text-base text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50 rounded-lg px-5 py-4"
              >
                <Sparkles size={20} className="mt-0.5 shrink-0" />
                <span>
                  <strong>{successInfo.sheetName}</strong> created!&nbsp;
                  {successInfo.savedProblems} problems identified from{" "}
                  {successInfo.totalVideos} videos.
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Sheets list ── */}
        <div className="space-y-6 mt-12 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg">
              <ListVideo size={24} className="text-indigo-600 dark:text-indigo-400" />
            </span>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Your Generated Sheets
            </h2>
          </div>

          {loadingSheets ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500 dark:text-gray-400">
              <Loader2 size={32} className="animate-spin text-blue-500" />
              <span className="text-lg">Loading your sheets…</span>
            </div>
          ) : sheets.length === 0 ? (
            <div className="text-center py-20 rounded-2xl bg-white dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 shadow-sm">
              <Youtube size={48} className="text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No sheets yet</h3>
              <p className="text-base text-gray-500 dark:text-gray-400">
                Import a playlist above to generate your first study sheet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sheets.map((sheet) => (
                <SheetCard
                  key={sheet.id}
                  sheet={sheet}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistFeaturePage;
