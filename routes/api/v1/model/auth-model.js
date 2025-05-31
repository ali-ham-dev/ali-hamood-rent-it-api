import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import knex from '../../../../knexfile.js';
import { SESClient } from '@aws-sdk/client-ses';
import { createTransport } from 'nodemailer-ses-transport';

class AuthModel {

    constructor() {
        this.EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        this.NAME_REGEX = /^(?!.*\s{2})[A-Za-z\s-]+$/;    
        this.PHONE_REGEX = /\D/g;
        this.TOKEN_REGEX = /\D/g;
        this.UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

    validateName = (name) => {
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
    
    validateEmail = (email) => {
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
    
    validatePhone = (phone) => {
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
    
    validatePassword = (password) => {
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
    
    validateToken = (token) => {
        if (!token) {
            return {
                valid: false,
                error: 'Token error',
                token: null
            }
        }
    
        const tokenOnlyNumbers = token.replace(TOKEN_REGEX, '');
    
        if (tokenOnlyNumbers.length !== 6) {
            return {
                valid: false,
                error: 'Token error',
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
                error: 'User ID error',
                userId: null
            }
        }
    
        if (!UUID_REGEX.test(userId)) {
            return {
                valid: false,
                error: 'User ID error',
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
