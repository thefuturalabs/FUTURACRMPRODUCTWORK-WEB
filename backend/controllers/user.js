const { TryCatch } = require("../middlewares/error");
const SuperAdmin = require('../models/superAdmin');
const CompanyUser = require("../models/companyUser");
const Company = require("../models/company");
const ErrorHandler = require("../utils/utility-class");
const {findUserAndValidatePassword, findUserByMobileNumber} = require('../utils/authUtils');
const {  handleLogin, logout, rToken } = require("../middlewares/tokenGen");
const crypto = require("crypto")


exports.registerSuperAdmin = TryCatch(async (req, res, next) => {

    const { fullName, mobileNumber, password } = req.body;

    if(!fullName || !mobileNumber || !password){
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    let superAdmin = await SuperAdmin.findOne({ mobileNumber });

    if (superAdmin) {
        return next(new ErrorHandler("Super Admin with this mobile number already exists.", 400));;
    }

    await SuperAdmin.create({
        fullName,
        mobileNumber,
        password,
    });

    res.status(201).json({
        success: true,
         message: 'Super Admin registered successfully.' 
        });


});

exports.updateSuperAdmin = TryCatch(async (req, res, next) => {
  const { fullName, mobileNumber, password, status } = req.body;
  const superAdminId = req.params.id;

  let superAdmin = await SuperAdmin.findById(superAdminId).select('+password +rToken');
  
  if (!superAdmin) {
    return next(new ErrorHandler('Super Admin not found', 404));
  }

  if (mobileNumber && mobileNumber !== superAdmin.mobileNumber) {
    const existingSuperAdmin = await SuperAdmin.findOne({ mobileNumber });
    if (existingSuperAdmin) {
      // return next(new ErrorHandler('Mobile number already in use', 409));
      return next(new ErrorHandler('Email already in use', 409));
    }
    superAdmin.mobileNumber = mobileNumber;
  }

  if (fullName) superAdmin.fullName = fullName;
  if (status) superAdmin.status = status;
  
  if (password && !(await superAdmin.comparePassword(password))) {
    superAdmin.password = password;
    await superAdmin.invalidateSessions();
  }

  await superAdmin.save();

  res.status(200).json({
    success: true,
    message: 'Super Admin updated successfully',
    data: {
      fullName: superAdmin.fullName,
      mobileNumber: superAdmin.mobileNumber,
      status: superAdmin.status,
    }
  });
});

exports.registerCompanyAdminAndUser = TryCatch(async (req,res, next) => {  

  const { fullName, mobileNumber, password, role, companyId } = req.body;
  const loggedInUserRole = req.user.role;

  if (!fullName || !mobileNumber || !password || !companyId) {
    return next(new ErrorHandler('All fields are required', 400));
  }

  const company = await Company.findById(companyId);

  if (!company) {
    return next(new ErrorHandler('Company not found', 404));
  }

  const totalUsers = await CompanyUser.countDocuments({ companyId });

  if (loggedInUserRole === 'companyUser') {
    return next(new ErrorHandler('Unauthorized: Company users cannot add users', 403));
  }

  if (totalUsers >= company.maxUsers) {
    return next(new ErrorHandler(`Cannot add more users. Max allowed users for this company is ${company.maxUsers}`, 403));
  }

  const existingUser = await CompanyUser.findOne({ mobileNumber });
  if (existingUser) {
    // return next(new ErrorHandler('Mobile number already in use', 409));
    return next(new ErrorHandler('Email already in use', 409));
  }

  await CompanyUser.create({
    fullName,
    mobileNumber,
    password,
    role,
    companyId,
    createdBy:req.user._id,
    createdByModel:loggedInUserRole === 'superAdmin' ? 'superadmins' : 'companyusers'
  });

  res.status(201).json({
    success: true,
    message: 'Company user created successfully',
  });
});

exports.updateCompanyAdminAndUser = TryCatch(async (req, res, next) => {

  const { fullName, mobileNumber, password, status } = req.body;
  const { id, role } = req.params;
  const loggedInUserRole = req.user.role;


  let user = await CompanyUser.findById(id).select('+password +rToken');  

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  // if (loggedInUserRole === 'companyUser' && role === 'companyAdmin') {
  //   return next(new ErrorHandler('Unauthorized: Company users cannot update company admins', 403));
  // }

  if (loggedInUserRole === 'companyUser' && user._id.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler('Unauthorized: Company users can only update their own details', 403));
  }

  if (loggedInUserRole === 'companyAdmin' && user.companyId.toString() !== req.user.companyId.toString()) {
    return next(new ErrorHandler('Unauthorized: You can only update users in your own company', 403));
  }

  if (mobileNumber && mobileNumber !== user.mobileNumber) {
    const existingUser = await CompanyUser.findOne({ mobileNumber });
    if (existingUser) {
      // return next(new ErrorHandler('Mobile number already in use', 409));
      return next(new ErrorHandler('Email already in use', 409));
    }
    user.mobileNumber = mobileNumber;
  }

  if (fullName) user.fullName = fullName;
  if (status) user.status = status;

  if (password && !(await user.comparePassword(password))) {
    user.password = password;
    await user.invalidateSessions();
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: `${role} updated successfully`,
    data: {
      fullName: user.fullName,
      mobileNumber: user.mobileNumber,
      status: user.status,
    },
  });
});

exports.userLogin = TryCatch(async (req, res, next) => {
    const { mobileNumber, password } = req.body;
  
    if (!mobileNumber || !password) {
      return next(new ErrorHandler('Please provide mobile number and password', 400));
    }
  
    const { user, isPasswordMatched, role } = await findUserAndValidatePassword(mobileNumber, password);

    if (!user || !isPasswordMatched) {
      return next(new ErrorHandler('Invalid mobile number or password', 401));
    }
  
    if (user.status !== 'active') {
      return next(new ErrorHandler('Your account is inactive. Please contact support.', 403));
    }

    if (role !== 'superAdmin' && user.companyId.expiryDate < Date.now()) {
      return next(new ErrorHandler('Company account has expired. Contact Super Admin.', 403));
    }
  
    await handleLogin(user, role, res);
    
});

exports.rToken = TryCatch(async (req, res, next) => {
    await rToken(req, res, next);
});

exports.userLogout = TryCatch(async (req, res, next) => {
    await logout(req, res, next);
});

exports.generateResetToken = TryCatch(async (req, res, next) => {
  const { mobileNumber } = req.body;

  if (!mobileNumber) {
    return next(new ErrorHandler('Please provide your mobile number', 400));
  }

  let user = await findUserByMobileNumber(mobileNumber);  

  if (!user) {
    return next(new ErrorHandler('No user found with this mobile number', 404));
  }

  const resetToken = await user.generateResetPasswordToken();  

  await user.save({ validateBeforeSave: false });

  const message = `Your password reset code is: ${resetToken}`;

  res.status(200).json({
    success:true,
    message,
  })

  // try {
  //   await sendSms(user.mobileNumber, message);

  //   res.status(200).json({
  //     success: true,
  //     message: `Reset code sent to mobile number ${mobileNumber}`,
  //   });
  // } catch (err) {
  //   user.resetPasswordToken = undefined;
  //   user.resetPasswordExpire = undefined;

  //   await user.save({ validateBeforeSave: false });

  //   return next(new ErrorHandler('Failed to send SMS. Try again later.', 500));
  // }


});

exports.resetPassword = TryCatch(async (req, res, next) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return next(new ErrorHandler('Please provide reset token and new password', 400));
  }

  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  let user = await CompanyUser.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler('Invalid or expired reset token', 400));
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful',
  });
});
