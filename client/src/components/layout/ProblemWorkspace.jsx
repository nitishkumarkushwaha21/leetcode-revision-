import React, { useState } from 'react';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import useFileStore from '../../store/useFileStore';
import CodeEditor from '../editor/CodeEditor';
import NotesPanel from './NotesPanel';
import { clsx } from 'clsx';
import { Sparkles, Loader2 } from 'lucide-react';

const TABS = [
  { id: 'brute', label: 'Brute Force' },
  { id: 'better', label: 'Better' },
  { id: 'optimal', label: 'Optimal' },
];

import { useParams } from 'react-router-dom';

// ...

const ProblemWorkspace = () => {
    const { id } = useParams();
    const { fileSystem, updateFileContent, setActiveFile } = useFileStore();
    const [activeTab, setActiveTab] = useState('optimal');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Set active file in store when mounting or id changes
    // This ensures other components (like sidebar) highlight the correct file
    // although sidebar currently uses internal state or props, we should sync.
    // For now, just finding the file.
    
    // Helper to find file by ID
    const findFile = (items, targetId) => {
        for (const item of items) {
            if (item.id === targetId) return item;
            if (item.children) {
                const found = findFile(item.children, targetId);
                if (found) return found;
            }
        }
        return null;
    };

    const activeFile = id ? findFile(fileSystem, id) : null;

    if (!activeFile) return (
        <div className="h-full flex items-center justify-center text-gray-500 bg-neutral-900">
            Problem not found or loading...
        </div>
    );

    const handleCodeChange = (newCode) => {
        updateFileContent(activeFileId, activeTab, newCode);
    };

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        // Simulate AI delay
        setTimeout(() => {
            setIsAnalyzing(false);
            // In a real app, this would update the store with analysis results
            // For now, we can just log or alert, but since we want to show it in NotesPanel, 
            // we might need an action to update analysis results in store.
            // I'll leave it as a visual feedback for now.
            alert("Analysis Complete! (Mock)");
        }, 1500);
    };

    return (
        <PanelGroup direction="horizontal" className="h-full group">
            {/* Left Panel: Problem Description */}
            <Panel defaultSize={40} minSize={20} className="bg-neutral-900 border-r border-neutral-800">
                <div className="h-full p-6 overflow-y-auto">
                    <div className="mb-6 border-b border-neutral-800 pb-4">
                        <h1 className="text-3xl font-bold mb-2 text-white">{activeFile.name}</h1>
                         <div className="flex flex-col gap-3">
                            <div className="flex gap-2">
                                <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">Easy</span>
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">Array</span>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Paste LeetCode Link here..." 
                                className="bg-neutral-950 border border-neutral-800 rounded px-3 py-1 text-xs text-gray-400 focus:text-white focus:border-blue-500 outline-none w-full transition-colors"
                                defaultValue={activeFile.link || ''}
                                onBlur={(e) => {
                                    useFileStore.getState().updateFileLink(activeFile.id, e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    
                    <div className="prose prose-invert max-w-none text-gray-300">
                         <h3 className="text-white font-semibold">Description</h3>
                         <p>
                           Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
                         </p>
                         <p>
                           You may assume that each input would have exactly one solution, and you may not use the same element twice.
                         </p>
                         <p>You can return the answer in any order.</p>

                         <h3 className="text-white font-semibold mt-6">Example 1:</h3>
                         <pre className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 text-sm overflow-x-auto">
{`Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}
                         </pre>
                    </div>
                </div>
            </Panel>

            <PanelResizeHandle className="w-1 bg-neutral-800 group-hover:bg-blue-600 transition-colors" />

            {/* Right Panel: Code Editor + Notes */}
            <Panel defaultSize={60} minSize={20} className="bg-neutral-900">
                <PanelGroup direction="vertical">
                    {/* Top: Editor */}
                    <Panel defaultSize={70} minSize={30}>
                        <div className="h-full flex flex-col">
                            {/* Tabs / Toolbar */}
                            <div className="flex items-center justify-between bg-neutral-950 border-b border-neutral-800 px-2 pt-2">
                                <div className="flex space-x-1">
                                    {TABS.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={clsx(
                                                "px-4 py-2 text-sm font-medium rounded-t-md transition-colors border-t border-x border-transparent mb-[-1px]",
                                                activeTab === tab.id
                                                    ? "bg-neutral-900 text-blue-400 border-neutral-800 border-b-neutral-900"
                                                    : "text-gray-500 hover:text-gray-300 hover:bg-neutral-900/50"
                                            )}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 pr-2 pb-2">
                                     <button 
                                        onClick={handleAnalyze}
                                        disabled={isAnalyzing}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50"
                                     >
                                        {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                        {isAnalyzing ? 'Analyzing...' : 'Analyze Complexity'}
                                     </button>
                                </div>
                            </div>

                            {/* Editor Area */}
                            <div className="flex-1 overflow-hidden">
                                <CodeEditor 
                                    code={activeFile.solutions?.[activeTab] || ''} 
                                    language="javascript"
                                    onChange={handleCodeChange}
                                />
                            </div>
                        </div>
                    </Panel>

                    <PanelResizeHandle className="h-1 bg-neutral-800 hover:bg-blue-600 transition-colors" />

                    {/* Bottom: Notes */}
                    <Panel defaultSize={30} minSize={10}>
                        <NotesPanel />
                    </Panel>
                </PanelGroup>
            </Panel>
        </PanelGroup>
    );
};

export default ProblemWorkspace;
