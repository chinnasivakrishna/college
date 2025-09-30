import { config } from 'dotenv';
config();
import mongoose from 'mongoose';
import SuperAdmin from './models/SuperAdmin.js';
import { connectDatabase } from './config/database.js';

async function run() {
  try {
    await connectDatabase();
    const exists = await SuperAdmin.findOne({ registerId: 'SA001' });
    if (exists) {
      // eslint-disable-next-line no-console
      console.log('Super Admin already exists');
    } else {
      await SuperAdmin.create({ name: 'Super Admin', registerId: 'SA001', password: 'SA001' });
      // eslint-disable-next-line no-console
      console.log('Super Admin created with registerId SA001 and default password SA001');
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

run();


