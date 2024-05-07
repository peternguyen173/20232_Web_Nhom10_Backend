const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    showTime: {
        type: String,
        required: true
    },
    showDate: {
        type: Date,
        required: true
    },
    bookDate: {
        type: Date,
        required: true
    },
    moviename: {
        type: String,
        required: true
    },
    screenname: {
        type: String,
        required: true
    },
    cornquantity: {
        type: Number,
        required: true
    },
    waterquantity: {
        type: Number,
        required: true
    },
    seats: [
        {
            rowname: {
                type: String,
            },

            seat_id: {
                type: String,
                required: true
            },

        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    paymentType: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
