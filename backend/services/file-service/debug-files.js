const sequelize = require('./src/config/database');
const FileNode = require('./src/models/FileNode'); // Assuming path is correct relative to root

async function checkFileNodes() {
    try {
        await sequelize.authenticate();
        console.log("DB Connected.");
        
        const count = await FileNode.count();
        console.log(`Total FileNodes: ${count}`);
        
        if (count > 0) {
            const nodes = await FileNode.findAll({ limit: 5 });
            console.log("Sample Nodes:", JSON.stringify(nodes, null, 2));
        } else {
            console.log("Table is empty.");
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await sequelize.close();
    }
}

checkFileNodes();
