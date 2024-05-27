const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    movieId: {
        type: String,
        required: true,
        unique: true // Đảm bảo mỗi bản ghi chỉ có một movieId duy nhất
    },
    ratings: [{
        userId: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        }
    }],
    avgRating: {
        type: Number,
        default: 0 // Giá trị mặc định cho avgRating
    }
});

// Định nghĩa phương thức pre để tính toán trung bình rating trước khi lưu
ratingSchema.pre('save', function(next) {
    const ratingsCount = this.ratings.length;
    if (ratingsCount > 0) {
        const totalRating = this.ratings.reduce((acc, cur) => acc + cur.rating, 0);
        this.avgRating = totalRating / ratingsCount;
    }
    next();
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
