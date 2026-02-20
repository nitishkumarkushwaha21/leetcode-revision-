import React, { useState, useEffect } from "react";
import {
  Panel,
  Group as PanelGroup,
  Separator as PanelResizeHandle,
} from "react-resizable-panels";
import useFileStore from "../../store/useFileStore";
import { fileService } from "../../services/api";
import CodeEditor from "../editor/CodeEditor";
import { clsx } from "clsx";
import { Loader2, ExternalLink } from "lucide-react";

const TABS = [
  { id: "brute", label: "Brute Force" },
  { id: "better", label: "Better" },
  { id: "optimal", label: "Optimal" },
];

import { useParams } from "react-router-dom";

// ...

const ProblemWorkspace = () => {
  const { id } = useParams();
  const {
    fileSystem,
    updateFileContent,
    setActiveFile,
    updateFileAnalysis,
    activeFileId,
  } = useFileStore();
  const [activeTab, setActiveTab] = useState("optimal");
  const [isImporting, setIsImporting] = useState(false);

  // Helper to find file by ID
  const findFile = (items, targetId) => {
    for (const item of items) {
      if (item.id == targetId) return item;
      if (item.children) {
        const found = findFile(item.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const activeFile = id ? findFile(fileSystem, id) : null;
  const [localLink, setLocalLink] = useState(activeFile?.link || "");

  useEffect(() => {
    if (activeFile && activeFile.link !== localLink && !isImporting) {
      setLocalLink(activeFile.link || "");
    }
  }, [activeFile?.link]);

  useEffect(() => {
    if (id && (!activeFileId || activeFileId != id)) {
      setActiveFile(id);
      useFileStore.getState().clearExpandedFolders();
    }
  }, [id, setActiveFile, activeFileId]);

  // Wait for file system to load before declaring a file missing
  const { isLoading, fileSystem: allFiles } = useFileStore();
  if (isLoading || (allFiles.length === 0 && id)) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-neutral-900">
        <Loader2 className="animate-spin mb-4" size={32} />
        Loading workspace...
      </div>
    );
  }

  if (!activeFile)
    return (
      <div className="h-full flex items-center justify-center text-gray-500 bg-neutral-900">
        Problem not found.
      </div>
    );

  const handleCodeChange = (newCode) => {
    updateFileContent(activeFileId, activeTab, newCode);
  };

  const handleTimeChange = (e) => {
    updateFileAnalysis(activeFileId, {
      time: e.target.value,
      space: activeFile.analysis?.space || "",
      explanation: activeFile.analysis?.explanation || "",
    });
  };

  const handleSpaceChange = (e) => {
    updateFileAnalysis(activeFileId, {
      time: activeFile.analysis?.time || "",
      space: e.target.value,
      explanation: activeFile.analysis?.explanation || "",
    });
  };

  return (
    <PanelGroup direction="horizontal" className="h-full group">
      {/* Left Panel: Problem Description */}
      <Panel
        defaultSize={40}
        minSize={20}
        className="bg-neutral-900 border-r border-neutral-800"
      >
        <div className="h-full p-6 overflow-y-auto">
          <div className="mb-6 border-b border-neutral-800 pb-4">
            <h1 className="text-3xl font-bold mb-2 text-white">
              {activeFile.title || activeFile.name}
            </h1>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                {activeFile.difficulty && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                      activeFile.difficulty === "Easy"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : activeFile.difficulty === "Medium"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    {activeFile.difficulty}
                  </span>
                )}
                {activeFile.tags &&
                  activeFile.tags.map((tag) => (
                    <span
                      key={tag.name}
                      className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20"
                    >
                      {tag.name}
                    </span>
                  ))}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  key={`link-${activeFile.id}`}
                  type="text"
                  placeholder="Paste LeetCode Link here..."
                  className={`bg-neutral-950 border rounded px-3 py-1 text-xs outline-none flex-1 transition-colors ${
                    isImporting
                      ? "border-yellow-500 text-yellow-400 animate-pulse"
                      : "border-neutral-800 text-gray-400 focus:text-white focus:border-blue-500"
                  }`}
                  value={localLink}
                  disabled={isImporting}
                  onChange={(e) => {
                    setLocalLink(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.target.blur();
                    }
                  }}
                  onBlur={async (e) => {
                    const newLink = e.target.value.trim();

                    if (newLink !== activeFile.link) {
                      useFileStore
                        .getState()
                        .updateFileLink(activeFile.id, newLink);
                    }

                    // Only fetch from LeetCode if it's a valid link, AND we actually changed the link OR we don't have a description yet
                    const shouldImport =
                      newLink &&
                      newLink.includes("leetcode.com/problems/") &&
                      (newLink !== activeFile.link || !activeFile.description);

                    if (shouldImport) {
                      setIsImporting(true);
                      try {
                        console.log("🚀 Starting LeetCode import:", newLink);
                        const { data: problemData } =
                          await fileService.importProblem(newLink);
                        console.log("✅ Import successful:", problemData.title);

                        try {
                          await fileService.createProblem(activeFile.id);
                        } catch (createError) {
                          console.log("Problem entry might already exist");
                        }

                        await fileService.updateProblem(activeFile.id, {
                          title: problemData.title,
                          slug: problemData.slug,
                          difficulty: problemData.difficulty,
                          description: problemData.description,
                          exampleTestcases: problemData.exampleTestcases,
                          codeSnippets: problemData.codeSnippets,
                          tags: problemData.tags,
                        });

                        console.log("💾 Problem data saved successfully");

                        await useFileStore
                          .getState()
                          .renameItem(activeFile.id, problemData.title);
                        await useFileStore
                          .getState()
                          .setActiveFile(activeFile.id);
                      } catch (error) {
                        console.error("❌ Failed to import problem:", error);
                        alert(
                          `Failed to import problem: ${error.message || "Unknown error"}`,
                        );
                      } finally {
                        setIsImporting(false);
                      }
                    }
                  }}
                />
                {/* Open on LeetCode button — shown whenever a valid link exists */}
                {localLink && localLink.includes("leetcode.com") && (
                  <a
                    href={localLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 border border-orange-500/20 transition-colors whitespace-nowrap"
                    title="Open on LeetCode"
                  >
                    <ExternalLink size={11} />
                    LeetCode
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-gray-300">
            {isImporting ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin mr-2" size={20} />
                <span className="text-yellow-400">
                  Importing LeetCode problem...
                </span>
              </div>
            ) : activeFile.description ? (
              <div
                dangerouslySetInnerHTML={{ __html: activeFile.description }}
              />
            ) : (
              <div className="text-gray-500 italic">
                No description available. Paste a LeetCode link above to import
                problem details.
              </div>
            )}
          </div>
        </div>
      </Panel>

      <PanelResizeHandle className="w-1 bg-neutral-800 group-hover:bg-blue-600 transition-colors" />

      {/* Right Panel: Code Editor */}
      <Panel defaultSize={60} minSize={20} className="bg-neutral-900">
        <div className="h-full flex flex-col">
          {/* Tabs / Toolbar */}
          <div className="flex items-center justify-between bg-neutral-950 border-b border-neutral-800 px-2 pt-2">
            <div className="flex space-x-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "px-4 py-2 text-sm font-medium rounded-t-md transition-colors border-t border-x border-transparent mb-[-1px]",
                    activeTab === tab.id
                      ? "bg-neutral-900 text-blue-400 border-neutral-800 border-b-neutral-900"
                      : "text-gray-500 hover:text-gray-300 hover:bg-neutral-900/50",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Editor Area - fills all remaining height */}
          <div className="flex-1 min-h-0">
            <CodeEditor
              code={activeFile.solutions?.[activeTab] || ""}
              language="javascript"
              onChange={handleCodeChange}
            />
          </div>

          {/* Manual Analysis Input */}
          <div className="bg-neutral-900 border-t border-neutral-800 p-3">
            <div className="flex gap-4 w-full">
              <div className="flex items-center gap-2 flex-1 bg-neutral-950 p-2 rounded border border-neutral-800">
                <span className="text-purple-400 font-bold text-xs uppercase tracking-wider whitespace-nowrap">
                  Time Complexity:
                </span>
                <select
                  value={activeFile.analysis?.time || ""}
                  onChange={handleTimeChange}
                  className="bg-transparent border-none text-white font-mono text-sm w-full focus:outline-none cursor-pointer appearance-none"
                  style={{ WebkitAppearance: "none", MozAppearance: "none" }}
                >
                  <option
                    value=""
                    disabled
                    className="bg-neutral-900 text-gray-500"
                  >
                    Select...
                  </option>
                  <option value="O(1)" className="bg-neutral-900 text-white">
                    O(1)
                  </option>
                  <option
                    value="O(log N)"
                    className="bg-neutral-900 text-white"
                  >
                    O(log N)
                  </option>
                  <option value="O(N)" className="bg-neutral-900 text-white">
                    O(N)
                  </option>
                  <option
                    value="O(N log N)"
                    className="bg-neutral-900 text-white"
                  >
                    O(N log N)
                  </option>
                  <option value="O(N^2)" className="bg-neutral-900 text-white">
                    O(N^2)
                  </option>
                  <option value="O(N^3)" className="bg-neutral-900 text-white">
                    O(N^3)
                  </option>
                  <option value="O(2^N)" className="bg-neutral-900 text-white">
                    O(2^N)
                  </option>
                  <option value="O(N!)" className="bg-neutral-900 text-white">
                    O(N!)
                  </option>
                </select>
              </div>
              <div className="flex items-center gap-2 flex-1 bg-neutral-950 p-2 rounded border border-neutral-800">
                <span className="text-purple-400 font-bold text-xs uppercase tracking-wider whitespace-nowrap">
                  Space Complexity:
                </span>
                <select
                  value={activeFile.analysis?.space || ""}
                  onChange={handleSpaceChange}
                  className="bg-transparent border-none text-white font-mono text-sm w-full focus:outline-none cursor-pointer appearance-none"
                  style={{ WebkitAppearance: "none", MozAppearance: "none" }}
                >
                  <option
                    value=""
                    disabled
                    className="bg-neutral-900 text-gray-500"
                  >
                    Select...
                  </option>
                  <option value="O(1)" className="bg-neutral-900 text-white">
                    O(1)
                  </option>
                  <option
                    value="O(log N)"
                    className="bg-neutral-900 text-white"
                  >
                    O(log N)
                  </option>
                  <option value="O(N)" className="bg-neutral-900 text-white">
                    O(N)
                  </option>
                  <option
                    value="O(N log N)"
                    className="bg-neutral-900 text-white"
                  >
                    O(N log N)
                  </option>
                  <option value="O(N^2)" className="bg-neutral-900 text-white">
                    O(N^2)
                  </option>
                  <option value="O(N^3)" className="bg-neutral-900 text-white">
                    O(N^3)
                  </option>
                  <option value="O(2^N)" className="bg-neutral-900 text-white">
                    O(2^N)
                  </option>
                  <option value="O(N!)" className="bg-neutral-900 text-white">
                    O(N!)
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </PanelGroup>
  );
};

export default ProblemWorkspace;
