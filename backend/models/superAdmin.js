const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require("crypto");

const superAdminSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [3, 'Full name must be at least 3 characters long'],
    maxlength: [20, 'Full name cannot exceed 20 characters']
  },
  // mobileNumber: {
  //   type: String,
  //   required: [true, 'Mobile number is required'],
  //   unique: true,
  //   validate: {
  //     validator: function(v) {
  //       return validator.isMobilePhone(v, 'en-IN');
  //     },
  //     message: props => `${props.value} is not a valid mobile number!`
  //   }
  // },
  mobileNumber: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: {
        validator: function(v) {
          return validator.isEmail(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false,
    validate: {
      validator: function(v) {
        return validator.isStrongPassword(v, {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 0
        }); 
      },
      message: 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
    }
  },
  role:{
    type: String,
    enum: ['superAdmin'],
    default:'superAdmin',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    required: true
  },
  rToken: {
    type: String,
    select: false
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpire: {
    type: Date,
    select: false
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

superAdminSchema.methods.invalidateSessions = async function() {
  this.rToken = undefined;
  await this.save({ validateBeforeSave: false });
};

superAdminSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

superAdminSchema.methods.generateResetPasswordToken = async function() {

  const resetToken = crypto.randomInt(100000,999999).toString();

  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.resetPasswordExpire = Date.now() + 3 * 60 * 1000; // 3 minutes

  return resetToken;

};

superAdminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {    
    if (!validator.isStrongPassword(this.password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0
    })) {
      throw new Error('Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
    }
    this.password = await bcrypt.hash(this.password, 10);
    
  }
  next();
});

superAdminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SuperAdmin', superAdminSchema);
