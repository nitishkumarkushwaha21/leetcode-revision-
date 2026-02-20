const express = require('express');
const router = express.Router();
const { 
    getProblem, 
    createProblem, 
    updateProblem, 
    deleteProblem 
} = require('../controllers/problemController');

router.get('/:fileId', getProblem);
router.post('/', createProblem);
router.put('/:fileId', updateProblem);
router.delete('/:fileId', deleteProblem);

// Import Route
const { importLeetCodeProblem } = require('../controllers/importController');
router.post('/import', importLeetCodeProblem);

module.exports = router;
