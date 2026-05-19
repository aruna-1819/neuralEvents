import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import events from './data/events.js';
import User from './models/User.js';
import Event from './models/Event.js';
import Ticket from './models/Ticket.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Event.deleteMany();
    await User.deleteMany();
    await Ticket.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleEvents = events.map((event) => {
      return { ...event, organizer: adminUser };
    });

    await Event.insertMany(sampleEvents);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Event.deleteMany();
    await User.deleteMany();
    await Ticket.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
