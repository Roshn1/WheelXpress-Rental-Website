const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true,  
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',  
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Sent', 'Failed'],
    default: 'Sent',
  },
  errorDetails: {
    type: String,  
    default: null,
  },
});

const EmailLog = mongoose.model('EmailLog', emailLogSchema);

module.exports = EmailLog;
