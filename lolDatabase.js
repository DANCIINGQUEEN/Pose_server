//몽고db셋업

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbUrl = process.env.LOL_MONGODB_URL;

mongoose.Promise = global.Promise;
const lolDB=mongoose.createConnection(dbUrl, { useNewUrlParser: true });
mongoose.set("strictQuery", false);

lolDB.on('connected', () => console.log('Connected to Lol database'));
lolDB.on('error', () => console.log('Failed to connect to Lol database'));
lolDB.on('open', () => console.log('Connected to Lol MongoDB server'));
lolDB.on('disconnect', () => console.log('Disconnected from Lol MongoDB server'));

export default lolDB;