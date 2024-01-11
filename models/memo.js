import mongoose from "mongoose";
import lolDB from "../lolDatabase.js"

const memoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content:{type:String, required:true}
})

const memoModel = lolDB.model('memo', memoSchema);
export default memoModel;