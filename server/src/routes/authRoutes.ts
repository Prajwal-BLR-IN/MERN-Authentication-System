import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOTP, sendVerifyOTP, verifyEmail } from '../controllers/authController';
import userAuth from '../middlewares/userAuth';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOTP);
authRouter.post('/verify-account', userAuth, verifyEmail);
// authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.get('/is-auth', isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOTP);
authRouter.post('/reset-password', resetPassword);

export default authRouter;

