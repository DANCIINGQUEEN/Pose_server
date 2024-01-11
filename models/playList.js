import mongoose from 'mongoose';
import lolDB from '../lolDatabase.js';

const playListSchema = new mongoose.Schema({
    date: {type: String, required: true},
    video: [{
        title:{type:String, required: true},
        link:{type:String, required:true}
    }]
})

// mongoose.model('playList', playListSchema)
const playListModel = lolDB.model('playList', playListSchema);
export default playListModel;