const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

/**
 * SheetProblem model — represents a single LeetCode problem in a learning sheet.
 * Maps to the `sheet_problems` table.
 */
const SheetProblem = sequelize.define(
  "SheetProblem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sheet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title_slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leetcode_link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    youtube_link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    difficulty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    starter_code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    confidence_score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "sheet_problems",
    timestamps: false,
  },
);

module.exports = SheetProblem;
