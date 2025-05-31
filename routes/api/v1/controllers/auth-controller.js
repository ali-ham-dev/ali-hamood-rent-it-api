import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import knex from '../../../../knexfile.js';
import { sendVerificationEmail } from '../../../../utils/email.js';
import { logError } from '../../../../utils/logger.js';
import authModel from '../model/auth-model.js';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^(?!.*\s{2})[A-Za-z\s-]+$/;    
const PHONE_REGEX = /\D/g;

const validateName = (name) => {
    if (!name) {
        return {
            valid: false,
            error: 'Name error',
            name: null
        }
    }

    if (name > 2 || name < 50 ||
        !NAME_REGEX.test(name)
    ) {
        return {
            valid: false,
            error: 'Name error',
            name: null
        }
    }

    return {
        valid: true,
        error: null,
        name: name
    }
}

const validateEmail = (email) => {
    if (!email) {
        return {
            valid: false,
            error: 'Email error',
            email: null
        }
    }

    if (email > 254 || !EMAIL_REGEX.test(email)) {
        return {
            valid: false,
            error: 'Email error',
            email: null
        }
    }
    
    return {
        valid: true,
        error: null,
        email: email
    }
}

const validatePhone = (phone) => {
    if (!phone) {
        return {
            valid: false,
            error: 'Phone error',
            phone: null
        }
    }

    const numberOnlyPhone = phone.replace(PHONE_REGEX, '');

    if (numberOnlyPhone.length < 10 || numberOnlyPhone.length > 15) {
        return {
            valid: false,
            error: 'Phone error',
            phone: null
        }
    }

    return {
        valid: true,
        error: null,
        phone: numberOnlyPhone
    }
}

const validatePassword = (password) => {
    if (!password) {
        return {
            valid: false,
            error: 'Password error',
            password: null
        }
    }

    if (password.length < 8 || password.length > 128) {
        return {
            valid: false,
            error: 'Password error',
            password: null
        }
    }

    return {
        valid: true,
        error: null,
        password: password
    }
}

const validateSignup = async (data) => {
    const { firstName, lastName, email, phone, password } = data;

    const nameValidation = validateName(firstName);
    const lastNameValidation = validateName(lastName);
    if (!nameValidation.valid || !lastNameValidation.valid) {
        return {
            valid: false,
            error: nameValidation.error || lastNameValidation.error
        }
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        return {
            valid: false,
            error: emailValidation.error
        }
    }

    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) {
        return {
            valid: false,
            error: phoneValidation.error
        }
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        return {
            valid: false,
            error: passwordValidation.error
        }
    }

    return {
        valid: true,
        error: null,
        firstName: nameValidation.name,
        lastName: lastNameValidation.name,
        email: emailValidation.email,
        phone: phoneValidation.phone,
        password: passwordValidation.password
    }
}
    

const signup = async (req, res) => {
    try {
        const isValid = await validateSignup(req.body);
        
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