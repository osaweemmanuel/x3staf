const { Job } = require('./models');
const { sequelize } = require('./config/database');

async function checkJobs() {
  try {
    await sequelize.authenticate();
    const jobs = await Job.findAll();
    console.log('Total Jobs in Database:', jobs.length);
    jobs.forEach(j => {
      console.log(`- ${j.title} (ID: ${j.id}, assignedTo: ${j.assignedTo})`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkJobs();
