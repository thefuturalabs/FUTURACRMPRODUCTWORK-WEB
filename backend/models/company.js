const mongoose = require('mongoose');
const validator = require('validator');

const companySchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      minlength: [3, 'Company name must be at least 3 characters long'],
      maxlength: [50, 'Company name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: props => `${props.value} is not a valid email!`
      }
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      validate: {
        validator: function(v) {
            
          return validator.isMobilePhone(v, 'en-IN');
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      minlength: [10, 'Address must be at least 10 characters long']
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    maxUsers: {
      type: Number,
      required: [true, 'Max users is required'],
      min: [1, 'Max users must be at least 1']
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });
  
  companySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
  
  module.exports = mongoose.model('Company', companySchema);