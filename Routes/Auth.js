
const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
const errorHandler = require('../Middlewares/errorMiddleware');
const authTokenHandler = require('../Middlewares/checkAuthToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const passport = require('passport');


router.get(
    '/google/callback', 
    passport.authenticate('google',{
        successRedirect: "http://localhost:3001",
        failureRedirect: "http://localhost:3001",
    })
)

router.get("/goolelogout",(req,res) =>{
    req.logOut();
    // res.redirect("http://localhost:3001")
    res.json({
        ok: true,
        message: 'User logged out successfully'
    })
})

router.get('/google', 
passport.authenticate('google', { scope : ['profile', 'email'] })

);

router.get(
    "/login/success" ,(req,res) => {
        if(req.user){
            return res.status(200).json(createResponse(true, 'User found',req.user));
            // res.status(200).json({
            //     error: false,
            //     message: "Sucessfully login with google",
            //     user: req.user
            // })
        }else{
            return res.status(400).json(createResponse(false, 'Invalid credentials'));
            // res.status(403).json({
            //     error: true,
            //     message: "Not Authorized"
            // })
        }
        
    }
)
// router.get('/getuser', authTokenHandler, async (req, res) => {
//     const user = await User.findOne({ _id: req.userId });
    
//     if (!user) {
//         console.log("userunfounded");
//         return res.status(400).json(createResponse(false, 'Invalid credentials'));
//     }
//     else {
//         console.log("userfounded");
//         return res.status(200).json(createResponse(true, 'User found', user));
//     }
// })
router.get(
    "/login/failed" ,(req,res) => {
        res.status(401).json({
            error: true,
            message: "Login failure with google"
        })
    }
)

////////////////////////

router.get('/test', async (req, res) => {
    res.json({
        message: "Auth api is working"
    })
})



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

// change user city
/* router.post('/changeCity', authTokenHandler, async (req, res, next) => {
    const { city } = req.body;
    const user = await User.findOne({ _id: req.userId });

    if (!user) {
        return res.status(400).json(createResponse(false, 'Invalid credentials'));
    }
    else {
        user.city = city;
        await user.save();
        return res.status(200).json(createResponse(true, 'City changed successfully'));
    }
})
*/
// router.post('/sendotp', async (req, res) => {})
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
    req.logOut();
    res.json({
        ok: true,
        message: 'User logged out successfully'
    })
})

router.get('/getuser', authTokenHandler, async (req, res) => {
    const user = await User.findOne({ _id: req.userId });
    
    if (!user) {
        console.log("userunfounded");
        return res.status(400).json(createResponse(false, 'Invalid credentials'));
    }
    else {
        console.log("userfounded");
        return res.status(200).json(createResponse(true, 'User found', user));
    }
})

router.post('/updateuser', authTokenHandler, async (req, res, next) => {
    try {
        const { name, email, password, phonenumber, dob, gender } = req.body;
        const updatedFields = {};

        if (name) {
            updatedFields.name = name;
        }
        if (email) {
            updatedFields.email = email;
        }
        if (password) {
            updatedFields.password = password;
        }
        if (phonenumber) {
            updatedFields.phonenumber = phonenumber;
        }
        if (dob) {
            updatedFields.dob = dob;
        }
        if (gender) {
            updatedFields.gender = gender;
        }

        const user = await User.findOneAndUpdate({ _id: req.userId }, { $set: updatedFields }, { new: true });

        if (!user) {
            return res.status(400).json(createResponse(false, 'Invalid credentials'));
        }

        res.status(200).json(createResponse(true, 'User updated successfully', user));
    } catch (err) {
        next(err);
    }
});

router.use(errorHandler)

module.exports = router;

