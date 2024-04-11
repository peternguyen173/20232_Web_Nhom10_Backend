//imprt thu vien express vao du an
const express = require("express");

//tao 1 ung dung express de dinh nghia cac tuyen duong
const app = express();

//import middle-warse cho phep doc du lieu tu HTTP gui den va giai ma no
const bodyParser = require("body-parser");

//cho phep server chap nhan yeu cau tu front-end
const cors = require("cors");
const PORT = 8000;

//De doc tu file .env
require("dotenv").config();
require("./db");

app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res) => {
    res.json({message: "The API is working"});
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})
