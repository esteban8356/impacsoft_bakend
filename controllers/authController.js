const User = require('../models/User');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const oldUser = await User.findOne({ where: { username } });

        if (oldUser) {
            return res.status(409).send('User Already Exist. Please Login');
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            password: encryptedPassword
        });

        const token = jwt.sign(
            { user_id: user.id, username },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h',
            }
        );

        user.token = token;

        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error registering user');
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password, captchaToken } = req.body;
        console.log('Login attempt:', { username, hasCaptcha: !!captchaToken });

        // Verify Captcha ONLY if provided (Frontend handles the logic of when to require it)
        if (captchaToken) {
            const secretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
            const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`;

            try {
                const captchaResponse = await axios.post(verifyUrl);
                console.log('Captcha verification response:', captchaResponse.data);
                if (!captchaResponse.data.success) {
                    console.log('Captcha failed:', captchaResponse.data['error-codes']);
                    return res.status(400).send('Captcha verification failed');
                }
            } catch (captchaError) {
                console.error('Captcha HTTP error:', captchaError.message);
                return res.status(500).send('Error verifying captcha');
            }
        }

        const user = await User.findOne({ where: { username } });
        console.log('User found:', !!user);

        if (!user) {
            return res.status(400).send('Invalid Credentials');
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', passwordValid);

        if (passwordValid) {
            const token = jwt.sign(
                { user_id: user.id, username },
                process.env.JWT_SECRET,
                {
                    expiresIn: '2h',
                }
            );

            // Fetch role details
            const roleData = await Role.findByPk(user.role);
            const allowedModules = roleData ? roleData.modules : [];

            // Set HttpOnly cookie - support cross-site cookies in production/HTTPS
            const isProduction = process.env.NODE_ENV === 'production' || req.secure || req.headers['x-forwarded-proto'] === 'https';
            res.cookie('token', token, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                maxAge: 2 * 60 * 60 * 1000 // 2 hours
            });

            return res.status(200).json({ username, role: user.role, allowedModules });
        }
        res.status(400).send('Invalid Credentials');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error logging in');
    }
};

exports.logout = (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production' || req.secure || req.headers['x-forwarded-proto'] === 'https';
    res.clearCookie('token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    });
    res.status(200).send('Logged out successfully');
};

exports.verifyToken = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.user_id);
        if (!user) return res.status(404).send('User not found');

        const roleData = await Role.findByPk(user.role);
        const allowedModules = roleData ? roleData.modules : [];

        res.status(200).json({
            valid: true,
            username: user.username,
            role: user.role,
            allowedModules
        });
    } catch (err) {
        res.status(500).send('Error verifying token');
    }
};
