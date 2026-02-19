import { create } from 'zustand';
import { fileService } from '../services/api';

const useFileStore = create((set, get) => ({
  fileSystem: [], // Initially empty, loaded from API
  activeFileId: null,
  expandedFolders: [],
  isLoading: false,
  error: null,

  // Fetch initial file tree
  loadFileSystem: async () => {
    set({ isLoading: true });
    try {
      const response = await fileService.getFileSystem();
      set({ fileSystem: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  setActiveFile: async (fileId) => {
    set({ activeFileId: fileId });
    // When selecting a file, ensure we have its latest content/problem details
    // We could eager load or lazy load. For now, we find it in tree, if content is missing, we might need to fetch.
    // However, our getFileSystem might be shallow? Use getProblem for details.
    
    // Find file type
    const findFile = (items) => {
        for (const item of items) {
            if (item.id === fileId) return item;
            if (item.children) {
                const found = findFile(item.children);
                if (found) return found;
            }
        }
        return null;
    };
    
    const file = findFile(get().fileSystem);
    if (file && file.type === 'file' && !file.solutions) {
        // Fetch full problem details if not present (optional optimization)
        try {
            const res = await fileService.getProblem(fileId);
            // Merge details into store
            const updateRecursive = (items) => items.map(item => {
                if (item.id === fileId) {
                    return { ...item, ...res.data };
                }
                if (item.children) return { ...item, children: updateRecursive(item.children) };
                return item;
            });
            set(state => ({ fileSystem: updateRecursive(state.fileSystem) }));
        } catch (err) {
            console.error("Failed to load problem details", err);
        }
    }
  },

  toggleFolder: (folderId) => set((state) => {
    const isExpanded = state.expandedFolders.includes(folderId);
    return {
      expandedFolders: isExpanded
        ? state.expandedFolders.filter(id => id !== folderId)
        : [...state.expandedFolders, folderId]
    };
  }),

  // Add Item (API Call)
  addItem: async (parentId, name, type) => {
    try {
        const res = await fileService.createFileNode(name, type, parentId);
        const newItem = res.data;
        // Transform _id to id if backend doesn't
        newItem.id = newItem._id; 

        set((state) => {
             const addItemRecursive = (items) => {
                // If adding to root (parentId null)
                if (!parentId) return [...items, newItem];

                return items.map(item => {
                    if (item.id === parentId) {
                        return { ...item, children: [...(item.children || []), newItem] };
                    }
                    if (item.children) {
                        return { ...item, children: addItemRecursive(item.children) };
                    }
                    return item;
                });
            };
            
            // Special handling if parentId is null (add to root)
            if (!parentId) {
                 return { fileSystem: [...state.fileSystem, newItem] };
            }

            return { fileSystem: addItemRecursive(state.fileSystem) };
        });
    } catch (error) {
        console.error("Failed to add item", error);
    }
  },

  deleteItem: async (itemId) => {
      try {
          await fileService.deleteFileNode(itemId);
          set((state) => {
            const deleteRecursive = (items) => {
                return items.filter(item => item.id !== itemId).map(item => {
                    if (item.children) {
                        return { ...item, children: deleteRecursive(item.children) };
                    }
                    return item;
                });
            };
            return { fileSystem: deleteRecursive(state.fileSystem) };
          });
      } catch (error) {
          console.error("Failed to delete item", error);
      }
  },

  // Update Content (solutions)
  updateFileContent: async (fileId, solutionType, newContent) => {
      // Optimistic update
      set((state) => {
        const updateRecursive = (items) => {
          return items.map(item => {
            if (item.id === fileId) {
              return { 
                ...item, 
                solutions: {
                  ...item.solutions,
                  [solutionType]: newContent
                }
              };
            }
            if (item.children) {
              return { ...item, children: updateRecursive(item.children) };
            }
            return item;
          });
        };
        return { fileSystem: updateRecursive(state.fileSystem) };
      });

      // Debounced API call appropriate here, but for now direct call
      try {
          await fileService.updateProblem(fileId, { 
              solutions: { [solutionType]: newContent } 
          });
      } catch (error) {
          console.error("Failed to save content", error);
      }
  },

  updateFileNotes: async (fileId, notes) => {
       // Optimistic
       set((state) => {
        const updateRecursive = (items) => {
            return items.map(item => {
                if (item.id === fileId) {
                    return { ...item, notes };
                }
                if (item.children) {
                    return { ...item, children: updateRecursive(item.children) };
                }
                return item;
            });
        };
        return { fileSystem: updateRecursive(state.fileSystem) };
      });

      await fileService.updateProblem(fileId, { notes });
  },

  updateFileLink: async (fileId, link) => {
       // Optimistic
       set((state) => {
        const updateRecursive = (items) => {
            return items.map(item => {
                if (item.id === fileId) {
                    return { ...item, link };
                }
                if (item.children) {
                    return { ...item, children: updateRecursive(item.children) };
                }
                return item;
            });
        };
        return { fileSystem: updateRecursive(state.fileSystem) };
      });

      await fileService.updateProblem(fileId, { link });
  },

  toggleFileRevision: async (fileId) => {
      // ... (existing code)
  },

  renameItem: async (fileId, newName) => {
       // Optimistic
       set((state) => {
        const updateRecursive = (items) => {
            return items.map(item => {
                if (item.id === fileId) {
                    return { ...item, name: newName };
                }
                if (item.children) {
                    return { ...item, children: updateRecursive(item.children) };
                }
                return item;
            });
        };
        return { fileSystem: updateRecursive(state.fileSystem) };
      });

      await fileService.updateFileNode(fileId, { name: newName });
  }
}));

export default useFileStore;
