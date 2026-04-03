const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserProfile = sequelize.define('UserProfile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
  email: DataTypes.STRING,
  role: DataTypes.STRING,
  streetAddress: DataTypes.STRING,
  streetAddressLine2: DataTypes.STRING,
  city: DataTypes.STRING,
  stateProvince: DataTypes.STRING,
  preferredJobType: DataTypes.STRING,
  preferredLocations: DataTypes.STRING,
  availableStartDate: DataTypes.STRING,
  availability: DataTypes.JSON,
  daysAvailable: DataTypes.JSON,
  methodOfTransportation: DataTypes.JSON,
  additionalNotes: DataTypes.TEXT,
  memo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  yearsOfConstructionExperience: DataTypes.INTEGER,
  otherExperience: DataTypes.JSON,
  equipmentsOwned: DataTypes.JSON,
  certifications: DataTypes.JSON, // Array of objects
}, {
  timestamps: true,
});

module.exports = UserProfile;
