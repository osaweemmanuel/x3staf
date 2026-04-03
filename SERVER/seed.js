const { User } = require('./models');
const { hashPassword } = require('./helpers/auth');
const { sequelize } = require('./config/database');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected for seeding...');
    
    // Sync tables
    await sequelize.sync({ alter: true });
    console.log('Tables synced...');

    // Hash the password
    const hashedPassword = await hashPassword('admin1234567890');

    // Create Admin User
    const [admin, created] = await User.findOrCreate({
      where: { email: 'admin@x3staffing.ca' },
      defaults: {
        username: 'Main Administrator',
        email: 'admin@x3staffing.ca',
        password: hashedPassword,
        roles: ['Admin'],
        verified: true,
        active: true
      }
    });

    if (created) {
      console.log('✅ Admin user created successfully!');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
