const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Token = sequelize.define('Token', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  purpose: {
    type: DataTypes.STRING, // 'email' or 'forgotpassword'
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    defaultValue: () => new Date(Date.now() + 5 * 60 * 1000), // 5 mins
  },
}, {
  timestamps: true,
});

module.exports = Token;
