const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

async function resetDatabase() {
  try {
    console.log('Using MongoDB URI:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    try {
      // Drop the users collection
      await mongoose.connection.db.collection('users').drop();
      console.log('Dropped users collection');
    } catch (error) {
      if (error.code === 26) {
        console.log('Users collection does not exist, skipping drop');
      } else {
        throw error;
      }
    }

    try {
      // Drop all indexes
      await mongoose.connection.db.collection('users').dropIndexes();
      console.log('Dropped all indexes on users collection');
    } catch (error) {
      if (error.code === 26) {
        console.log('Users collection does not exist, skipping index drop');
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

resetDatabase();
