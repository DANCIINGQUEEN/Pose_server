const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema({
    dDay: {type: Date, required: true},
    goals: [{
        label: {type: String, required: true},
        cycle: {type: String, required: true},
        number: {type: String, required: true},
        attain: {type: String, default: '0', required: false}
    }]
});
const userPostSchema = new mongoose.Schema({
    image: {type: String, required: true},
    content: {type: String, required: true},
    date: {type: Date, default: Date.now},
    likes: [{type: String, required: true}],
    comments: [{
        user: {type: String, required: true},
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
        content: {type: String, required: true},
    }]
})
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    sex: {type: String, required: false},
    area: {type: String, required: false},
    height: {type: String, required: false},
    weight: {type: String, required: false},
    age: {type: String, required: false},
    exercise: {type: String, required: false},
    wishList: {type: Array, required: false},
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    goal: {type: goalSchema, required: false},
    post: [{type: userPostSchema, required: false}],
    team: [{type: mongoose.Schema.Types.ObjectId, ref: 'team'}]
})

mongoose.model('user', userSchema)


