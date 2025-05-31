import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import knex from '../../../../knexfile.js';
import { sendVerificationEmail } from '../../../../utils/email.js';
import { logError } from '../../../../utils/logger.js';
import authModel from '../model/auth-model.js';

const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        const existingUser = await knex('users')
            .where({ email })
            .first();
        if (existingUser) {
            return res.status(422).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const { token: verificationToken, expires: verificationTokenExpires } = 
            await authModel.sendVerificationEmail(email, 60 * 1000); 
        
        const userId = await knex('users').insert({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            emailVerificationToken: verificationToken,
            emailVerificationTokenExpires: verificationTokenExpires,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({
            message: 'User registered successfully. Please check your email to verify your account.',
            userId: userId[0]
        });
    } catch (error) {
        logError(error, 'signup');
        res.status(500).json({ error: 'Error creating user' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await knex('users')
            .where({ email })
            .first();

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if email is verified
        if (!user.emailVerified) {
            return res.status(403).json({ error: 'Please verify your email before logging in' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Update last login
        await knex('users')
            .where({ id: user.id })
            .update({ lastLogin: new Date() });

        res.json({
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error during login' });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await knex('users')
            .where({
                emailVerificationToken: token,
                emailVerified: false
            })
            .first();

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        }

        if (user.emailVerificationTokenExpires < new Date()) {
            return res.status(400).json({ error: 'Verification token has expired' });
        }

        // Update user
        await knex('users')
            .where({ id: user.id })
            .update({
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationTokenExpires: null,
                updatedAt: new Date()
            });

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ error: 'Error verifying email' });
    }
};

const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await knex('users')
            .where({ email, emailVerified: false })
            .first();

        if (!user) {
            return res.status(404).json({ error: 'User not found or already verified' });
        }

        // Get new verification code and expiration from AuthModel
        const { token: verificationToken, expires: verificationTokenExpires } = 
            await authModel.sendVerificationEmail(email, 60 * 1000); // 60 seconds in milliseconds

        // Update user with new token
        await knex('users')
            .where({ id: user.id })
            .update({
                emailVerificationToken: verificationToken,
                emailVerificationTokenExpires: verificationTokenExpires,
                updatedAt: new Date()
            });

        res.json({ message: 'Verification email sent successfully' });
    } catch (error) {
        console.error('Resend verification email error:', error);
        res.status(500).json({ error: 'Error sending verification email' });
    }
}; 

export {
    signup, 
    login,
    verifyEmail,
    resendVerificationEmail
}