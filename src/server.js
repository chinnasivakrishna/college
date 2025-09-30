import { config } from 'dotenv';
config();

import app from './app.js';
import { connectDatabase } from './config/database.js';

const port = process.env.PORT || 5000;

async function start() {
  try {
    await connectDatabase();
    const server = app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${port}`);
    });

    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((sig) => {
      process.on(sig, async () => {
        // eslint-disable-next-line no-console
        console.log(`Received ${sig}. Closing server...`);
        server.close(() => process.exit(0));
      });
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();


