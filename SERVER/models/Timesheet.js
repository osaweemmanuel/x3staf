const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Timesheet = sequelize.define("Timesheet", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  weekEnding: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  screenshot: {
    type: DataTypes.TEXT("long"), // Store base64 or path
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
    defaultValue: "Pending",
  },
  totalHours: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  }
}, {
  timestamps: true,
});

module.exports = Timesheet;
