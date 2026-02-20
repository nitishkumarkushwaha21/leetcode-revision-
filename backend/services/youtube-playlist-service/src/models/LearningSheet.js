const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

/**
 * LearningSheet model — represents a generated DSA sheet from a YouTube playlist.
 * Maps to the `learning_sheets` table.
 */
const LearningSheet = sequelize.define(
  "LearningSheet",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    playlist_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "learning_sheets",
    timestamps: false,
  },
);

module.exports = LearningSheet;
