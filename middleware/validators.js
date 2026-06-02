const { body, validationResult } = require('express-validator');

const validateLogin = [
    body('username').trim().notEmpty().withMessage('Username is required').escape(),
    body('password').notEmpty().withMessage('Password is required'),
];

const validateRegister = [
    body('username').trim().notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage('Username must be at least 3 chars').escape(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
];

const validateUserCreate = [
    body('username').trim().notEmpty().withMessage('Username is required').escape(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    body('role').trim().notEmpty().withMessage('Role is required').escape(),
];

const validateRequest = [
    body('nombre').trim().notEmpty().escape(),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('telefono').trim().escape(),
    body('empresa').trim().escape(),
    body('mensaje').trim().escape(),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateLogin,
    validateRegister,
    validateUserCreate,
    validateRequest,
    handleValidationErrors
};
