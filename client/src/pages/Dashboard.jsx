import React, { useState } from "react";
import useFileStore from "../store/useFileStore";
import { Folder, Download } from "lucide-react"; // Added Download icon
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fileService } from "../services/api";

const Dashboard = () => {
  const { fileSystem, addItem } = useFileStore();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [importUrl, setImportUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // Filter root level items
  const rootFolders = fileSystem.filter((item) => item.type === "folder");

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      // parentId null for root folders
      await addItem(null, newFolderName, "folder");
      setShowCreateModal(false);
      setNewFolderName("");
    } catch (error) {
      console.error("Failed to create folder", error);
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!importUrl) return;
    setIsImporting(true);
    try {
      // 1. Fetch data from LeetCode
      const { data: problemData } = await fileService.importProblem(importUrl);

      // 2. Create File with proper name
      const newItem = await addItem(null, problemData.title, "file");

      if (newItem) {
        // 3. Create Problem entry in database
        await fileService.createProblem(newItem.id);

        // 4. Update with LeetCode data
        await fileService.updateProblem(newItem.id, {
          title: problemData.title,
          slug: problemData.slug,
          difficulty: problemData.difficulty,
          description: problemData.description,
          exampleTestcases: problemData.exampleTestcases,
          codeSnippets: problemData.codeSnippets,
          tags: problemData.tags,
        });

        // 5. Update file link
        await fileService.updateFileNode(newItem.id, { link: importUrl });

        setShowImportModal(false);
        setImportUrl("");
        navigate(`/problem/${newItem.id}`);
      }
    } catch (error) {
      console.error("Import failed", error);
      alert("Failed to import problem. Check URL or Backend.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto relative">
      <AnimatePresence>
        {showCreateModal && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl w-96 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-4 text-white">
                New Root Folder
              </h2>
              <form onSubmit={handleCreateFolder}>
                <div className="mb-6">
                  <label className="block text-xs text-gray-500 uppercase font-bold mb-2">
                    Name
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="e.g. Dynamic Programming"
                    className="w-full bg-neutral-800 border-none rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newFolderName.trim()}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showImportModal && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl w-96 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-4 text-white">
                Import LeetCode Problem
              </h2>
              <form onSubmit={handleImport}>
                <div className="mb-6">
                  <label className="block text-xs text-gray-500 uppercase font-bold mb-2">
                    LeetCode URL
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    placeholder="https://leetcode.com/problems/..."
                    className="w-full bg-neutral-800 border-none rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!importUrl.trim() || isImporting}
                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
                  >
                    {isImporting ? "Importing..." : "Import"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <button
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition-colors border border-neutral-700"
        >
          <Download size={18} />
          Import from LeetCode
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rootFolders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => navigate(`/folder/${folder.id}`)}
            className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl hover:border-blue-600/50 hover:bg-neutral-800/50 transition-all cursor-pointer group"
          >
            <div className="mb-4 text-blue-500 group-hover:scale-110 transition-transform origin-left">
              <Folder size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              {folder.name}
            </h3>
            <p className="text-sm text-gray-500">
              {folder.children ? folder.children.length : 0} items
            </p>
          </div>
        ))}

        {/* Add Folder Card */}
        <div
          onClick={() => setShowCreateModal(true)}
          className="border border-dashed border-neutral-800 p-6 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-gray-300 hover:border-gray-600 cursor-pointer transition-colors"
        >
          <span className="text-4xl mb-2">+</span>
          <span className="font-medium">New Folder</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
