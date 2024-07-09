const mongoose = require('mongoose');

const userBooking = new mongoose.Schema({
    placeId: {type:mongoose.Schema.Types.ObjectId, require:true, ref:'Place'},
    user: {type:mongoose.Schema.Types.ObjectId, require:true},
    checkIn: {type: Date, require: true},
    checkOut: {type: Date, require: true},
    name: {type: String, require: true},
    phone: {type: String, require: true},
    bookingAmount: Number,
})

const BookingModel = mongoose.model('Booking', userBooking)

module.exports = BookingModel;