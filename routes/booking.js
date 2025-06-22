require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Booking = require('../models/Booking');
const EmailLog = require('../models/Emaillog');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Invalid or missing amount' });
  }

  const options = {
    amount: parseInt(amount),
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// Save booking after payment
router.post('/save-payment', async (req, res) => {
  const {
    orderId,
    paymentId,
    signature,
    amount,
    vehicleType,
    vehicleModel,
    name,
    phoneNumber,
    email,
  } = req.body;

  try {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const newBooking = new Booking({
      orderId,
      amount,
      vehicleDetails: {
        type: vehicleType,
        model: vehicleModel,
      },
      name,
      phoneNumber,
      email,
      userId: req.session.user ? req.session.user._id : null,
      status: 'Success',
    });

    const savedBooking = await newBooking.save();

    const html = `
      <div style="text-align: center; font-family: Arial; color: #76ABAE;background-color:#000;width:600px">
        <img src="https://via.placeholder.com/600x200.png?text=Your+Booking+is+Confirmed" 
             alt="Your vehicle has been successfully booked!" 
             style="width: 100%; height: auto;" />
        <h1 style="color: #4CAF50;">Dear ${name},</h1>
        <p style="color:#E7CCCC;">Your vehicle has been successfully booked!</p>
        <div style="background-color: #222831; padding: 20px; border-radius: 10px;">
          <p><b>Name:</b> ${name}</p>
          <p><b>Vehicle Type:</b> ${vehicleType}</p>
          <p><b>Vehicle Model:</b> ${vehicleModel}</p>
          <p><b>Amount Paid:</b> ₹${amount / 100}</p>
          <p><b>Date:</b> ${new Date().toLocaleDateString()}</p>
        </div>
        <p style="color: #aaa;">Thank you for choosing WheelXpress. Have a great ride!</p>
      </div>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Booking Confirmation - WheelXpress',
      html,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      const emailLog = new EmailLog({
        recipient: email,
        subject: 'Booking Confirmation - WheelXpress',
        message: html,
        bookingId: savedBooking._id,
        status: error ? 'Failed' : 'Sent',
        errorDetails: error ? error.message : null,
      });

      await emailLog.save();

      if (error) {
        console.error('Email error:', error.message);
        return res.status(500).json({ message: 'Booking saved, email failed' });
      }

      res.status(200).json({ message: 'Booking and email successful' });
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
});

module.exports = router;
