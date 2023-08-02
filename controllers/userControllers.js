const mongoose = require('mongoose')
const User = mongoose.model('user')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const getUserFromToken = async (req) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
    const userId = decodedToken._id;
    const user = await User.findById(userId);
    return user;
};
const checkUserExists = (user, res) => {
    if (!user) {
        return res.status(404).json({message: 'User not found'});
    }
};

const updateProps = async (req, res, props, propName) => {
    try {
        const user = await getUserFromToken(req)
        checkUserExists(user, res);
        const updateData = {$set: {[propName]: props[propName]}};
        const updatedUser = await User.updateOne({_id: user._id}, updateData);
        if (updatedUser.n === 0) {
            return res.status(404).json({message: 'User not found'});
        }
        return true
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};
const updateProfile = async (req, res, propName) => {
    const dataToUpdate = req.body;
    const updated = await updateProps(req, res, dataToUpdate, propName);
    if (updated) {
        return res.json({state: true});
    }
};

let verifyCodes = {}
const userControl = {
    sendVerificationCode: async (req, res) => {
        try {
            const {email} = req.body
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
    getUserFullInfo: async (req, res) => {
        try {
            const user = await getUserFromToken(req)
            res.json(user);
        } catch (err) {
            console.error(err);
            res.status(500).json({message: "Internal Server Error"});
        }
    },
    getRecommendUsers: async (req, res) => {
        try {
            const user = await getUserFromToken(req);
            checkUserExists(user, res);
            const followingIds = await User.find(
                {_id: user._id},
                {following: 1}
            ).lean();
            const followingUserIds = followingIds.length > 0 ? followingIds[0].following : [];
            const recommendedUsers = await User.find({
                _id: {$ne: user._id, $nin: followingUserIds},
            });
            res.json({recommendedUsers});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    },
    followUser: async (req, res) => {
        const {userIdToFollow} = req.body
        try {
            const user = await getUserFromToken(req)
            checkUserExists(user, res);
            const userToFollow = await User.findById(userIdToFollow);
            if (!userToFollow) {
                return res.status(404).json({message: 'User to follow not found'});
            }
            if (user.following.includes(userIdToFollow)) {
                return res.status(400).json({message: 'User is already being followed'});
            }
            user.following.push(userIdToFollow);
            userToFollow.followers.push(user._id);
            await user.save();
            await userToFollow.save();
            const followingUsers = await User.find({_id: {$in: user.following}});
            const followingNames = followingUsers.map((user) => [user._id, user.name, user.email]);
            res.json({following: user.following, followingNames: followingNames});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    },
    getUnfollow: async (req, res) => {
        const {friend} = req.body
        try {
            const user = await getUserFromToken(req)
            checkUserExists(user, res);
            const userToUnfollow = await User.findById(friend);
            if (!userToUnfollow) {
                return res.status(404).json({message: 'User to unfollow not found'});
            }
            if (!user.following.includes(friend)) {
                return res.status(400).json({message: 'User is not being followed'});
            }
            await User.updateOne({_id: user._id}, {$pull: {following: friend}});
            await User.updateOne({_id: friend}, {$pull: {followers: user._id}});
            const updatedUser = await User.findById(user._id);
            const followingUsers = await User.find({_id: {$in: updatedUser.following}});
            const followingNames = followingUsers.map((user) => [user._id, user.name, user.email]);
            res.json({f: friend, following: updatedUser.following, followingNames: followingNames})
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    },
    initialFollower: async (req, res) => {
        const {userId} = req.body
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }

            // Clear the followers array
            user.followers = [];
            await user.save();

            res.json({msg: 'success', name: user.name, followers: user.followers});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }

    },
    goalSetting: async (req, res) => {
        try {
            const user = await getUserFromToken(req)
            checkUserExists(user, res);
            const data = req.body;
            user.goal = {
                dDay: data.userGoal.dDay,
                goals: data.userGoal.goals
            }
            await user.save();
            res.status(200).json({message: '목표 정보가 성공적으로 저장되었습니다.'});

        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    },
    getFollowing: async (req, res) => {
        const {following} = req.body;
        try {
            const user = await getUserFromToken(req)
            checkUserExists(user, res);
            const followingUsers = await User.find({_id: {$in: following}});
            const followingNames = followingUsers.map((user) => [user._id, user.name, user.email]);
            res.json({following: followingNames});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    },
    getFollowers: async (req, res) => {
        const {followers} = req.body;
        try {
            const user = await getUserFromToken(req)
            checkUserExists(user, res);

            const followerUsers = await User.find({_id: {$in: followers}});
            const followerNames = followerUsers.map((user) => [user._id, user.name, user.email]);
            res.json({followers: followerNames});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    },
    updateProfile: async (req, res) => {
        const {name, email} = req.body;
        const nameUpdated = await updateProps(req, res, {name}, 'name');
        const emailUpdated = await updateProps(req, res, {email}, 'email');
        if (nameUpdated && emailUpdated) {
            return res.json({state: true});
        }

    },
    updateInformation: async (req, res) => {
        const {item} = req.body;
        await updateProfile(req, res, item)
    },
    isPasswordCorrect: async (req, res) => {
        const {password} = req.body;
        try {
            const user = await getUserFromToken(req)
            checkUserExists(user, res);
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            res.json({state: isPasswordCorrect});
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
        }
    },
    updatePassword: async (req, res) => {
        const {newPassword} = req.body;
        const password = await bcrypt.hash(newPassword, 10);
        const passwordUpdated = await updateProps(req, res, {password}, 'password');
        if (passwordUpdated) {
            return res.json({state: true});
        }
    }


}

module.exports = userControl