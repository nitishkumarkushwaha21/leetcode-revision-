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
    Easy: "text-green-400 bg-green-400/10 border-green-500/30",
    Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-500/30",
    Hard: "text-red-400 bg-red-400/10 border-red-500/30",
  };
  const cls =
    map[difficulty] || "text-gray-400 bg-neutral-800 border-neutral-700";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${cls}`}>
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
      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors group"
    >
      {/* Index */}
      <span className="text-xs text-gray-600 font-mono w-6 shrink-0">
        {index + 1}
      </span>

      {/* Title */}
      <span className="flex-1 text-sm text-gray-200 font-medium truncate">
        {problem.title}
      </span>

      {/* Confidence */}
      {problem.confidence_score != null && (
        <span className="text-xs text-gray-500 shrink-0">
          {Math.round(problem.confidence_score * 100)}% match
        </span>
      )}

      {/* Difficulty */}
      <div className="shrink-0">
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      {/* YouTube link */}
      {problem.youtube_link && (
        <a
          href={problem.youtube_link}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-1.5 rounded text-red-500 hover:bg-red-500/10 transition-colors"
          title="Watch on YouTube"
          onClick={(e) => e.stopPropagation()}
        >
          <Youtube size={15} />
        </a>
      )}

      {/* Open button */}
      <button
        onClick={handleOpen}
        className="shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        title="Open on LeetCode"
      >
        Open
        <ArrowRight size={12} />
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
    <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900">
      {/* Header */}
      <button
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-neutral-800/50 transition-colors text-left"
        onClick={handleExpand}
      >
        <BookOpen size={18} className="text-blue-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {sheet.name}
          </p>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {sheet.playlist_url}
          </p>
        </div>

        {/* Stats — visible once loaded */}
        {problems.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <span className="text-xs text-green-400">{easyCount}E</span>
            <span className="text-xs text-yellow-400">{mediumCount}M</span>
            <span className="text-xs text-red-400">{hardCount}H</span>
          </div>
        )}

        <span className="text-xs text-gray-500 shrink-0 ml-2">
          {new Date(sheet.created_at).toLocaleDateString()}
        </span>

        {/* Add to Explorer */}
        <button
          className={`shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors ml-2 ${
            folderCreated
              ? "bg-green-600/20 text-green-400 border border-green-500/30 cursor-default"
              : "bg-neutral-700 hover:bg-neutral-600 text-gray-300 hover:text-white"
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
            <Loader2 size={12} className="animate-spin" />
          ) : folderCreated ? (
            <CheckCircle2 size={12} />
          ) : (
            <FolderPlus size={12} />
          )}
          {isCreatingFolder
            ? "Creating…"
            : folderCreated
              ? "Added!"
              : "Add to Explorer"}
        </button>

        {/* Delete */}
        <button
          className="shrink-0 p-1.5 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors ml-1"
          title="Delete sheet"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(sheet.id);
          }}
        >
          <Trash2 size={14} />
        </button>

        {expanded ? (
          <ChevronUp size={16} className="text-gray-500 shrink-0 ml-1" />
        ) : (
          <ChevronDown size={16} className="text-gray-500 shrink-0 ml-1" />
        )}
      </button>

      {/* Folder creation error */}
      {folderError && (
        <div className="px-5 pb-2 flex items-center gap-2 text-xs text-red-400">
          <AlertCircle size={12} />
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
            <div className="px-4 pb-4 border-t border-neutral-800 pt-3 space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-gray-500">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Loading problems…</span>
                </div>
              ) : problems.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">
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
    <div className="h-full overflow-y-auto bg-neutral-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">
        {/* ── Header ── */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-blue-600/15 border border-blue-500/20">
              <Youtube size={22} className="text-blue-400" />
            </span>
            <h1 className="text-2xl font-bold text-white">
              Playlist → DSA Sheet
            </h1>
          </div>
          <p className="text-sm text-gray-500 ml-1">
            Paste a YouTube DSA playlist URL and let AI generate a structured
            LeetCode study sheet.
          </p>
        </div>

        {/* ── Import form ── */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Import YouTube Playlist
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase font-bold mb-2">
                YouTube Playlist URL
              </label>
              <input
                type="url"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                placeholder="https://www.youtube.com/playlist?list=PLxxxxxx"
                disabled={isGenerating}
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating || !playlistUrl.trim()}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating Sheet… (this may take a minute)
                </>
              ) : (
                <>
                  <Sparkles size={16} />
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
              className="flex items-start gap-2 text-xs text-gray-500 bg-neutral-800/60 rounded-lg px-4 py-3"
            >
              <Loader2
                size={12}
                className="animate-spin mt-0.5 shrink-0 text-blue-400"
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
                className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
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
                className="flex items-start gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3"
              >
                <Sparkles size={15} className="mt-0.5 shrink-0" />
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
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ListVideo size={17} className="text-gray-500" />
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Your Generated Sheets
            </h2>
          </div>

          {loadingSheets ? (
            <div className="flex items-center justify-center py-12 gap-2 text-gray-600">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading sheets…</span>
            </div>
          ) : sheets.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-dashed border-neutral-800">
              <Youtube size={32} className="text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-600">
                No sheets yet. Import a playlist to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
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
