const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ContactSubmission = sequelize.define('ContactSubmission', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userType: {
    type: DataTypes.STRING, // JobSeeker or Employer
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = ContactSubmission;
