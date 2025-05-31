import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { SESClient } from '@aws-sdk/client-ses';
import { createTransport } from 'nodemailer-ses-transport';

class AuthModel {

    constructor() {
        this.EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        this.NAME_REGEX = /^(?!.*\s{2})[A-Za-z\s-]+$/;    
        this.PHONE_REGEX = /\D/g;
        this.TOKEN_REGEX = /\D/g;
        this.UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        this.JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY;
        this.JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

        // Add error messages
        this.ERROR_MESSAGES = {
            NAME_REQUIRED: 'Name is required',
            NAME_INVALID: 'Name must be between 2 and 50 characters and contain only letters, spaces, and hyphens',
            EMAIL_REQUIRED: 'Email is required',
            EMAIL_INVALID: 'Email must be a valid email address',
            PHONE_REQUIRED: 'Phone number is required',
            PHONE_INVALID: 'Phone number must be between 10 and 15 digits',
            PASSWORD_REQUIRED: 'Password is required',
            PASSWORD_INVALID: 'Password must be between 8 and 128 characters',
            TOKEN_REQUIRED: 'Token is required',
            TOKEN_INVALID: 'Token must be 6 digits',
            USER_ID_REQUIRED: 'User ID is required',
            USER_ID_INVALID: 'User ID must be a valid UUID'
        };

        // Add validation rules
        this.VALIDATION_RULES = {
            NAME_MIN_LENGTH: 2,
            NAME_MAX_LENGTH: 50,
            EMAIL_MAX_LENGTH: 254,
            PHONE_MIN_LENGTH: 10,
            PHONE_MAX_LENGTH: 15,
            PASSWORD_MIN_LENGTH: 8,
            PASSWORD_MAX_LENGTH: 128,
            TOKEN_LENGTH: 6
        };

        this.RATE_LIMIT_RULES = {
            LOGIN_LIMIT: 10,
            SIGNUP_LIMIT: 10,
            VERIFY_EMAIL_LIMIT: 10
        };

        this.RATE_LIMIT_DURATIONS = {
            LOGIN_DURATION: 15 * 60 * 1000,
            SIGNUP_DURATION: 60 * 60 * 1000,
            VERIFY_EMAIL_DURATION: 15 * 60 * 1000
        };

        // Create SES client
        const sesClient = new SESClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });

        // Create nodemailer transport using SES
        this.transporter = createTransport({
            ses: sesClient,
            aws: { ses: sesClient }
        });
    }

    formatDuration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} ${days === 1 ? 'day' : 'days'}`;
        } else if (hours > 0) {
            return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
        } else if (minutes > 0) {
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
        } else {
            return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
        }
    }

    async sendVerificationEmail(email, duration) {

        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Rent It - Verify Your Email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #2c3e50; margin-bottom: 10px;">Welcome to Rent It!</h1>
                        <p style="color: #7f8c8d; font-size: 16px;">Please verify your email address to get started</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                        <p style="color: #34495e; margin-bottom: 15px;">To complete your registration and start using Rent It, please click the button below to verify your email address:</p>
                        
                        <div style="text-align: center; margin: 25px 0;">
                            <a href="${verificationLink}" 
                               style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Verify Email Address
                            </a>
                        </div>
                    </div>

                    <div style="color: #7f8c8d; font-size: 14px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                        <p>If you did not create an account with Rent It, you can safely ignore this email.</p>
                        <p>This verification link will expire in ${formattedDuration}.</p>
                    </div>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return { token, expires: new Date(Date.now() + duration) };
        } catch (error) {
            logError(error, 'sendVerificationEmail');
        }
    }

    jwtToken = (userId, email) => {
        return jwt.sign(
            { userId: userId, email: email },
            this.JWT_PRIVATE_KEY,
            { 
                algorithm: 'RS256',
                expiresIn: this.JWT_EXPIRES_IN
            }
        );
    }

    validateName = (name) => {
        if (!name) {
            return {
                valid: false,
                error: this.ERROR_MESSAGES.NAME_REQUIRED,
                name: null
            }
        }
    
        if (name.length < this.VALIDATION_RULES.NAME_MIN_LENGTH ||
            name.length > this.VALIDATION_RULES.NAME_MAX_LENGTH ||
            !this.NAME_REGEX.test(name)
        ) {
            return {
                valid: false,
                error: this.ERROR_MESSAGES.NAME_INVALID,
                name: null
            }
        }
    
        return {
            valid: true,
            error: null,
            name: name
        }
    }
    
    validateEmail = (email) => {
        if (!email) {
            return {
                valid: false,
                error: this.ERROR_MESSAGES.EMAIL_REQUIRED,
                email: null
            }
        }
    
        if (email.length > this.VALIDATION_RULES.EMAIL_MAX_LENGTH ||
            !this.EMAIL_REGEX.test(email)
        ) {
            return {
                valid: false,
                error: this.ERROR_MESSAGES.EMAIL_INVALID,
                email: null
            }
        }
        
        return {
            valid: true,
            error: null,
            email: email
        }
    }
    
    validatePhone = (phone) => {
        if (!phone) {
            return {
                valid: false,
                error: this.ERROR_MESSAGES.PHONE_REQUIRED,
                phone: null
            }
        }
    
        const numberOnlyPhone = phone.replace(PHONE_REGEX, '');
    
        if (numberOnlyPhone.length < this.VALIDATION_RULES.PHONE_MIN_LENGTH ||
            numberOnlyPhone.length > this.VALIDATION_RULES.PHONE_MAX_LENGTH
        ) {
            return {
                valid: false,
                error: this.ERROR_MESSAGES.PHONE_INVALID,
                phone: null
            }
        }
    
        return {
            valid: true,
            error: null,
            phone: numberOnlyPhone
        }
    }
    
    validatePassword = (password) => {
        if (!password) {
            return {
                valid: false,
                error: this.ERROR_MESSAGES.PASSWORD_REQUIRED,
                password: null
            }
        }
    
        if (password.length < this.VALIDATION_RULES.PASSWORD_MIN_LENGTH ||
            password.length > this.VALIDATION_RULES.PASSWORD_MAX_LENGTH
        ) {
            return {
                valid: false,
                error: this.ERROR_MESSAGES.PASSWORD_INVALID,
                password: null
            }
        }
    
        return {
            valid: true,
            error: null,
            password: password
        }
    }
    
    validateToken = (token) => {
        if (!token) {
            return {
                valid: false,
                error: this.ERROR_MESSAGES.TOKEN_REQUIRED,
                token: null
            }
        }
    
        const tokenOnlyNumbers = token.replace(TOKEN_REGEX, '');
    
        if (tokenOnlyNumbers.length !== this.VALIDATION_RULES.TOKEN_LENGTH) {
            return {
                valid: false,
                error: this.ERROR_MESSAGES.TOKEN_INVALID,
                token: null
            }
        }
    
        return {
            valid: true,
            error: null,
            token: tokenOnlyNumbers
        }
    }
    
    validateUserId = (userId) => {
        if (!userId) {
            return {
                valid: false,
                error: this.ERROR_MESSAGES.USER_ID_REQUIRED,
                userId: null
            }
        }
    
        if (!this.UUID_REGEX.test(userId)) {
            return {
                valid: false,
                error: this.ERROR_MESSAGES.USER_ID_INVALID,
                userId: null
            }
        }
    
        return {
            valid: true,
            error: null,
            userId: userId
        }
    }

    validateSignup = (data) => {
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
}

export default new AuthModel();
