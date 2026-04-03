const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EmployerRequest = sequelize.define('EmployerRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  province: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numberOfPositions: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bestTimeToCall: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = EmployerRequest;
