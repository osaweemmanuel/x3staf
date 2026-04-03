const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const KYC = sequelize.define("KYC", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  documentType: {
    type: DataTypes.ENUM("Passport", "DriversLicense", "NationalID", "Other"),
    allowNull: false,
  },
  documentData: {
    type: DataTypes.TEXT("long"), // Store base64 or path
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Pending", "Verified", "Rejected"),
    defaultValue: "Pending",
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['status'] },
  ]
});

module.exports = KYC;
