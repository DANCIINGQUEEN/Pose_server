const mongoose = require('mongoose')
const User = mongoose.model('user')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const updateProps = async (req, res, props, propName) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
        const userId = decodedToken._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updateData = { $set: { [propName]: props[propName] } };
        const updatedUser = await User.updateOne({ _id: userId }, updateData);

        if (updatedUser.n === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        // return res.json({ state: true });
        return true
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

let verifyCodes = {}
const userControl = {
    sendVerificationCode: async (req, res) => {
        try {
            const email = req.body.email;
            const verifyCode = Array.from({length: 6}, () =>
                Math.floor(Math.random() * 10)
            ).join("");
            verifyCodes[email] = verifyCode;

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.REACT_APP_NODEMAILER_USER,
                    pass: process.env.REACT_APP_NODEMAILER_PASS,
                },
            });

            const mailOptions = {
                from: process.env.REACT_APP_NODEMAILER_USER,
                to: email,
                subject: "Verification Code",
                text: `Your verification code is: ${verifyCode}`,
            };

            await transporter.sendMail(mailOptions);

            res.status(200).send(`인증번호가 이메일로 전송되었습니다. ${verifyCode}`);
        } catch (error) {
            res.status(400).send("Invalid email address");
        }
    },
    verifyCode: (req, res) => {
        const {email, verificationCode} = req.body;

        if (verifyCodes[email] && verifyCodes[email] === verificationCode) {
            res.status(200).send("Verification successful");
        } else {
            res.status(400).send("Invalid verification code");
        }
    },
    register: async (req, res) => {
        try {
            const {name, email, password, sex, area, height, weight, age, exercise, wishList} = req.body;
            const hashPass = await bcrypt.hash(password, 10);
            const newUser = new User({
                name,
                email,
                password: hashPass,
                sex,
                area,
                height,
                weight,
                age,
                exercise,
                wishList,
            });
            await newUser.save();
            res.send('User saved to database');
        } catch (error) {
            res.status(400).send(error);
        }
    },
    login: async (req, res) => {
        try {
            const user = await User.findOne({email: req.body.email})
            if (!user) return res.status(401).json({message: `Invalid email or password`})
            const isMatch = await bcrypt.compare(req.body.password, user.password)
            if (!isMatch) return res.status(401).json({
                message: `Invalid password`,
                email: req.body.email,
                pass: req.body.password,
                userPass: user.password
            })
            const token = jwt.sign({
                _id: user._id,
                email: user.email,
                name: user.name,
                currentTime: Math.floor(Date.now() / 1000)
            }, process.env.REACT_APP_JWT_SECRET)
            return res.json({token})
        } catch (err) {
            console.error(err)
            return res.status(500).json({message: `Internal Server Error`})
        }
    },
    getUserBasicInfo: (req, res) => {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({message: err})
            const user = {
                name: decoded.name,
                email: decoded.email
            }
            res.json(user)
        })
    },
    getUserFullInfo: async (req, res) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
            const user = await User.findOne({email: decoded.email});
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    },
    getRecommendUsers: async (req, res) => {
        try {
            const users = await User.find({}, {password: 0});
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    },
    followUser: async (req, res) => {
        const {userIdToFollow} = req.body
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decodedToken = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
            const userId = decodedToken._id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }
            const userToFollow = await User.findById(userIdToFollow);
            if (!userToFollow) {
                return res.status(404).json({message: 'User to follow not found'});
            }
            if (user.following.includes(userIdToFollow)) {
                return res.status(400).json({message: 'User is already being followed'});
            }
            user.following.push(userIdToFollow);
            userToFollow.followers.push(userId);
            //   await user.save();
            await Promise.all([user.save(), userToFollow.save()]);

            res.json({message: 'User followed successfully'});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    },
    unfollowUser: async (req, res) => {

    },
    goalSetting: async (req, res) => {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decodedToken = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
            const userId = decodedToken._id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }
            const data = req.body;
            console.log(user, data, data.userGoal.dDay, data.userGoal.goals);
            user.goal = {
                dDay: data.userGoal.dDay,
                goals: data.userGoal.goals
            }
            await user.save();

            // 클라이언트에게 성공 메시지 또는 필요한 응답을 보냅니다.
            res.status(200).json({message: '목표 정보가 성공적으로 저장되었습니다.'});

        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    },
    getFollowing: async (req, res) => {
        const {following} = req.body;
        // const q=following
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decodedToken = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
            const userId = decodedToken._id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }
            const followingUsers = await User.find({_id: {$in: following}});

            const followingNames = followingUsers.map((user) => [user.name, user.email]);

            res.json({following: followingNames});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    },
    getFollowers: async (req, res) => {
        const {followers} = req.body;
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decodedToken = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
            const userId = decodedToken._id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }

            const followerUsers = await User.find({_id: {$in: followers}});

            const followerNames = followerUsers.map((user) => [user.name, user.email]);

            res.json({followers: followerNames});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    },
    updateProfile: async (req, res) => {
        const { name, email } = req.body;
        const nameUpdated = await updateProps(req, res, { name }, 'name');
        const emailUpdated = await updateProps(req, res, { email }, 'email');
        if (nameUpdated && emailUpdated) {
            return res.json({ state: true });
        }

    },
    updateAge: async (req, res) => {
        const { age } = req.body;
        const ageUpdated= await updateProps(req, res, { age }, 'age');
        if (ageUpdated) {
            return res.json({ state: true });
        }
    },
    updateArea: async (req, res) => {
        const {area}=req.body;
        const areaUpdated=await updateProps(req, res, {area}, 'area');
        if (areaUpdated) {
            return res.json({ state: true });
        }
    },
    updateWeight: async (req, res) => {
        const {weight}=req.body;
        const weightUpdated=await updateProps(req, res, {weight}, 'weight');
        if (weightUpdated) {
            return res.json({ state: true });
        }
    },
    updateHeight: async (req, res) => {
        const {height}=req.body;
        const heightUpdated=await updateProps(req, res, {height}, 'height');
        if (heightUpdated) {
            return res.json({ state: true });
        }
    },
    updateExercise: async (req, res) => {
        const {exercise}=req.body;
        const exerciseUpdated=await updateProps(req, res, {exercise}, 'exercise');
        if (exerciseUpdated) {
            return res.json({ state: true });
        }
    },
    updateWishList: async (req, res) => {
        const {wishList}=req.body;
        const wishListUpdated=await updateProps(req, res, {wishList}, 'wishList');
        if (wishListUpdated) {
            return res.json({ state: true });
        }
    },
    isPasswordCorrect: async (req, res) => {
        const { password } = req.body;
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decodedToken = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
            const userId = decodedToken._id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
             res.json({state:isPasswordCorrect});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    },
    updatePassword: async (req, res) => {
        const { newPassword } = req.body;
        const password = await bcrypt.hash(newPassword, 10);
        const passwordUpdated=await updateProps(req, res, {password}, 'password');
        if (passwordUpdated) {
            return res.json({ state: true });
        }
    }


}

module.exports = userControl