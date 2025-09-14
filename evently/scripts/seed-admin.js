const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/evently';

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@evently.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@evently.com',
      passwordHash,
      role: 'admin',
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@evently.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();