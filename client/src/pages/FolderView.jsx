import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFileStore from '../store/useFileStore';
import { FileCode, Folder, RotateCcw, Trash2, Edit2, CheckCircle, Circle, ArrowLeft } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const FolderView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fileSystem, updateFileNotes, updateFileContent, deleteItem, addItem } = useFileStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [renamingId, setRenamingId] = useState(null);
    const [renameValue, setRenameValue] = useState('');
    
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemType, setNewItemType] = useState('file'); // 'file' or 'folder'

    // Recursive search to find the current folder
    const findNode = (nodes, targetId) => {
        for (const node of nodes) {
            if (node.id == targetId) return node;
            if (node.children) {
                const found = findNode(node.children, targetId);
                if (found) return found;
            }
        }
        return null;
    };

    const currentFolder = findNode(fileSystem, id);

    // If folder not found (or root), maybe redirect or show error?
    // For now assuming it exists.

    const handleNavigate = (item) => {
        if (item.type === 'folder') {
            navigate(`/folder/${item.id}`);
        } else {
            navigate(`/problem/${item.id}`);
        }
    };

    const handleToggleRevision = async (e, item) => {
        e.stopPropagation();
        await useFileStore.getState().toggleFileRevision(item.id);
    };

    const startRenaming = (e, item) => {
        e.stopPropagation();
        setRenamingId(item.id);
        setRenameValue(item.name);
    };

    const handleRenameSubmit = async (e) => {
        if (e.key === 'Enter') {
            e.stopPropagation();
            if (renamingId && renameValue.trim()) {
                try {
                     await useFileStore.getState().renameItem(renamingId, renameValue);
                } catch (err) {
                    console.error("Rename failed", err);
                }
            }
            setRenamingId(null);
        } else if (e.key === 'Escape') {
            setRenamingId(null);
        }
    };

    const handleResetRevisions = async () => {
        if (!window.confirm("Are you sure you want to reset all revision status in this folder?")) return;
        
        if (currentFolder.children) {
            for (const child of currentFolder.children) {
                if (child.type === 'file' && child.isRevised) {
                    await useFileStore.getState().toggleFileRevision(child.id);
                }
            }
        }
    };
    
    const handleCreateItem = async (e) => {
        e.preventDefault();
        if (!newItemName.trim()) return;
        
        try {
            await addItem(currentFolder.id, newItemName, newItemType);
            setShowCreateModal(false);
            setNewItemName('');
        } catch (error) {
            console.error("Failed to create item", error);
        }
    };
    
    if (!currentFolder) return <div className="p-8 text-white">Folder not found</div>;

    const filteredChildren = currentFolder.children?.filter(child => 
        child.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="h-full flex flex-col bg-neutral-900 text-gray-200 relative">
            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl w-96 shadow-2xl"
                        >
                            <h2 className="text-xl font-bold mb-4 text-white">Create New</h2>
                            
                            <form onSubmit={handleCreateItem}>
                                <div className="mb-4">
                                    <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Type</label>
                                    <div className="flex gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => setNewItemType('file')}
                                            className={clsx(
                                                "flex-1 py-2 rounded-lg flex items-center justify-center gap-2 border transition-all",
                                                newItemType === 'file' 
                                                    ? "bg-blue-600/20 border-blue-600 text-blue-400" 
                                                    : "bg-neutral-800 border-neutral-700 text-gray-400 hover:bg-neutral-700"
                                            )}
                                        >
                                            <FileCode size={18} /> Problem
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setNewItemType('folder')}
                                            className={clsx(
                                                "flex-1 py-2 rounded-lg flex items-center justify-center gap-2 border transition-all",
                                                newItemType === 'folder' 
                                                    ? "bg-blue-600/20 border-blue-600 text-blue-400" 
                                                    : "bg-neutral-800 border-neutral-700 text-gray-400 hover:bg-neutral-700"
                                            )}
                                        >
                                            <Folder size={18} /> Folder
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Name</label>
                                    <input 
                                        autoFocus
                                        type="text" 
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        placeholder={newItemType === 'file' ? "e.g. Two Sum" : "e.g. Graphs"}
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
                                        disabled={!newItemName.trim()}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                     <button onClick={() => navigate(-1)} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Folder className="text-blue-500" />
                            {currentFolder.name}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">{filteredChildren.length} items</p>
                    </div>
                </div>

                <div className="flex gap-3">
                     <button 
                         onClick={handleResetRevisions}
                         className="p-2 hover:bg-neutral-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                         title="Reset All Revisions"
                     >
                        <RotateCcw size={18} />
                     </button>
                     <input 
                        type="text" 
                        placeholder="Search..." 
                        className="bg-neutral-800 border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        New Item
                    </button>
                </div>
            </div>

            {/* Content Table */}
            <div className="flex-1 overflow-auto p-6">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-500 text-sm border-b border-neutral-800">
                            <th className="font-medium py-3 pl-4">Name</th>
                            <th className="font-medium py-3">Status</th>
                            <th className="font-medium py-3">Last Revised</th>
                            <th className="font-medium py-3 pr-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredChildren.map(item => (
                            <tr 
                                key={item.id} 
                                onClick={() => handleNavigate(item)}
                                className="group hover:bg-neutral-800/50 transition-colors cursor-pointer border-b border-neutral-800/50"
                            >
                                <td className="py-3 pl-4">
                                    <div className="flex items-center gap-3">
                                        {item.type === 'folder' ? 
                                            <Folder size={18} className="text-blue-400" /> : 
                                            <FileCode size={18} className="text-yellow-400" />
                                        }
                                        {renamingId === item.id ? (
                                            <input 
                                                autoFocus
                                                type="text"
                                                value={renameValue}
                                                onChange={(e) => setRenameValue(e.target.value)}
                                                onKeyDown={handleRenameSubmit}
                                                onClick={(e) => e.stopPropagation()}
                                                className="bg-neutral-950 border border-blue-500 rounded px-2 py-0.5 text-white outline-none w-full max-w-[200px]"
                                                onBlur={() => setRenamingId(null)}
                                            />
                                        ) : (
                                            <span className="font-medium">{item.name}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3">
                                    {item.type === 'file' && (
                                        <button 
                                            onClick={(e) => handleToggleRevision(e, item)}
                                            className={clsx(
                                                "flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-all",
                                                item.isRevised 
                                                    ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                                    : "bg-neutral-800 text-gray-400 border-neutral-700 hover:border-gray-500"
                                            )}
                                        >
                                            {item.isRevised ? <CheckCircle size={12} /> : <Circle size={12} />}
                                            {item.isRevised ? "Revised" : "Pending"}
                                        </button>
                                    )}
                                </td>
                                <td className="py-3 text-sm text-gray-500">
                                    {new Date(item.updatedAt || Date.now()).toLocaleDateString()}
                                </td>
                                <td className="py-3 pr-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => startRenaming(e, item)}
                                            className="p-1.5 hover:bg-neutral-700 rounded text-gray-400 hover:text-white"
                                            title="Rename (F2)"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                                            className="p-1.5 hover:bg-red-900/30 rounded text-gray-400 hover:text-red-400"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FolderView;
