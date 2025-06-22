const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleType: { type: String, required: false },
  name: { type: String, required: false },
  imagePath: { type: String, required: false }, 
  price: { type: Number, required: false },
  seater: { type: Number, required: false },
  transmission: { type: String, required: false },
  fuel: { type: String, required: false },
  stock: { type: Number, required: false }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
