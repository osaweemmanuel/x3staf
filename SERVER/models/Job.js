const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timePosted: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  province: {
    type: DataTypes.ENUM("Ontario", "Quebec", "BC", "Alberta", "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick", "PEI", "Newfoundland", "Yukon", "NWT", "Nunavut"),
    allowNull: true,
  },
  compensation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employmentType: {
    type: DataTypes.ENUM("Full-time", "Part-time", "Contract", "Freelance"),
    allowNull: false,
  },
  minimumExperience: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  closingDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  jobDescriptionPdf: {
    type: DataTypes.JSON, // { data: string, contentType: string }
    allowNull: true,
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id',
    },
    defaultValue: null,
  },
  jobCategory: {
    type: DataTypes.ENUM("Internal", "External"),
    defaultValue: "External",
    allowNull: false,
  },
}, {
  timestamps: true,
  indexes: [
    { fields: ['assignedTo'] },
    { fields: ['jobCategory'] },
    { fields: ['department'] },
  ]
});

module.exports = Job;
