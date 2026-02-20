const express = require('express');
const router = express.Router();
const { 
    getFileSystem, 
    createFileNode, 
    updateFileNode, 
    deleteFileNode 
} = require('../controllers/fileController');

router.get('/', getFileSystem);
router.post('/', createFileNode);
router.put('/:id', updateFileNode);
router.delete('/:id', deleteFileNode);

module.exports = router;
