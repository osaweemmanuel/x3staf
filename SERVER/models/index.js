const sequelize = require("../config/database").sequelize;
const User = require("./User");
const Job = require("./Job");
const JobApp = require("./JobApp");
const Token = require("./Token");
const UserProfile = require("./UserProfile");
const Timesheet = require("./Timesheet");
const Notification = require("./Notification");
const KYC = require("./KYC");
const EmployerRequest = require("./EmployerRequest");
const ContactSubmission = require("./ContactSubmission");

// Define Associations
JobApp.belongsTo(Job, { foreignKey: 'jobId' });
Job.hasMany(JobApp, { foreignKey: 'jobId' });
JobApp.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(JobApp, { foreignKey: 'userId' });
JobApp.belongsTo(UserProfile, { foreignKey: 'userId', targetKey: 'userId' });
User.hasOne(UserProfile, { foreignKey: 'userId' });
UserProfile.belongsTo(User, { foreignKey: 'userId' });
Timesheet.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Timesheet, { foreignKey: 'userId' });
KYC.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(KYC, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Job,
  JobApp,
  Token,
  UserProfile,
  Timesheet,
  Notification,
  KYC,
  EmployerRequest,
  ContactSubmission
};
