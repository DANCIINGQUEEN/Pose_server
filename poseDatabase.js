//몽고db셋업

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbUrl = process.env.POSE_MONGODB_URL;

mongoose.Promise = global.Promise;
const poseDB=mongoose.createConnection(dbUrl, { useNewUrlParser: true });
mongoose.set("strictQuery", false);

poseDB.on('connected', () => console.log('Connected to Pose database'));
poseDB.on('error', () => console.log('Failed to connect to Pose database', dbUrl));
poseDB.on('open', () => console.log('Connected to Pose MongoDB server', dbUrl));
poseDB.on('disconnect', () => console.log('Disconnected from Pose MongoDB server', dbUrl));

export default poseDB;