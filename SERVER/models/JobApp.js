const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JobApp = sequelize.define('JobApp', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Jobs',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Submitted", "Reviewed", "Interviewing", "Hired", "Rejected"),
    defaultValue: "Submitted",
  },
  resumeUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  workEligibility: {
    type: DataTypes.ENUM("Canadian Citizen", "Permanent Resident", "Work Permit"),
    allowNull: true,
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['jobId'] },
    { fields: ['status'] },
  ]
});

module.exports = JobApp;
