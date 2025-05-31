import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import knex from '../../../../knexfile.js';
import { sendVerificationEmail } from '../../../../utils/email.js';
import { logError } from '../../../../utils/logger.js';
import authModel from '../model/auth-model.js';

    

const signup = async (req, res) => {
    try {
        const isValid = authModel.validateSignup(req.body);
        
        if (!isValid.valid) {
            return res.status(400).json({ error: isValid.error });
        }

        const existingUser = await knex('users')
            .where({ email: isValid.email })
            .first();
        if (existingUser) {
            return res.status(422).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(isValid.password, 10);
        const { token: verificationToken, expires: verificationTokenExpires } = 
            await authModel.sendVerificationEmail(isValid.email, 5 * 60 * 1000); 
        
        const userId = await knex('users').insert({
            firstName: isValid.firstName,
            lastName: isValid.lastName,
            email: isValid.email,
            phone: isValid.phone,
            password: hashedPassword,
            emailVerificationToken: verificationToken,
            emailVerificationTokenExpires: verificationTokenExpires,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({
            message: 'User registered successfully. Please check your email to verify your account.',
            userId: userId[0],
            verificationTokenExpires: verificationTokenExpires
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

const verifyEmailToken = async (req, res) => {
    try {
        const { userId, token } = req.params;

        const isValidUserId = authModel.validateUserId(userId);
        if (!isValidUserId.valid) {
            return res.status(400).json({ error: isValidUserId.error });
        }

        const isValidToken = authModel.validateToken(token);
        if (!isValidToken.valid) {
            return res.status(400).json({ error: isValidToken.error });
        }

        const user = await knex('users')
            .select('id', 'emailVerificationToken', 'emailVerificationTokenExpires', 'emailVerified')
            .where({
                id: isValidUserId.userId
            })
            .first();

        if (!user || !user.emailVerificationToken || !user.emailVerificationTokenExpires) {
            return res.status(400).json({ error: 'Invalid user ID.' });
        }

        if (user.emailVerificationTokenExpires < new Date()) {
            return res.status(400).json({ error: 'Verification token has expired' });
        }

        await knex('users')
            .where({ id: user.id })
            .update({
                emailVerificationToken: "",
                emailVerificationTokenExpires: new Date(),
                updatedAt: new Date()
            });

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        logError(error, 'verifyEmailToken');
        res.status(500).json({ error: 'Error verifying email' });
    }
};

const resendVerificationToken = async (req, res) => {
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
    verifyEmailToken,
    resendVerificationToken
}