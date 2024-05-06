const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rows: {
        type: Array,
        required: true
    },
    screenType: {
        type: String,
        required: true
    },
    movieSchedules: [
        {
            movieId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Movie', // Reference to the Movie model
                required: true
            },
            showTime: String,
            notAvailableSeats: [{
                rowname: String,
                seat_id: String,

            }],
            showDate: Date
        }
    ]
});

const Screen = mongoose.model('Screen', screenSchema);

module.exports = Screen;
