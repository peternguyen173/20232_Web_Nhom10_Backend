const express = require('express');
const app =express();

const bodyparser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = 8000;

const authRoutes = require('./Routes/Auth')
const adminRoutes = require('./Routes/Admin')
const movieRoutes = require('./Routes/Movie')
const imageuploadRoutes = require('./Routes/ImageUploadRoutes')
require('dotenv').config();
require('./db')



app.use(bodyparser.json());
const allowedOrigins = ['https://localhost:3000', 'https://localhost:3001']
app.use(
cors({
    origin:function(origin,callback){
        if(!origin || allowedOrigins.includes(origon)){
            callback(null,true);
        }else{
            callback(new Error('CORS khong cho phep truy cap'));
        }
    }
})
)

app.use(cookieParser())

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/movie', movieRoutes);
app.use('/image', imageuploadRoutes);

app.get('/',(req,res)=>{
    res.json({message: 'The API is working'});
});

app.listen(PORT ,()=>{
    console.log(`Sever dang chay o cong: ${PORT}` )
})