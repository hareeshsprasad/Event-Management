const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    match: [/^[A-Za-z\s]+$/, 'First name should contain only letters and spaces']
  },
  lastName: {
    type: String,
    required: true,
    match: [/^[A-Za-z\s]+$/, 'Last name should contain only letters and spaces']
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Phone number must be exactly 10 digits']
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
    match: [/^[A-Za-z\s]+$/, 'City should contain only letters and spaces']
  },
  state: {
    type: String,
    required: true,
    match: [/^[A-Za-z\s]+$/, 'State should contain only letters and spaces']
  },
  country: {
    type: String,
    required: true,
    match: [/^[A-Za-z\s]+$/, 'Country should contain only letters and spaces']
  },
  zipCode: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'organizer'],
    default: 'user'
  }
});

module.exports = mongoose.model('User', UserSchema);
