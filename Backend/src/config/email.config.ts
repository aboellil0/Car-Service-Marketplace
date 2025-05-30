import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const EMAIL_HOST = process.env.EMAIL_HOST as string;
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT as string, 10);
const EMAIL_SECURE = parseInt(process.env.EMAIL_SECURE as string, 10); 
const EMAIL_USER = process.env.EMAIL_USER as string;
const EMAIL_PASS = process.env.EMAIL_PASS as string;
const EMAIL_FROM = process.env.EMAIL_FROM as string;


const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE === 120, 
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
    },
});

export const sendVerdicationEmail = async (to: string, token: string): Promise<void> => {
    const mailOptions = {
        from: EMAIL_FROM,
        to,
        subject: 'Email Verification',
        text: `Please verify your email by clicking on the following link: http://localhost:3000/verify-email?token=${token}`,
        html: `<p>Please verify your email by clicking on the following link:</p><a href="http://localhost:3000/verify-email?token=${token}">Verify Email</a>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}


export const sendPasswordResetEmail = async (to: string, token: string): Promise<void> => {
    const mailOptions = {
        from: EMAIL_FROM,
        to,
        subject: 'Password Reset',
        text: `Please reset your password by clicking on the following link: http://localhost:3000/reset-password?token=${token}`,
        html: `<p>Please reset your password by clicking on the following link:</p><a href="http://localhost:3000/reset-password?token=${token}">Reset Password</a>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
}