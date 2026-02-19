import React from 'react';
import { Outlet } from 'react-router-dom';
import FileExplorer from '../explorer/FileExplorer';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

const Layout = () => {
    return (
        <div className="h-screen w-screen bg-neutral-950 text-white overflow-hidden flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-neutral-800 flex flex-col">
                <FileExplorer />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
