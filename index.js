const express = require('express');
const app = express();
const http = require('http');
const passport = require("passport");
const cookieSession = require("cookie-session");
const passportSetup = require("./passport");
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:3000', // Thay thế bằng URL frontend của bạn
      methods: ['GET', 'POST'],
    },
  });

  require('dotenv').config();
require('./db')
/////////////////////////



app.use(
    cookieSession({
        name: "session",
        keys: ["cyberwolve"],
        maxAge: 24*60*60*100,
    })
)


app.use(passport.initialize());
app.use(passport.session());

const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 8000;
const cookieParser = require('cookie-parser');
// const server = http.createServer(app);
// // const socketIo = require('socket.io');
// // const io = socketIo(server, {
// //     // Thêm các tùy chọn cấu hình Socket.IO ở đây (nếu cần)
// //     // Ví dụ:
// //     cors: {
// //       origin: "*", // Hoặc chỉ định origin cụ thể
// //       methods: ["GET", "POST"]
// //     }
// //   });   

const authRoutes = require('./Routes/Auth')
const adminRoutes = require('./Routes/Admin')
const movieRoutes = require('./Routes/Movie')
const imageuploadRoutes = require('./Routes/imageUploadRoutes');
const notificationsRoutes = require('./Routes/Notification');
const bannerRoutes = require('./Routes/Banner');


require('dotenv').config();
require('./db')

app.use((req, res, next) => {
    req.io = io;
    next();
  });
// io.on('connection', (socket) => {
//     console.log('New client connected');
//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//     });
// });


app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', "https://sgpcinema-admin.vercel.app", "https://sgpcinema.vercel.app", "https://sgpcinema-peters-projects-5fccdbc6.vercel.app"]; // Add more origins as needed
// Configure CORS with credentials

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // Allow credentials
    })
);
app.use(cookieParser());


app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/movie',  movieRoutes);
app.use('/image', imageuploadRoutes);
app.use('/notifications', notificationsRoutes);
app.use('/banner', bannerRoutes);




app.get('/', (req, res) => {
    res.json({ message: 'The API is working' });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});