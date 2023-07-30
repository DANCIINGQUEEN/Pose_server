const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema({
    dDay: { type: Date, required: true },
    goals: [{
        label: { type: String, required: true },
        cycle: { type: String, required: true },
        number: { type: String, required: true },
        attain:{ type: String, default: '0',required: false }
    }]
});
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    sex: {type: String, required: true},
    area: {type: String, required: true},
    height: {type: String, required: true},
    weight: {type: String, required: true},
    age: {type: String, required: true},
    exercise: {type: String, required: true},
    wishList: {type: Array, required: true},
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    goal: { type: goalSchema, required: false }
})

mongoose.model('user', userSchema)


