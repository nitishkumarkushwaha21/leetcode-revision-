import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Topic from './models/Topic.js';
import Question from './models/Question.js';
import Solution from './models/Solution.js';

// Let dotenv find the .env file in the current working directory.
dotenv.config();

const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        // Use current db connection
        return;
    }
    // Use new db connection
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(`Error connecting to DB: ${err.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();

        console.log('--- Clearing Old Data ---');
        await Solution.deleteMany();
        await Question.deleteMany();
        await Topic.deleteMany();
        console.log('Old data cleared successfully.');

        const user = await User.findOne();
        if (!user) {
            console.error('CRITICAL: No users found. Please register a user in the app first.');
            process.exit(1);
        }
        console.log(`--- Seeding data for user: ${user.email} ---`);

        // 1. Create Topics
        const topicsData = [
            { name: 'Arrays', description: 'Problems involving arrays and lists.', user: user._id },
            { name: 'Trees', description: 'Problems on binary trees, BSTs, etc.', user: user._id },
            { name: 'Graphs', description: 'Graph traversal and algorithm problems.', user: user._id },
            { name: 'Dynamic Programming', description: 'Classic DP challenges.', user: user._id },
        ];
        const createdTopics = await Topic.insertMany(topicsData);
        const arraysTopic = createdTopics.find(t => t.name === 'Arrays');
        const treesTopic = createdTopics.find(t => t.name === 'Trees');
        console.log('Topics created successfully.');

        // 2. Create Questions
        const questionsData = [
            { title: 'Best Time to Buy and Sell Stock', description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day...', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', difficulty: 'Easy', topic: arraysTopic._id, user: user._id, tags: ['array', 'dp'] },
            { title: 'Two Sum', description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.', url: 'https://leetcode.com/problems/two-sum/', difficulty: 'Easy', topic: arraysTopic._id, user: user._id, tags: ['array', 'hash-table'] },
            { title: 'Invert Binary Tree', description: 'Given the `root` of a binary tree, invert the tree, and return its root.', url: 'https://leetcode.com/problems/invert-binary-tree/', difficulty: 'Easy', topic: treesTopic._id, user: user._id, tags: ['tree', 'recursion'] },
        ];
        const createdQuestions = await Question.insertMany(questionsData);
        const stockQuestion = createdQuestions.find(q => q.title === 'Best Time to Buy and Sell Stock');
        const twoSumQuestion = createdQuestions.find(q => q.title === 'Two Sum');
        console.log('Questions created successfully.');
        
        // 3. Create Solutions
        const solutionsData = [
            { question: stockQuestion._id, user: user._id, logic: 'One Pass Approach', code: 'let maxProfit = 0; let minPrice = Infinity; ...', timeComplexity: 'O(n)', spaceComplexity: 'O(1)' },
            { question: stockQuestion._id, user: user._id, logic: 'Brute Force', code: 'let maxProfit = 0; for(let i=0;...){...}', timeComplexity: 'O(n^2)', spaceComplexity: 'O(1)' },
            { question: twoSumQuestion._id, user: user._id, logic: 'Hash Map', code: 'const map = {}; for(let i=0;...){...}', timeComplexity: 'O(n)', spaceComplexity: 'O(n)' },
        ];
        const createdSolutions = await Solution.insertMany(solutionsData);
        console.log('Solutions created successfully.');

        // 4. Link Solutions back to their Questions
        const stockSolutions = createdSolutions.filter(s => s.question.equals(stockQuestion._id));
        const twoSumSolutions = createdSolutions.filter(s => s.question.equals(twoSumQuestion._id));
        
        await Question.findByIdAndUpdate(stockQuestion._id, { $set: { solutions: stockSolutions.map(s => s._id) } });
        await Question.findByIdAndUpdate(twoSumQuestion._id, { $set: { solutions: twoSumSolutions.map(s => s._id) } });
        console.log('Solutions linked to questions successfully.');
        
        console.log('\n✅ Data Import Complete!');
        process.exit();
    } catch (error) {
        console.error(`\n❌ ERROR during data import: ${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
     try {
        await connectDB();
        await Solution.deleteMany();
        await Question.deleteMany();
        await Topic.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
