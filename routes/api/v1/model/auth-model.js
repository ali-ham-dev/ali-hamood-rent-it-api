import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import knex from '../../../../knexfile.js';
import { SESClient } from '@aws-sdk/client-ses';
import { createTransport } from 'nodemailer-ses-transport';

class AuthModel {
    constructor() {
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

    // Email verification methods
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
                        <p>This verification link will expire in 24 hours.</p>
                    </div>
                </div>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return { token, expires: new Date(Date.now() + duration) };
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw new Error('Failed to send verification email');
        }
    }

    // User registration methods
    async createUser(userData) {
        const { firstName, lastName, email, phone, password } = userData;

        // Check if user exists
        const existingUser = await knex('users')
            .where({ email })
            .first();
        
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Generate verification token
        const verificationToken = uuidv4();
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [userId] = await knex('users').insert({
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

        // Send verification email
        await this.sendVerificationEmail(email, verificationToken);

        return userId;
    }

    // Login methods
    async loginUser(email, password) {
        const user = await knex('users')
            .where({ email })
            .first();

        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (!user.emailVerified) {
            throw new Error('Please verify your email before logging in');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Update last login
        await knex('users')
            .where({ id: user.id })
            .update({ lastLogin: new Date() });

        return {
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            }
        };
    }

    // Email verification methods
    async verifyEmail(token) {
        const user = await knex('users')
            .where({
                emailVerificationToken: token,
                emailVerified: false
            })
            .first();

        if (!user) {
            throw new Error('Invalid or expired verification token');
        }

        if (user.emailVerificationTokenExpires < new Date()) {
            throw new Error('Verification token has expired');
        }

        await knex('users')
            .where({ id: user.id })
            .update({
                emailVerified: true,
                emailVerificationToken: null,
                emailVerificationTokenExpires: null,
                updatedAt: new Date()
            });

        return true;
    }

    // Resend verification email
    async resendVerificationEmail(email) {
        const user = await knex('users')
            .where({ email, emailVerified: false })
            .first();

        if (!user) {
            throw new Error('User not found or already verified');
        }

        const verificationToken = uuidv4();
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await knex('users')
            .where({ id: user.id })
            .update({
                emailVerificationToken: verificationToken,
                emailVerificationTokenExpires: verificationTokenExpires,
                updatedAt: new Date()
            });

        await this.sendVerificationEmail(email, verificationToken);
        return true;
    }

    // Password reset methods
    async initiatePasswordReset(email) {
        const user = await knex('users')
            .where({ email })
            .first();

        if (!user) {
            throw new Error('User not found');
        }

        const resetToken = uuidv4();
        const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        await knex('users')
            .where({ id: user.id })
            .update({
                passwordResetToken: resetToken,
                passwordResetExpires: resetTokenExpires,
                updatedAt: new Date()
            });

        // TODO: Implement sendPasswordResetEmail method
        // await this.sendPasswordResetEmail(email, resetToken);

        return true;
    }

    async resetPassword(token, newPassword) {
        const user = await knex('users')
            .where({
                passwordResetToken: token
            })
            .where('passwordResetExpires', '>', new Date())
            .first();

        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await knex('users')
            .where({ id: user.id })
            .update({
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
                updatedAt: new Date()
            });

        return true;
    }
}

export default new AuthModel();
