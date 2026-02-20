const FileNode = require('../models/FileNode');
const axios = require('axios');

const PROBLEM_SERVICE_URL = 'http://localhost:5003/api/problems';

// @desc    Get file system tree
// @route   GET /api/files
exports.getFileSystem = async (req, res) => {
    try {
        // Fetch all nodes
        const nodes = await FileNode.findAll({ raw: true });
        
        const buildTree = (parentId) => {
            return nodes
                .filter(node => node.parentId === parentId)
                .map(node => ({
                    ...node,
                    // Sequelize returns integer IDs, ensure frontend handles them correctly
                    id: node.id, 
                    children: node.type === 'folder' ? buildTree(node.id) : undefined
                }));
        };

        const tree = buildTree(null);
        res.json(tree);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new file or folder
// @route   POST /api/files
exports.createFileNode = async (req, res) => {
    try {
        const { name, type, parentId, link } = req.body;
        
        const fileNode = await FileNode.create({
            name,
            type,
            parentId: parentId || null,
            link: link || ''
        });

        // If it's a file, notify Problem Service
        if (type === 'file') {
            try {
                await axios.post(PROBLEM_SERVICE_URL, {
                    fileId: fileNode.id, // ID is now Integer (or whatever Sequelize generated)
                    title: name
                });
            } catch (err) {
                console.error("Failed to create problem in Problem Service:", err.message);
            }
        }

        res.status(201).json(fileNode);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update file/folder (Rename, Move, Metadata)
// @route   PUT /api/files/:id
exports.updateFileNode = async (req, res) => {
    try {
        const { name, link, isSolved, isRevised } = req.body;
        
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (link !== undefined) updateData.link = link;
        if (isSolved !== undefined) updateData.isSolved = isSolved;
        if (isRevised !== undefined) updateData.isRevised = isRevised;

        const [updatedRows] = await FileNode.update(updateData, {
            where: { id: req.params.id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'File not found' });
        }

        const fileNode = await FileNode.findByPk(req.params.id);

        // Propagate rename
        if (name && fileNode.type === 'file') {
            try {
                await axios.put(`${PROBLEM_SERVICE_URL}/${fileNode.id}`, { title: name });
            } catch (err) {
                console.error("Failed to update problem title:", err.message);
            }
        }

        res.json(fileNode);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete file or folder
// @route   DELETE /api/files/:id
exports.deleteFileNode = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleted = await FileNode.destroy({ where: { id } });
        
        if (deleted) {
            // Propagate delete
            try {
                await axios.delete(`${PROBLEM_SERVICE_URL}/${id}`);
            } catch (err) {
                console.error("Failed to delete problem:", err.message);
            }
        }

        res.json({ message: 'File deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
