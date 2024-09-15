import User from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import otpGenerator from 'otp-generator';
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import OTP from '../models/otp.model.js';


let transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'sameerrai350@gmail.com',
        pass: 'holydeofedcezplt'
    }
})


const accountSid = 'ACef211ee5fc159b172021d9c247ec8fee';
const authToken = 'd202e9e4de4504094f3d2d2fa88d0878';   // Replace with your Twilio Auth Token
const client = twilio(accountSid, authToken);



export const sendOtp = asyncHandler(async (req, res) => {
    const { contact, email } = req.body;

    const phoneOtp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    const emailOtp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    
    console.log(`Sending SMS OTP to ${contact}: ${phoneOtp}`);
    console.log(`Sending Email OTP to ${email}: ${emailOtp}`);
    
    try {
        
        await client.messages.create({
            body: `Your OTP is ${phoneOtp}`,   // Message content
            from: '+12079458902',          // Your Twilio phone number (replace with your actual Twilio number)
            to: contact                   // User's phone number (in E.164 format, e.g., +14155552671)
        });
        
        await transporter.sendMail({
            to: email,
            subject: 'Otp verification for test',
            html: `This is a otp you requested for verification. Otp: ${emailOtp}`
        })
        console.log('send');
        
    
        // Store OTP in MongoDB with a TTL
        const newOtp = new OTP({
            contact,
            email,
            phoneOtp,
            emailOtp
        });
    
        await newOtp.save();

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'OTP sent failed'
        });
    }

});



export const validateOtp = asyncHandler(async (req, res) => {
    const { contact, email, phoneOtp, emailOtp } = req.body;

    // Retrieve OTP from the database
    const otpDetails = await OTP.findOne({ contact, email });

    // If no OTP is found (expired or invalid)
    if (!otpDetails) {
        return res.status(400).json({
            success: false,
            message: 'OTP not found or expired'
        });
    }

    // Check if the OTPs match
    if (otpDetails.phoneOtp !== phoneOtp || otpDetails.emailOtp !== emailOtp) {
        return res.status(400).json({
            success: false,
            message: 'Invalid OTP'
        });
    }

    // OTP is valid, delete the record from the database manually (if desired)
    await OTP.deleteOne({ contact, email });

    return res.status(200).json({
        success: true,
        message: 'OTP verified successfully'
    });
});



export const Signup = asyncHandler(async (req, res) => {
    const { username, contact, password } = req.body;
    console.log("Received signup request:", { username, contact, password });

    if (!username || !contact || !password) {
        return res.status(400).json({ success: false, message: "Enter all credentials !!!" });
    }

    const userExists = await User.findOne({ contact });
    if (userExists) {
        return res.status(400).json({ success: false, message: "User Already Exists" });
    }

    // Here have to add the otp validation but otp is coming from different screen in frontend?

    const user = await User.create({
        username,
        contact,
        password,
    });

    if (user) {
        return res.status(201).json({
            success: true,
            id: user._id,
            username: user.username,
            contact: user.contact,
        });
    } else {
        return res.status(400).json({
            success: false,
            message: "Error occurred during signup",
        });
    }
});



export const Login = asyncHandler(async (req, res, next) => {
    try {
        const { contact, password } = req.body;

        if (!contact || !password) {
            return res.status(400).json({ success: false, message: "Enter all credentials !!!" });
        }

        const userExists = await User.findOne({ contact });

        if (!userExists) {
            return res.status(404).json({ success: false, message: "User does not exist !!!" });
        }

        const isPasswordValid = await userExists.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid Id or Password !!!" });
        }

        res.status(200).json({
            success: true,
            message: 'User Logged in successfully',
            username: userExists?.username,
            contact: userExists?.contact,
            todos: userExists?.todos
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({
            success: false,
            message: 'Something went wrong!!!',
            error: error.message
        });
    }
});
