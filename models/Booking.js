const mongoose = require('mongoose'); 

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderId: String,
  amount: Number,
  vehicleDetails: {
    type: { type: String, required: true },
    model: { type: String, required: true }
  },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  bookingDate: { type: Date, default: Date.now },
  email: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  damaged: { type: Boolean, default: false }, 
  totalFine: { type: Number, default: 0 }      
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
