import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import FileExplorer from '../explorer/FileExplorer';
import { Menu } from 'lucide-react';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="h-screen w-screen bg-neutral-950 text-white overflow-hidden flex relative">
            {/* Open Explorer Button */}
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="absolute top-4 left-4 z-50 p-2 bg-neutral-800 hover:bg-neutral-700 rounded-md text-gray-400 hover:text-white transition-colors border border-neutral-700 shadow-lg"
                    title="Open Explorer"
                >
                    <Menu size={20} />
                </button>
            )}

            {/* Sidebar */}
            {isSidebarOpen && (
                <div className="w-64 border-r border-neutral-800 flex flex-col shrink-0">
                    <FileExplorer onClose={() => setIsSidebarOpen(false)} />
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
