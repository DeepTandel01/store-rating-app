const { body } = require('express-validator');

exports.registerValidation = [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20–60 characters'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password')
    .isLength({ min: 8, max: 16 }).withMessage('Password must be 8–16 characters')
    .matches(/[A-Z]/).withMessage('Password must include at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must include at least one special character'),
  body('address').optional().isLength({ max: 400 }).withMessage('Address max 400 characters')
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required')
];

exports.passwordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 }).withMessage('Password must be 8–16 characters')
    .matches(/[A-Z]/).withMessage('Password must include at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must include at least one special character')
];

exports.userCreateValidation = [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20–60 characters'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password')
    .isLength({ min: 8, max: 16 }).withMessage('Password must be 8–16 characters')
    .matches(/[A-Z]/).withMessage('Must include at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Must include at least one special character'),
  body('address').optional().isLength({ max: 400 }).withMessage('Address max 400 characters'),
  body('role').optional().isIn(['admin', 'user', 'store_owner']).withMessage('Invalid role')
];

exports.storeValidation = [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Store name must be 20–60 characters'),
  body('email').isEmail().withMessage('Invalid email'),
  body('address').isLength({ min: 1, max: 400 }).withMessage('Address is required, max 400 chars'),
  body('ownerId').optional().isInt().withMessage('Owner ID must be an integer')
];

exports.ratingValidation = [
  body('storeId').isInt().withMessage('Store ID required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];
