const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/utility-class');
const SuperAdmin = require('../models/superAdmin');
const CompanyUser = require('../models/companyUser');
const { TryCatch } = require('./error');

exports.isAuthenticatedUser = TryCatch(async (req, res, next) => {
    
    const { xToken } = req.cookies;    

    if (!xToken) {
        return next(new ErrorHandler('Please login to access this resource', 401));
    }

    const decodedData = jwt.verify(xToken, process.env.JWT_SECRET);
    let user = await SuperAdmin.findById(decodedData.id);
    if (!user) {
        user = await CompanyUser.findById(decodedData.id);   
    }

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    req.user = user;
    req.role = decodedData.role;

    next();
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.role)) {
            return next(new ErrorHandler(`Role (${req.role}) is not allowed to access this resource`, 403));
        }
        next();
    };
};
