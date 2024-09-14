import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    contact: { type: String, required: true },
    email: { type: String, required: true },
    phoneOtp: { type: String, required: true },
    emailOtp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // Automatically delete after 5 minutes (300 seconds)
});

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;
