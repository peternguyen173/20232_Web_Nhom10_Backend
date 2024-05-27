<<<<<<< HEAD
// const Knock = require('@knocklabs/client');
// import { Knock } from "@knocklabs/client";
const express = require('express');
const router = express.Router();
// C:\Users\Admin\Downloads\Movie\sgpcinema_backend\node_modules\@knocklabs\client\dist\cjs\knock.js
=======
const express = require('express');
const mongoose = require('mongoose');
const socketIO = require('socket.io');

const router = express.Router();
const io = socketIO();
>>>>>>> 8889a47f297f77c06cc2fd70e97b4594cdd3f61f

const User = require('../Models/UserSchema')
const Movie = require('../Models/MovieSchema')
const Booking = require('../Models/BookingSchema')
const Screen = require('../Models/ScreenSchema')
const Promotion = require('../Models/PromotionSchema')
<<<<<<< HEAD
=======
const Rating = require('../Models/RatingSchema')
const Notification = require('../Models/NotificationSchema'); // Model Notification

>>>>>>> 8889a47f297f77c06cc2fd70e97b4594cdd3f61f

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

router.get('/test', async (req, res) => {
    res.json({
        message: "Movie api is working"
    })
})


// admin access
router.post('/createmovie', adminTokenHandler, async (req, res, next) => {
    try {
        const { title, description, portraitImgUrl, landscapeImgUrl, language, director, cast, releasedate, rated, genre, duration } = req.body;

        const newMovie = new Movie({ title, description, portraitImgUrl, landscapeImgUrl, language, director, cast, releasedate, rated, genre, duration })
        await newMovie.save();
        res.status(201).json({
            ok: true,
            message: "Movie added successfully"
        });
<<<<<<< HEAD
        // const knockClient= new Knock("sk_test_CxObjuVUM9OkqeH58OrwTcHl-15km9uxc6nouPtGJqM");
        // const otherUsers = await User.find();
        // await knockClient.notify('movie',{
        //     actor: "123",
        //     // recipients: otherUsers.map(user=>user.password),
        //     recipients: "123456" ,
        //     data : {
        //         workout: {
        //             value:  newMovie.title
        //         }
        //     }
        // });
=======
>>>>>>> 8889a47f297f77c06cc2fd70e97b4594cdd3f61f
    }
    catch (err) {
        next(err); // Pass any errors to the error handling middleware
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

router.post('/updatescreen/:screenid', adminTokenHandler, async (req, res, next) => {
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

router.post('/addmoviescheduletoscreen', adminTokenHandler, async (req, res, next) => {
    console.log("Inside addmoviescheduletoscreen")
    try {
        const { screenId, movieId, showTime, showDate } = req.body;
        const screen = await Screen.findById(screenId);
        if (!screen) {
            return res.status(404).json({
                ok: false,
                message: "Screen not found"
            });
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({
                ok: false,
                message: "Movie not found"
            });
        }

        screen.movieSchedules.push({
            movieId,
            showTime,
            notavailableseats: [],
            showDate
        });

        await screen.save();

        res.status(201).json({
            ok: true,
            message: "Movie schedule added successfully"
        });

    }
    catch (err) {
        next(err); // Pass any errors to the error handling middleware
    }
})


// user access
router.post('/bookticket', authTokenHandler, async (req, res, next) => {
    try {
        const { showTime, showDate, movieId, screenId, seats, totalPrice, paymentId, paymentType, cornquantity, waterquantity } = req.body;
        console.log(req.body);

        // You can create a function to verify payment id

        const screen = await Screen.findById(screenId);

        if (!screen) {
            return res.status(404).json({
                ok: false,
                message: "Theatre not found"
            });
        }



        const movieSchedule = screen.movieSchedules.find(schedule => {
            console.log(schedule);
            let showDate1 = new Date(schedule.showDate);
            let showDate2 = new Date(showDate);
            if (showDate1.getUTCDay() === showDate2.getUTCDay() &&
                showDate1.getUTCMonth() === showDate2.getUTCMonth() &&
                showDate1.getUTCFullYear() === showDate2.getUTCFullYear() &&
                schedule.showTime === showTime &&
                schedule.movieId == movieId) {
                return true;
            }
            return false;
        });

        if (!movieSchedule) {
            return res.status(404).json({
                ok: false,
                message: "Movie schedule not found"
            });
        }

        const user = await User.findById(req.userId);
        const movie1 = await Movie.findById(movieId);
        const screen1 = await Screen.findById(screenId);
        console.log(movie1);

        if (!movie1) {
            return res.status(404).json({
                ok: false,
                message: "User not found"
            });
        }
        if (!movie1) {
            return res.status(404).json({
                ok: false,
                message: "User not found"
            });
        }
        if (!user) {
            return res.status(404).json({
                ok: false,
                message: "User not found"
            });
        }
        console.log('before newBooking done');
        const newBooking = new Booking({ userId: req.userId, showTime, showDate, moviename: movie1.title, bookDate: new Date(), screenname: screen1.name, seats, totalPrice, paymentId, paymentType, cornquantity, waterquantity })
        await newBooking.save();
        console.log('newBooking done');



        movieSchedule.notAvailableSeats.push(...seats);
        await screen.save();
        console.log('screen saved');

        user.bookings.push(newBooking._id);
        await user.save();
        console.log('user saved');
<<<<<<< HEAD
        res.status(201).json({
            ok: true,
            message: "Booking successful"
        });

    }
    catch (err) {
        next(err); // Pass any errors to the error handling middleware
    }
=======
        
        const newNotification = new Notification({
            userId: req.userId,
            message: `Đặt vé "${movie1.title}" thành công! Mã vé: ${newBooking.id}`, // Sử dụng newBooking.id để lấy mã vé
            timestamp: new Date(),
            isRead: false
          });
      
          // Lưu thông báo vào cơ sở dữ liệu
          await newNotification.save();
      
          // Gửi thông báo qua Socket.IO
          req.io.emit('bookingConfirmed', { userId: req.userId, message: `Đặt vé "${movie1.title}" thành công! Mã vé: ${newBooking.id}` });

          res.status(201).json({
            ok: true,
            message: "Booking successful",
            bookingId: newBooking.id // Trả về mã vé cho frontend
          });
      
    }
    
    catch (err) {
        next(err); // Pass any errors to the error handling middleware
    }
    
>>>>>>> 8889a47f297f77c06cc2fd70e97b4594cdd3f61f
})


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
router.get('/movies/:id', async (req, res, next) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findById(movieId);
        if (!movie) {
            // If the movie is not found, return a 404 Not Found response
            return res.status(404).json({
                ok: false,
                message: 'Movie not found'
            });
        }

        res.status(200).json({
            ok: true,
            data: movie,
            message: 'Movie retrieved successfully'
        });
    }
    catch (err) {
        next(err); // Pass any errors to the error handling middleware
    }
})

router.put('/updatemovie/:id', adminTokenHandler, async (req, res, next) => {
    try {
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
});

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



router.get('/schedulebymovie/:screenid/:date/:showtime/:movieid', async (req, res, next) => {
    const screenId = req.params.screenid;
    const date = req.params.date;
    const movieId = req.params.movieid;
    const showtime = req.params.showtime;

    const screen = await Screen.findById(screenId);

    if (!screen) {
        return res.status(404).json(createResponse(false, 'Screen not found', null));
    }

    const movieSchedules = screen.movieSchedules.filter(schedule => {
        let showDate = new Date(schedule.showDate);
        let bodyDate = new Date(date);
        if (showDate.getUTCDay() == bodyDate.getUTCDay() &&
            showDate.getUTCMonth() == bodyDate.getUTCMonth() &&
            showDate.getUTCFullYear() == bodyDate.getUTCFullYear() &&
            schedule.movieId == movieId
            && schedule.showTime === showtime) {
            return true;
        }
        return false;
    });
    console.log(movieSchedules)

    if (!movieSchedules) {
        return res.status(404).json(createResponse(false, 'Movie schedule not found', null));
    }

    res.status(200).json(createResponse(true, 'Movie schedule retrieved successfully', {
        screen,
        movieSchedulesforDate: movieSchedules,
        date
    }));

});

router.get('/schedules/:screenId', async (req, res) => {
    try {
        const { screenId } = req.params;

        const screen = await Screen.findById(screenId);
        if (!screen) {
            return res.status(404).json({ message: 'Screen not found' });
        }

        const schedules = screen.movieSchedules.map(schedule => ({
            _id: schedule._id,
            movieTitle: schedule.movieTitle, // Thay bằng tên trường thực tế của phim
            screenName: screen.name, // Tên màn hình
            showDate: schedule.showDate, // Thay bằng tên trường thực tế của ngày chiếu
            showTime: schedule.showTime, // Thay bằng tên trường thực tế của giờ chiếu
        }));

        return res.status(200).json({ schedules });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching schedules', error: error.message });
    }
});

router.delete('/deleteschedule/:scheduleId', async (req, res) => {
    try {
        const { scheduleId } = req.params;

        const screen = await Screen.findOneAndUpdate(
            { 'movieSchedules._id': scheduleId },
            { $pull: { movieSchedules: { _id: scheduleId } } },
            { new: true }
        );

        if (!screen) {
            return res.status(404).json({ ok: false, message: 'Schedule not found' });
        }

        res.status(200).json({ ok: true, message: 'Schedule deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: 'Server error' });
    }
});



router.delete('/deletescreen/:screenid', async (req, res) => {
    const { screenid } = req.params;

    try {
        const deletedScreen = await Screen.findByIdAndDelete(screenid);
        if (!deletedScreen) {
            return res.status(404).json({ message: "Phòng chiếu không tồn tại." });
        }
        res.status(200).json({ message: "Xóa phòng chiếu thành công." });
    } catch (error) {
        res.status(500).json({ message: "Lỗi xảy ra khi xóa phòng chiếu." });
    }

});

router.get('/getuserbookings', authTokenHandler, async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).populate('bookings');
        if (!user) {
            return res.status(404).json(createResponse(false, 'User not found', null));
        }

        let bookings = [];
        // user.bookings.forEach(async booking => {
        //     let bookingobj = await Booking.findById(booking._id);
        //     bookings.push(bookingobj);
        // })

        for (let i = 0; i < user.bookings.length; i++) {
            let bookingobj = await Booking.findById(user.bookings[i]._id);
            bookings.push(bookingobj);
        }

        res.status(200).json(createResponse(true, 'User bookings retrieved successfully', bookings));
        // res.status(200).json(createResponse(true, 'User bookings retrieved successfully', user.bookings));
    } catch (err) {
        next(err); // Pass any errors to the error handling middleware
    }
})

router.get('/getuserbookings/:id', authTokenHandler, async (req, res, next) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json(createResponse(false, 'Booking not found', null));
        }

        res.status(200).json(createResponse(true, 'Booking retrieved successfully', booking));
    } catch (err) {
        next(err); // Pass any errors to the error handling middleware
    }
})

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


<<<<<<< HEAD

=======
router.post('/rating', async (req, res) => {
    const { movieId, userId, rating } = req.body;

    try {
        // Kiểm tra xem userId và movieId có tồn tại trong cơ sở dữ liệu hay không
        const userExists = await User.exists({ _id: userId });
        const movieExists = await Movie.exists({ _id: movieId });

        if ( !movieExists) {
            return res.status(404).json({ success: false, message: 'Người dùng hoặc bộ phim không tồn tại.' });
        }

        // Tìm bản ghi Rating có movieId tương ứng
        const ratingRecord = await Rating.findOne({ movieId });

        if (!ratingRecord) {
            // Nếu không tìm thấy bản ghi, tạo mới và thêm đánh giá
            const newRating = new Rating({
                movieId: movieId,
                ratings: [{ userId, rating }]
            });
            await newRating.save();
        } else {
            // Nếu tìm thấy bản ghi, kiểm tra xem user đã đánh giá chưa
            const userRatingIndex = ratingRecord.ratings.findIndex(item => item.userId === userId);

            if (userRatingIndex === -1) {
                // Nếu user chưa đánh giá, thêm mới đánh giá
                ratingRecord.ratings.push({ userId, rating });
            } else {
                // Nếu user đã đánh giá, cập nhật đánh giá của user đó
                ratingRecord.ratings[userRatingIndex].rating = rating;
            }

            await ratingRecord.save();
        }

        // Trả về phản hồi thành công
        res.status(201).json({ success: true, message: 'Đánh giá của bạn đã được ghi nhận.' });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Đánh giá không thành công:', error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi, vui lòng thử lại.' });
    }
});

router.get('/checkUserRating/:movieId/:userId', async (req, res) => {
    try {
        const { movieId, userId } = req.params;

        // Tìm xem bộ phim có tồn tại trong bảng Rating không
        const rating = await Rating.findOne({ movieId });

        if (!rating) {
            // Bộ phim không có bất kỳ đánh giá nào
            return res.status(200).json({ hasRated: false });
        }

        // Kiểm tra xem userId đã đánh giá bộ phim không
        const userRating = rating.ratings.find(item => item.userId === userId);

        if (userRating) {
            // Người dùng đã đánh giá bộ phim, trả về cả rating
            return res.status(200).json({ hasRated: true, rating: userRating.rating });
        } else {
            // Người dùng chưa đánh giá bộ phim
            return res.status(200).json({ hasRated: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/avgRating/:movieId', async (req, res) => {
    try {
        const { movieId } = req.params;

        // Tìm xem bộ phim có tồn tại trong bảng Rating không
        const rating = await Rating.findOne({ movieId });

        if (!rating || !rating.ratings || rating.ratings.length === 0) {
            // Bộ phim không có bất kỳ đánh giá nào
            return res.status(200).json({ avgRating: 0, numberOfRatings: 0 });
        }

        // Tính trung bình của tất cả các đánh giá
        const ratings = rating.ratings.map(item => item.rating);
        const avgRating = ratings.reduce((total, rating) => total + rating, 0) / ratings.length;

        return res.status(200).json({ avgRating, numberOfRatings: ratings.length });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/checkUserRating/:movieId', authTokenHandler, async (req, res) => {
    try {
      const userId = req.userId;
      const movieId = req.params.movieId;
  
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const rating = await Rating.findOne({ movieId });
  
      if (!rating) {
        return res.status(404).json({ message: 'Rating not found' });
      }
  
      const userRatingObj = rating.ratings.find(item => item.userId === userId);
      if (!userRatingObj) {
        return res.status(404).json({ message: 'User rating not found for this movie' });
      }
  
      const userRating = userRatingObj.rating;
  
      res.json({ data: userRating });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
>>>>>>> 8889a47f297f77c06cc2fd70e97b4594cdd3f61f

router.use(errorHandler)

module.exports = router;
