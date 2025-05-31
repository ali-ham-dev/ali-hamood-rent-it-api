import AuthModel from '../model/auth-model.js';

class AuthController {
    async signup(req, res) {
        try {
            const { firstName, lastName, email, phone, password } = req.body;

            // Essential backend validation
            if (!firstName || !lastName || !email || !phone || !password) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // Basic email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            // Basic phone validation (strip non-numeric and check length)
            const numericPhone = phone.replace(/\D/g, '');
            if (numericPhone.length < 10 || numericPhone.length > 15) {
                return res.status(400).json({ error: 'Invalid phone number' });
            }

            // Basic password length check
            if (password.length < 8) {
                return res.status(400).json({ error: 'Password must be at least 8 characters' });
            }

            // If all validations pass, proceed with user creation
            const userId = await AuthModel.createUser({
                firstName,
                lastName,
                email,
                phone: numericPhone,
                password
            });

            res.status(201).json({
                message: 'User created successfully. Please check your email for verification.',
                userId
            });

        } catch (error) {
            if (error.message === 'Email already registered') {
                return res.status(409).json({ error: error.message });
            }
            console.error('Signup error:', error);
            res.status(500).json({ error: 'An error occurred during signup' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Essential validation
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // Basic email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            // If all validations pass, proceed with login
            const result = await AuthModel.loginUser(email, password);
            res.status(200).json(result);

        } catch (error) {
            if (error.message === 'Invalid credentials') {
                return res.status(401).json({ error: error.message });
            }
            if (error.message === 'Please verify your email before logging in') {
                return res.status(403).json({ error: error.message });
            }
            console.error('Login error:', error);
            res.status(500).json({ error: 'An error occurred during login' });
        }
    }

    async verifyEmail(req, res) {
        try {
            const { token } = req.params;
            await AuthModel.verifyEmail(token);
            res.status(200).json({ message: 'Email verified successfully' });
        } catch (error) {
            if (error.message === 'Invalid or expired verification token') {
                return res.status(400).json({ error: error.message });
            }
            console.error('Email verification error:', error);
            res.status(500).json({ error: 'An error occurred during email verification' });
        }
    }

    async resendVerificationEmail(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }
            await AuthModel.resendVerificationEmail(email);
            res.status(200).json({ message: 'Verification email sent successfully' });
        } catch (error) {
            if (error.message === 'User not found or already verified') {
                return res.status(404).json({ error: error.message });
            }
            console.error('Resend verification email error:', error);
            res.status(500).json({ error: 'An error occurred while sending verification email' });
        }
    }
}

export default new AuthController(); 