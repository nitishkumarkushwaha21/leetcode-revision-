import React, { useEffect } from 'react';
import { Folder, FileCode, ChevronRight, ChevronDown } from 'lucide-react';
import useFileStore from '../../store/useFileStore';

const FileItem = ({ item, depth = 0 }) => {
  const { toggleFolder, selectFile, activeFileId, expandedFolders } = useFileStore();
  
  const isExpanded = expandedFolders.includes(item.id);
  const isActive = activeFileId === item.id;

  const handleClick = (e) => {
    e.stopPropagation();
    if (item.type === 'folder') {
      toggleFolder(item.id);
    } else {
      selectFile(item.id);
    }
  };

  return (
    <div>
      <div 
        className={`
          flex items-center py-1 px-2 cursor-pointer text-sm select-none
          ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-neutral-800'}
        `}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
      >
        <span className="mr-1.5 opacity-70">
          {item.type === 'folder' && (
             isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          )}
        </span>
        
        <span className="mr-2 text-blue-400">
           {item.type === 'folder' ? <Folder size={16} /> : <FileCode size={16} className="text-yellow-400"/>}
        </span>
        
        <span>{item.name}</span>
      </div>

      {/* Render children recursively if folder is expanded */}
      {item.type === 'folder' && isExpanded && item.children && (
        <div>
          {item.children.map(child => (
            <FileItem key={child.id} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer = () => {
    const { fileSystem, loadFileSystem } = useFileStore();

    useEffect(() => {
        loadFileSystem();
    }, [loadFileSystem]);

    return (
        <div className="h-full bg-neutral-900 border-r border-neutral-800 select-none">
            <div className="p-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Explorer
            </div>
            <div className="flex-1 overflow-y-auto">
                {fileSystem.map(item => (
                    <FileItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default FileExplorer;
