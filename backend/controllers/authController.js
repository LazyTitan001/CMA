const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ApiResponse = require('../utils/apiResponse');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (await User.findOne({ email })) {
            return ApiResponse.error(res, 'Email already exists');
        }

        const user = new User({ email, password });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        ApiResponse.success(res, { user, token }, 'User registered successfully', 201);
    } catch (error) {
        ApiResponse.error(res, error.message, 500);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return ApiResponse.error(res, 'Invalid credentials', 401);
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        ApiResponse.success(res, { user, token }, 'Login successful');
    } catch (error) {
        ApiResponse.error(res, error.message, 500);
    }
};