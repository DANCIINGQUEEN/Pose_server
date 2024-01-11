// import mongoose from "mongoose";
// import User from "../models/lolUser.js";
// import nodemailer from "nodemailer";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import dotenv from "dotenv";
// dotenv.config();

// let verifyCodes = {}
// const lolUserControl = {
//     sendVerificationCode: (req, res) => {
//         const email = req.body.email
//         const verifyCode = Array.from({length: 6}, () => Math.floor(Math.random() * 10)).join("");
//         verifyCodes[email] = verifyCode;
//         // Set up email transporter
//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.NODEMAILER_USER,
//                 pass: process.env.NODEMAILER_PASS
//             }
//         });
//         const mailOptions = {
//             from: process.env.NODEMAILER_USER,
//             to: email,
//             subject: "Verification Code",
//             text: `Your verification code is: ${verifyCode}`
//         };
//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 res.status(400).send("Invalid email address");
//             } else {
//                 res.status(200).send(`Verification code sent to email ${verifyCode}`);
//             }
//         });

//     },
//     verifyCode: (req, res) => {
//         const email = req.body.email;
//         const enteredCode = req.body.verificationCode;
//         // Compare the code entered by the user to the code stored in the verificationCodes object
//         if (verifyCodes[email] && verifyCodes[email] === enteredCode) {
//             res.status(200).send("Verification successful");
//         } else {
//             res.status(400).send("Invalid verification code");
//         }
//     },
//     register: async (req, res) => {
//         const password = req.body.password
//         const hashPass = await bcrypt.hash(password, 10)
//         const newUser = new User({
//             name: req.body.name,
//             email: req.body.email,
//             password: hashPass,
//         })
//         newUser.save()
//             .then(() => res.send('User saved to database'))
//             .catch(err => res.status(400).send(err))
//     },
//     login: async (req, res) => {
//         try {
//             const user = await User.findOne({email: req.body.email})
//             if (!user) return res.status(401).json({message: `Invalid email or password`})
//             const isMatch = await bcrypt.compare(req.body.password, user.password)
//             if (!isMatch) return res.status(401).json({
//                 message: `Invalid password`,
//                 email: req.body.email,
//                 pass: req.body.password,
//                 userPass: user.password
//             })
//             const token = jwt.sign({
//                 _id: user._id,
//                 email: user.email,
//                 name: user.name,
//                 currentTime: Math.floor(Date.now() / 1000)
//             }, process.env.JWT_SECRET)
//             return res.json({token: token})
//         } catch (err) {
//             console.error(err)
//             return res.status(500).json({message: `Internal Server Error`})
//         }
//     },
//     getUser: (req, res) => {
//         const token = req.headers.authorization.split(" ")[1];
//         jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, decoded) => {
//             if (err) return res.status(401).json({message: err})
//             const user = {
//                 name: decoded.name,
//                 email: decoded.email
//             }
//             res.json(user)
//         })
//     }
// }

// export default lolUserControl;