const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ErrorHandler = require('../utils/utility-class');
const superAdmin = require('../models/superAdmin');
const companyUser = require('../models/companyUser');

const generateTokens = async (user, role) => {
    const xToken = jwt.sign(
        { id: user._id, role, companyId: user.companyId ? user.companyId._id : null },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_X_TOKEN_EXPIRES_IN || '30m' }
    );

    const rToken = crypto.randomBytes(64).toString('hex');       

    const hashedRToken = crypto.createHash('sha256').update(rToken).digest('hex');     

    user.rToken = hashedRToken;
    await user.save();

    return { xToken, rToken };
};

const setCookies = (res, xToken, rToken) => {
    res.cookie('xToken', xToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 30 * 60 * 1000
    });

    res.cookie('rToken', rToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
};

exports.handleLogin = async (user, role, res) => {
    const { xToken, rToken } = await generateTokens(user, role);
    setCookies(res, xToken, rToken);
    return res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        xToken
    });
};

exports.rToken = async (req, res, next) => {

    try {
        const rToken = req.cookies.rToken;        

        if (!rToken) {
            return next(new ErrorHandler('R token is missing', 401));
        }

        const hashedRToken = crypto.createHash('sha256').update(rToken).digest('hex');        
        
        const user = await superAdmin.findOne({ rToken: hashedRToken }) ||
            await companyUser.findOne({ rToken: hashedRToken });

        if (!user) {
            return next(new ErrorHandler('Invalid R token', 403));
        }        

        const role = user.role;

        const newTokens = await generateTokens(user, role);        

        setCookies(res, newTokens.xToken, newTokens.rToken);        

        return res.status(200).json({
            success: true,
            message: 'Tokens updated successfully',
            xToken:newTokens.xToken
        });
    } catch (error) {
        return next(new ErrorHandler('Could not update token', 500));
    }
};

exports.logout = async (req, res, next) => {
    try {
        const user = req.user;
        user.rToken = undefined;
        await user.save();

        res.clearCookie('xToken');
        res.clearCookie('rToken');

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        return next(new ErrorHandler('Logout failed', 500));
    }
};
