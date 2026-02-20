import React, { useEffect, useState } from "react";
import {
  Folder,
  FileCode,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Edit2,
  MoreHorizontal,
  X,
} from "lucide-react";
import useFileStore from "../../store/useFileStore";

const FileItem = ({ item, depth = 0 }) => {
  const {
    toggleFolder,
    setActiveFile,
    activeFileId,
    expandedFolders,
    deleteItem,
    renameItem,
  } = useFileStore();
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const isExpanded = expandedFolders.includes(item.id);
  const isActive = activeFileId === item.id;

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    if (showContextMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showContextMenu]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (item.type === "folder") {
      toggleFolder(item.id);
    } else {
      setActiveFile(item.id);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowContextMenu(!showContextMenu);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (confirm(`Delete ${item.type} "${item.name}"?`)) {
      await deleteItem(item.id);
    }
    setShowContextMenu(false);
  };

  const handleRename = (e) => {
    e.stopPropagation();
    setIsRenaming(true);
    setShowContextMenu(false);
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (newName.trim() && newName !== item.name) {
      await renameItem(item.id, newName.trim());
    }
    setIsRenaming(false);
  };

  const handleRenameCancel = () => {
    setNewName(item.name);
    setIsRenaming(false);
  };

  return (
    <div className="relative">
      <div
        className={`
          flex items-center py-1 px-2 cursor-pointer text-sm select-none relative group
          ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-neutral-800"}
        `}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <span className="mr-1.5 opacity-70">
          {item.type === "folder" &&
            (isExpanded ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            ))}
        </span>

        <span className="mr-2 text-blue-400">
          {item.type === "folder" ? (
            <Folder size={16} />
          ) : (
            <FileCode size={16} className="text-yellow-400" />
          )}
        </span>

        {isRenaming ? (
          <form onSubmit={handleRenameSubmit} className="flex-1">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRenameCancel}
              onKeyDown={(e) => e.key === "Escape" && handleRenameCancel()}
              className="bg-neutral-700 text-white px-1 py-0.5 text-sm rounded w-full"
              autoFocus
            />
          </form>
        ) : (
          <span className="flex-1">{item.name}</span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleContextMenu(e);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-neutral-700 rounded transition-opacity"
        >
          <MoreHorizontal size={12} />
        </button>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div className="absolute right-2 top-8 bg-neutral-800 border border-neutral-700 rounded shadow-lg z-50 py-1 min-w-24">
          <button
            onClick={handleRename}
            className="w-full text-left px-3 py-1 hover:bg-neutral-700 text-sm flex items-center gap-2"
          >
            <Edit2 size={12} /> Rename
          </button>
          <button
            onClick={handleDelete}
            className="w-full text-left px-3 py-1 hover:bg-red-600 text-sm flex items-center gap-2 text-red-400"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      )}

      {/* Render children recursively if folder is expanded */}
      {item.type === "folder" && isExpanded && item.children && (
        <div>
          {item.children.map((child) => (
            <FileItem key={child.id} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer = ({ onClose }) => {
  const { fileSystem, loadFileSystem, addItem, expandedFolders } =
    useFileStore();
  const [showAddMenu, setShowAddMenu] = useState(false);

  useEffect(() => {
    loadFileSystem();
  }, [loadFileSystem]);

  const handleAddFile = async () => {
    const name = prompt("Enter file name:");
    if (name) {
      await addItem(null, name, "file");
    }
    setShowAddMenu(false);
  };

  const handleAddFolder = async () => {
    const name = prompt("Enter folder name:");
    if (name) {
      await addItem(null, name, "folder");
    }
    setShowAddMenu(false);
  };

  // Close context menus when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => setShowAddMenu(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="h-full bg-neutral-900 border-r border-neutral-800 select-none">
      <div className="flex items-center justify-between p-2 border-b border-neutral-800">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Explorer
        </div>
          <div className="relative flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddMenu(!showAddMenu);
              }}
              className="p-1 hover:bg-neutral-700 rounded text-gray-400 hover:text-white transition-colors"
              title="New Item"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-neutral-700 rounded text-gray-400 hover:text-white transition-colors"
              title="Close Explorer"
            >
              <X size={16} />
            </button>

            {showAddMenu && (
            <div className="absolute right-0 top-8 bg-neutral-800 border border-neutral-700 rounded shadow-lg z-50 py-1 min-w-28">
              <button
                onClick={handleAddFile}
                className="w-full text-left px-3 py-1 hover:bg-neutral-700 text-sm flex items-center gap-2"
              >
                <FileCode size={12} /> New File
              </button>
              <button
                onClick={handleAddFolder}
                className="w-full text-left px-3 py-1 hover:bg-neutral-700 text-sm flex items-center gap-2"
              >
                <Folder size={12} /> New Folder
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {fileSystem.map((item) => (
          <FileItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;
