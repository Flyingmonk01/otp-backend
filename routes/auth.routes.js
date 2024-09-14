import express from 'express';
import {  Login, sendOtp, Signup, validateOtp } from '../controllers/user.controller.js';
const router = express.Router();


router.route('/SendOtp').post(sendOtp)
router.route('/validate-otp').post(validateOtp)
router.route('/Signup').post(Signup)
router.route('/Login').post(Login)

export default router;