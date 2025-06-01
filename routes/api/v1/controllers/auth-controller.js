import bcrypt from 'bcrypt';
import initKnex from 'knex';
import configuration from '../../../../knexfile.js';
import { logError } from '../../../../utils/logger.js';
import authModel from '../model/auth-model.js';

const knex = initKnex(configuration);   

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
            verificationRequested: true,
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

const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const isValidEmail = authModel.validateEmail(email);
        if (!isValidEmail.valid) {
            return res.status(400).json({ error: isValidEmail.error });
        }

        const user = await knex('users')
            .select('id',
                    'firstName', 
                    'lastName', 
                    'email',
                    'verificationRequested', 
                    'emailVerificationTokenExpires')
            .where({ email: isValidEmail.email })
            .first();

        if (user && user.email === isValidEmail.email) {
            return res.status(200).json({
                emailIsAvailable: false,
                message: 'Email is already registered'
            });
        }

        res.status(200).json({
            emailIsAvailable: true,
            message: 'Email is available'
        });
    } catch (error) {
        logError(error, 'checkEmail');
        res.status(500).json({ error: 'Error checking email' });
    }
};

const loginWithPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const isValidEmail = authModel.validateEmail(email);
        if (!isValidEmail.valid) {
            return res.status(400).json({ error: isValidEmail.error });
        }

        const isValidPassword = authModel.validatePassword(password);
        if (!isValidPassword.valid) {
            return res.status(400).json({ error: isValidPassword.error });
        }

        const user = await knex('users')
            .select('id',
                    'firstName', 
                    'lastName', 
                    'email', 
                    'password', 
                    'verificationRequested', 
                    'emailVerificationTokenExpires')
            .where({ email: isValidEmail.email })
            .first();

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.password !== isValidPassword.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.verificationRequested === true) {
            return res.status(403).json({ 
                message: 'Please verify your email before logging in',
                verificationTokenExpires: user.emailVerificationTokenExpires 
            });
        }

        await knex('users')
            .where({ id: user.id })
            .update({ lastLogin: new Date() });
        
        const jwtToken = authModel.jwtToken(user.id, user.email);
        res.status(200).json({
            token: jwtToken,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        logError(error, 'loginWithPassword');
        res.status(500).json({ error: 'Error during login' });
    }
};

const loginWithEmailToken = async (req, res) => {
    try {
        const { email } = req.body;

        const isValidEmail = authModel.validateEmail(email);
        if (!isValidEmail.valid) {
            return res.status(400).json({ error: isValidEmail.error });
        }

        const user = await knex('users')
            .select('id',
                    'firstName', 
                    'lastName', 
                    'email', 
                    'password', 
                    'verificationRequested', 
                    'emailVerificationTokenExpires')
            .where({ email: isValidEmail.email })
            .first();

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.verificationRequested === true) {
            return res.status(403).json({ 
                message: 'Please verify your email before logging in',
                verificationTokenExpires: user.emailVerificationTokenExpires 
            });
        }

        const { token: verificationToken, expires: verificationTokenExpires } = 
            await authModel.sendVerificationEmail(email, 5 * 60 * 1000);

        await knex('users')
            .where({ id: user.id })
            .update({
                emailVerificationToken: verificationToken,
                emailVerificationTokenExpires: verificationTokenExpires,
                verificationRequested: true,
                updatedAt: new Date()
            });

        res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
        logError(error, 'loginWithPassword');
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
            .select('id', 
                    'firstName', 
                    'lastName', 
                    'email', 
                    'phone', 
                    'emailVerificationToken', 
                    'emailVerificationTokenExpires', 
                    'verificationRequested')
            .where({ id: isValidUserId.userId })
            .first();

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (user.verificationRequested === false) {
            return res.status(400).json({ error: 'User already verified' });
        }

        if (user.emailVerificationTokenExpires < new Date()) {
            return res.status(400).json({ verificationTokenExpires: verificationTokenExpires });
        }

        if (user.emailVerificationToken !== token) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        await knex('users')
            .where({ id: user.id })
            .update({
                emailVerificationToken: "",
                emailVerificationTokenExpires: new Date(),
                verificationRequested: false,
                updatedAt: new Date()
            });

        const jwtToken = authModel.jwtToken(user.id, user.email);
        res.status(200).json({ 
            token: jwtToken,
            message: 'Token verified successfully',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        logError(error, 'verifyEmailToken');
        res.status(500).json({ error: 'Error verifying email' });
    }
};

const resendVerificationToken = async (req, res) => {
    try {
        const { userId } = req.params;
        const isValidUserId = authModel.validateUserId(userId);
        if (!isValidUserId.valid) {
            return res.status(400).json({ error: isValidUserId.error });
        }

        const user = await knex('users')
            .select('id', 'email', 'verificationRequested', 'emailVerificationToken', 'emailVerificationTokenExpires')
            .where({ id: isValidUserId.userId })
            .first();

        if (!user) {
            return res.status(404).json({ error: 'User not found or already verified' });
        }

        if (user.verificationRequested === false) {
            return res.status(400).json({ error: 'User already verified' });
        }

        if (user.emailVerificationTokenExpires > new Date()) {
            return res.status(400).json({ error: 'Verification token has not expired' });
        }

        const { token: verificationToken, expires: verificationTokenExpires } = 
            await authModel.sendVerificationEmail(user.email, 5 * 60 * 1000);

        await knex('users')
            .where({ id: user.id })
            .update({
                emailVerificationToken: verificationToken,
                emailVerificationTokenExpires: verificationTokenExpires,
                verificationRequested: true,
                updatedAt: new Date()
            });

        res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
        logError(error, 'resendVerificationToken');
        res.status(500).json({ error: 'Error sending verification email' });
    }
}; 

export {
    signup,
    checkEmail,
    loginWithPassword,
    loginWithEmailToken,
    verifyEmailToken,
    resendVerificationToken
}