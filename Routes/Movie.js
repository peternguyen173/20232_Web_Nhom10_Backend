const express = require('express');
const router = express.Router();

const Movie = require('../Models/MovieSchema')
const Screen = require('../Models/ScreenSchema')
const errorHandler = require('../Middlewares/errorMiddleware');
const authTokenHandler = require('../Middlewares/checkAuthToken');
const adminTokenHandler = require('../Middlewares/checkAdminToken');

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}

router.post('/createmovie',adminTokenHandler,async(req,res,next) => {
    try {
        const {title, description, portraitImgUrl, landscapeImgUrl, language, director, cast, releasedate, rated, genre, duration} = req.body;
        const newMovie = new Movie({title, description, portraitImgUrl, landscapeImgUrl, language, director, cast, releasedate, rated, genre, duration})
        await newMovie.save();
        res.status(201).json({
            ok: true,
            message: "Movie added successfully"
        })
    }
    catch(err){
        next(err);
    }
})
router.post('/addcelebtomovie',adminTokenHandler,async(req,res,next) => {
    try {
        const {movieId,celebType,celebName,celebRole,celebImage} = req.body
        const movie = await Movie.findById(movieId);
        if(!movie) {
            return res.status(404).json({
                ok: false,
                message: "Movie not found"
            })
        }

        const newCeleb = {
            celebType,
            celebName,
            celebRole,
            celebImage
        };
        if(celebType === "cast") {
            movie.cast.push(newCeleb);
        } else {
            movie.crew.push(newCeleb);
        }
        await movie.save();

        res.status(201).json({
            ok: true,
            message: "Celeb added successfully"
        });
    }
    catch(err){
        next(err);
    }
})

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

router.get('/movies', async (req, res, next) => {
    try {
        const movies = await Movie.find();

        // Return the list of movies as JSON response
        res.status(200).json({
            ok: true,
            data: movies,
            message: 'Movies retrieved successfully'
        });
    }
    catch (err) {
        next(err); // Pass any errors to the error handling middleware
    }
})
router.get('/movies',adminTokenHandler,async(req,res,next) => {
    try {
        const movies = await Movie.find();

        res.status(200).json({
            ok: true,
            data: movies,
            message: "Movies retrieved successfully"
        });
    }
    catch(err){
        next(err);
    }
})

router.get('/movies/:id',adminTokenHandler,async(req,res,next) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findById(movieId);
        if(!movie) {
            return res.status(404).json({
                ok: false,
                message: "Movie not found"
            });
        }

        res.status(200).json({
            ok: true,
            data: movie,
            message: "Movie retrieved successfully"
        });
    }
    catch(err){
        next(err);
    }
})

router.put('updatemovie/:id',adminTokenHandler,async(req,res,next) => {
    try{
        const movieId = req.params.id;
        const { title, description, portraitImgUrl, landscapeImgUrl, language, director, cast, releasedate, rated, genre, duration } = req.body;

        // Tìm phim cần cập nhật
        const movie = await Movie.findById(movieId);

        if (!movie) {
            return res.status(404).json({
                ok: false,
                message: 'Movie not found',
            });
        }

        // Cập nhật thông tin phim
        movie.title = title;
        movie.description = description;
        movie.portraitImgUrl = portraitImgUrl;
        movie.landscapeImgUrl = landscapeImgUrl;
        movie.language = language;
        movie.director = director;
        movie.cast = cast;
        movie.releasedate = releasedate;
        movie.rated = rated;
        movie.genre = genre;
        movie.duration = duration;

        await movie.save();

        res.status(200).json({
            ok: true,
            message: 'Movie updated successfully',
            data: movie,
        });
    } catch (err) {
        next(err); // Chuyển các lỗi tới middleware xử lý lỗi
    }
})

router.delete('/deletemovie/:id', async (req, res, next) => {
    try {
        const movieId = req.params.id;

        // Tìm phim dựa trên ID và xóa nó
        const deletedMovie = await Movie.findByIdAndDelete(movieId);

        if (!deletedMovie) {
            return res.status(404).json({
                ok: false,
                message: "Movie not found"
            });
        }

        res.status(200).json({
            ok: true,
            message: "Movie deleted successfully"
        });
    } catch (err) {
        next(err); // Chuyển mọi lỗi đến middleware xử lý lỗi
    }
});

router.post('/createpromotion', adminTokenHandler, async (req, res, next) => {
    try {
        const { title, type, description, discount, startDate, expiryDate } = req.body;

        const newPromotion = new Promotion({ title, type, description, discount, startDate, expiryDate });
        await newPromotion.save();

        res.status(201).json({
            ok: true,
            message: "Promotion created successfully"
        });
    } catch (err) {
        next(err); // Chuyển các lỗi tới middleware xử lý lỗi
    }
});

router.get('/getpromotions', async (req, res, next) => {
    try {
        const promotions = await Promotion.find();

        if (!promotions || promotions.length === 0) {
            return res.status(404).json(createResponse(false, 'No promotions found', null));
        }

        res.status(200).json(createResponse(true, 'Promotions retrieved successfully', promotions));
    } catch (err) {
        next(err); // Pass any errors to the error handling middleware
    }
});

router.delete('/deletepromotion/:promotionId', adminTokenHandler, async (req, res, next) => {
    try {
        const promotionId = req.params.promotionId;

        // Tìm và xóa khuyến mãi dựa trên ID
        const deletedPromotion = await Promotion.findByIdAndDelete(promotionId);

        if (!deletedPromotion) {
            return res.status(404).json({
                ok: false,
                message: "Promotion not found"
            });
        }

        res.status(200).json({
            ok: true,
            message: "Promotion deleted successfully"
        });
    } catch (err) {
        next(err); // Chuyển mọi lỗi đến middleware xử lý lỗi
    }
});



router.get('/test',async(req,res) => {
    res.json({
        message: "Movie api is working"
    })
})

// Thanh toan VNPAY

router.post('/create_payment_url', function (req, res, next) {
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var config = require('config');
    var dateFormat = require('dateformat');

    
    var tmnCode = config.get('DPKGLXA7');
    var secretKey = config.get('Y2AW1HT7LQ61ZZG93KHAUDODE7LAWSU1');
    var vnpUrl = config.get('https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');
    var returnUrl = config.get('vnp_ReturnUrl');

    var date = new Date();

    var createDate = dateFormat(date, 'yyyymmddHHmmss');
    var orderId = dateFormat(date, 'HHmmss');
    var amount = req.body.amount;
    var bankCode = req.body.bankCode;
    
    var orderInfo = req.body.orderDescription;
    var orderType = req.body.orderType;
    var locale = req.body.language;
    if(locale === null || locale === ''){
        locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.redirect(vnpUrl)
});

 

// Vui lòng tham khảo thêm tại code demo

 
router.get('/vnpay_return', function (req, res, next) {
    var vnp_Params = req.query;

    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    var config = require('config');
    var tmnCode = config.get('vnp_TmnCode');
    var secretKey = config.get('vnp_HashSecret');

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

        res.render('success', {code: vnp_Params['vnp_ResponseCode']})
    } else{
        res.render('success', {code: '97'})
    }
});




router.use(errorHandler)

module.exports = router;




