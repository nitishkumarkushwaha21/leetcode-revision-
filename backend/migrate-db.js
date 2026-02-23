const { Sequelize, DataTypes } = require("sequelize");

const localDb = new Sequelize("algonote", "postgres", "Nikuku@30", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

const remoteDb = new Sequelize(
  "postgresql://neondb_owner:npg_1hg3AXQFYyfU@ep-summer-queen-aifl7d78-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require",
  {
    dialect: "postgres",
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    logging: false,
  }
);

// Define Models for Local
const LocalFileNode = localDb.define("FileNode", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM("file", "folder"), allowNull: false },
  parentId: { type: DataTypes.INTEGER, allowNull: true },
  link: { type: DataTypes.STRING, allowNull: true },
}, { timestamps: true });

const LocalProblem = localDb.define("Problem", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
  title: DataTypes.STRING,
  slug: DataTypes.STRING,
  difficulty: DataTypes.STRING,
  description: DataTypes.TEXT,
  exampleTestcases: DataTypes.TEXT,
  codeSnippets: DataTypes.JSONB,
  tags: DataTypes.ARRAY(DataTypes.STRING),
}, { timestamps: true });

const LocalPlaylist = localDb.define("Playlist", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  url: { type: DataTypes.STRING, allowNull: false, unique: true },
  title: DataTypes.STRING,
  channelTitle: DataTypes.STRING,
  thumbnail: DataTypes.STRING,
  videoIds: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  status: { type: DataTypes.ENUM("pending", "processing", "completed", "failed"), defaultValue: "pending" }
}, { timestamps: true });

const LocalSheet = localDb.define('Sheet', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  playlist_url: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: true, createdAt: 'created_at', updatedAt: false });

const LocalSheetProblem = localDb.define('SheetProblem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sheet_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  leetcode_url: { type: DataTypes.STRING, allowNull: false },
  youtube_link: { type: DataTypes.STRING },
  difficulty: { type: DataTypes.STRING },
  confidence_score: { type: DataTypes.FLOAT },
  is_completed: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: false });

// Define Models for Remote
const RemoteFileNode = remoteDb.define("FileNode", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM("file", "folder"), allowNull: false },
  parentId: { type: DataTypes.INTEGER, allowNull: true },
  link: { type: DataTypes.STRING, allowNull: true },
}, { timestamps: true });

const RemoteProblem = remoteDb.define("Problem", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
  title: DataTypes.STRING,
  slug: DataTypes.STRING,
  difficulty: DataTypes.STRING,
  description: DataTypes.TEXT,
  exampleTestcases: DataTypes.TEXT,
  codeSnippets: DataTypes.JSONB,
  tags: DataTypes.ARRAY(DataTypes.STRING),
}, { timestamps: true });

const RemotePlaylist = remoteDb.define("Playlist", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  url: { type: DataTypes.STRING, allowNull: false, unique: true },
  title: DataTypes.STRING,
  channelTitle: DataTypes.STRING,
  thumbnail: DataTypes.STRING,
  videoIds: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  status: { type: DataTypes.ENUM("pending", "processing", "completed", "failed"), defaultValue: "pending" }
}, { timestamps: true });

const RemoteSheet = remoteDb.define('Sheet', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  playlist_url: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: true, createdAt: 'created_at', updatedAt: false });

const RemoteSheetProblem = remoteDb.define('SheetProblem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sheet_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  leetcode_url: { type: DataTypes.STRING, allowNull: false },
  youtube_link: { type: DataTypes.STRING },
  difficulty: { type: DataTypes.STRING },
  confidence_score: { type: DataTypes.FLOAT },
  is_completed: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: false });


async function migrate() {
  await localDb.authenticate();
  await remoteDb.authenticate();
  console.log("Connected to both databases");

  // Sync remote tables silently
  await remoteDb.sync({ force: true }); // Careful, drops remote data but it's new
  
  // FileNodes
  const fileNodes = await LocalFileNode.findAll({ raw: true });
  if (fileNodes.length) await RemoteFileNode.bulkCreate(fileNodes);
  console.log(`Migrated ${fileNodes.length} FileNodes`);
  
  // Problems
  const problems = await LocalProblem.findAll({ raw: true });
  if (problems.length) await RemoteProblem.bulkCreate(problems);
  console.log(`Migrated ${problems.length} Problems`);
  
  // Playlists
  const playlists = await LocalPlaylist.findAll({ raw: true });
  if (playlists.length) await RemotePlaylist.bulkCreate(playlists);
  console.log(`Migrated ${playlists.length} Playlists`);
  
  // Sheets
  const sheets = await LocalSheet.findAll({ raw: true });
  if (sheets.length) await RemoteSheet.bulkCreate(sheets);
  console.log(`Migrated ${sheets.length} Sheets`);
  
  // SheetProblems
  const sheetProbs = await LocalSheetProblem.findAll({ raw: true });
  if (sheetProbs.length) await RemoteSheetProblem.bulkCreate(sheetProbs);
  console.log(`Migrated ${sheetProbs.length} SheetProblems`);

  // Fix PostgreSQL Sequences
  const tables = ['FileNodes', 'Playlists', 'Sheets', 'SheetProblems'];
  for (const table of tables) {
    const max = await remoteDb.query(`SELECT MAX(id) FROM "${table}"`);
    const maxId = max[0][0].max || 0;
    await remoteDb.query(`ALTER SEQUENCE "${table}_id_seq" RESTART WITH ${Number(maxId) + 1}`);
  }
  
  console.log("Migration finished successfully!");
  process.exit(0);
}

migrate().catch(console.error);
