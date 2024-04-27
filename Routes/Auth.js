const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
const errorHandler = require('../Middlewares/errorMiddleware');
const authTokenHandler = require('../Middlewares/checkAuthToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}

router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password, phonenumber, confirmPassword, dob, gender } = req.body;
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json(createResponse(false, 'Email already exists'));
        }

        const newUser = new User({
            name,
            phonenumber,
            dob,
            gender,
            password,
            phonenumber,
            email

        });

        await newUser.save(); // Await the save operation
        res.status(201).json(createResponse(true, 'User registered successfully'));

    }
    catch (err) {
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        console.log('user not found');
        return res.status(400).json(createResponse(false, 'Invalid credentials'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.log('password not matched');
        return res.status(400).json(createResponse(false, 'Invalid credentials'));
    }

    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '50m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '60m' });
    res.cookie('authToken', authToken, { httpOnly: true, secure: true, sameSite: 'None' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'None' });

    res.status(200).json(createResponse(true, 'Login successful', {
        authToken,
        refreshToken
    }));
})

router.get('/checklogin', authTokenHandler, async (req, res) => {
    res.json({
        userId: req.userId,
        ok: true,
        message: 'User authenticated successfully'
    })
})


router.get('/logout', async (req, res) => {
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');
    res.json({
        ok: true,
        message: 'User logged out successfully'
    })
})


router.use(errorHandler)

module.exports = router;

