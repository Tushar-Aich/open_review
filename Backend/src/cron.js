import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { updateAllUserStats } from './utils/chessUpdater.js';

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    // Schedule the job every 20 minutes
    cron.schedule('*/1 * * * *', async () => {
      console.log('🕒 Running scheduled user stats update...');
      await updateAllUserStats();
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
