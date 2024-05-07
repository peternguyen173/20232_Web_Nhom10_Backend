const express = require('express');
const router = express.Router();

const Screen = require('../Models/ScreenSchema')

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}

router.post('/createscreen', adminTokenHandler, async (req, res, next) => {
    try {
        const { name, rows, screenType } = req.body;
        const newScreen = new Screen({
            name,
            rows,
            screenType,
            movieSchedules: []
        });

        await newScreen.save();


        res.status(201).json({
            ok: true,
            message: "Screen added successfully"
        });
    }
    catch (err) {
        console.log(err);
        next(err); // Pass any errors to the error handling middleware
    }
})


router.put('/updatescreen/:screenid', adminTokenHandler, async (req, res, next) => {
    try {
        const screenId = req.params.screenid;
        const { name, rows, screenType } = req.body;

        // Tìm màn hình cần cập nhật trong cơ sở dữ liệu
        const screenToUpdate = await Screen.findById(screenId);

        if (!screenToUpdate) {
            return res.status(404).json({ message: 'Screen not found' });
        }

        // Cập nhật thông tin mới
        screenToUpdate.name = name;
        screenToUpdate.rows = rows;
        screenToUpdate.screenType = screenType;

        // Lưu thông tin đã cập nhật vào cơ sở dữ liệu
        await screenToUpdate.save();

        res.status(200).json({
            ok: true,
            message: 'Screen updated successfully',
            updatedScreen: screenToUpdate // Gửi thông tin màn hình đã được cập nhật trở lại
        });
    } catch (err) {
        console.error(err);
        next(err); // Pass any errors to the error handling middleware
    }
});

router.get('/getscreens/', async (req, res, next) => {

    try {
        const screens = await Screen.find();
        if (!screens || screens.length === 0) {
            return res.status(404).json(createResponse(false, 'No screens found', null));
        }

        res.status(200).json(createResponse(true, 'Screens retrieved successfully', screens));
    }
    catch (err) {
        next(err); // Pass any errors to the error handling middleware
    }
});

router.get('/getscreenbyid/:screenId', async (req, res) => {
    try {
        const screen = await Screen.findById(req.params.screenId);
        if (!screen) {
            return res.status(404).json({ message: 'Screen not found' });
        }
        res.status(200).json(createResponse(true, 'Screen retrieved successfully', screen));
    } catch (error) {
        console.error(error);
    }
});

router.get('/screensbymovieschedule/undefined/:date/:movieid', async (req, res, next) => {
    try {
        const date = req.params.date;
        const movieId = req.params.movieid;

        // Lấy tất cả màn hình
        const screens = await Screen.find();

        // Kiểm tra xem có màn hình nào không
        if (!screens || screens.length === 0) {
            return res.status(404).json(createResponse(false, 'Không tìm thấy màn hình', null));
        }

        let temp = []
        // Lọc màn hình dựa trên ngày và ID phim
        screens.forEach(screen => {
            screen.movieSchedules.forEach(schedule => {
                let showDate = new Date(schedule.showDate);
                let bodyDate = new Date(date);

                if (
                    showDate.getDay() === bodyDate.getDay() &&
                    showDate.getMonth() === bodyDate.getMonth() &&
                    showDate.getFullYear() === bodyDate.getFullYear() &&
                    schedule.movieId == movieId
                ) {
                    temp.push(screen);
                }
            })
        });

        console.log(temp);

        res.status(200).json(createResponse(true, 'Lấy danh sách màn hình thành công', temp));

    } catch (err) {
        next(err); // Chuyển mọi lỗi đến middleware xử lý lỗi
    }
});




const errorHandler = require('../Middlewares/errorMiddleware');
const authTokenHandler = require('../Middlewares/checkAuthToken');
const adminTokenHandler = require('../Middlewares/checkAdminToken');