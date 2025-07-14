const bcrypt = require('bcrypt');
const SuperAdmin = require('../models/superAdmin');
const CompanyUser = require('../models/companyUser');

exports.findUserAndValidatePassword = async (mobileNumber, password) => {

    let user = await CompanyUser.findOne({ mobileNumber }).select('+password').populate('companyId');
    if (user) {
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      return { user, isPasswordMatched, role: user.role };
    }

    user = await SuperAdmin.findOne({ mobileNumber }).select('+password');
  if (user) {
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    return { user, isPasswordMatched, role: user.role };
  }

  return { user: null, isPasswordMatched: false, role: null };
};

exports.findUserByMobileNumber = async (mobileNumber) => {

  let user = await CompanyUser.findOne({ mobileNumber });

  if (user) {
    return user;
  }

  user = await SuperAdmin.findOne({ mobileNumber });
  
  if (user) {
    return user;
  }

  return null;
};

