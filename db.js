<<<<<<< HEAD
const mongoose = require('mongoose')
require('dotenv').config();


mongoose.connect(process.env.MONGO_URL, {
    dbName: process.env.DB_NAME
}).then(
    () => {
        console.log('Connected to database');
    }
).catch((err) => {
    console.log('Error connecting to database ' + err);
=======
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL,{
    dbName: process.env.DB_NAME
}).then(
    () => {
        console.log("Connected to database");
    }
).catch((err) => {
    console.log("Error connecting to database" + err);
>>>>>>> 8889a47f297f77c06cc2fd70e97b4594cdd3f61f
})