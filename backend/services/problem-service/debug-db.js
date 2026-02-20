const sequelize = require('./src/config/database');
const Problem = require('./src/models/Problem');

async function debugSync() {
    try {
        console.log("Attempting to sync database...");
        await sequelize.authenticate();
        console.log("Database connection successful.");
        await sequelize.sync({ alter: true });
        console.log("Sync successful!");
    } catch (error) {
        console.error("Sync Failed!");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        console.error("Original Error:", error.original);
        console.error("SQL:", error.sql);
    } finally {
        await sequelize.close();
    }
}

debugSync();
