const Company = require("../models/company");
const { TryCatch } = require("../middlewares/error");
const ErrorHandler = require("../utils/utility-class");


exports.createCompany = TryCatch(async (req, res, next) => {

    const { name, email, phone, address, status, maxUsers, expiryDate } = req.body;

     if (!name || !email || !phone || !address || !maxUsers || !expiryDate) {
        return next(new ErrorHandler("Please fill all required fields: Name, Email, Phone, Address, Max. Users, Expiry Date", 400));
    }

    let existingCompany = await Company.findOne({ 
        $or: [{ name }, { email }] 
    });

    if (existingCompany) {
        return next(new ErrorHandler("A company with the same name or email already exists.", 409));
    }

    const company = await Company.create({
        name,
        email,
        phone,
        address,
        status: status || 'active',
        maxUsers,
        expiryDate
    });

    res.status(201).json({
        success: true,
        message: 'Company created successfully.',
        company
    });

});

exports.updateCompany = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid company ID format", 400));
    }

    const company = await Company.findById(id);
    if (!company) {
        return next(new ErrorHandler("Company not found", 404));
    }

    const allowedUpdates = ['name', 'email', 'phone', 'address', 'status', 'maxUsers', 'expiryDate'];
    const isValidOperation = Object.keys(updates).every(update => 
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return next(new ErrorHandler("Invalid update fields", 400));
    }

    if (updates.email || updates.name) {
        const duplicateConditions = {
            _id: { $ne: id }
        };

        if (updates.email) duplicateConditions.email = updates.email;
        if (updates.name) duplicateConditions.name = updates.name;

        const duplicateCompany = await Company.findOne(duplicateConditions);
        if (duplicateCompany) {
            return next(new ErrorHandler("Another company with the same name or email already exists", 409));
        }
    }

    Object.keys(updates).forEach(update => {
        company[update] = updates[update];
    });
    
    company.updatedAt = Date.now(); 
    await company.save(); 

    res.status(200).json({
        success: true,
        message: 'Company updated successfully',
        company
    });
});