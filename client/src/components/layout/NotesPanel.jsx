import React, { useState } from 'react';
import useFileStore from '../../store/useFileStore';

const NotesPanel = () => {
    const { activeFileId, fileSystem, updateFileNotes } = useFileStore();
    
    // Helper to find file by ID
    const findFile = (items, id) => {
        for (const item of items) {
            if (item.id === id) return item;
            if (item.children) {
                const found = findFile(item.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const activeFile = activeFileId ? findFile(fileSystem, activeFileId) : null;

    if (!activeFile) return null;

    return (
        <div className="h-full flex flex-col bg-neutral-900">
            <div className="bg-neutral-950 px-4 py-2 border-b border-neutral-800 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-300">Notes & Analysis</span>
            </div>
            
            <textarea
                className="flex-1 w-full bg-neutral-900 p-4 text-gray-300 resize-none focus:outline-none text-sm font-sans"
                placeholder="Write your notes here..."
                value={activeFile.notes || ''}
                onChange={(e) => updateFileNotes(activeFileId, e.target.value)}
            />

            {/* AI Analysis Result Placeholder */}
            {activeFile.analysis && (
                <div className="bg-neutral-800 p-4 border-t border-neutral-700">
                    <h4 className="text-purple-400 font-bold text-xs uppercase mb-2">AI Analysis</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500 block text-xs">Time Complexity</span>
                            <span className="text-white font-mono">{activeFile.analysis.time}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block text-xs">Space Complexity</span>
                            <span className="text-white font-mono">{activeFile.analysis.space}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotesPanel;
