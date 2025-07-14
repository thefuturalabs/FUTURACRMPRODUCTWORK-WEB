const mongoose = require('mongoose');
const validator = require('validator');

const followUpSchema = new mongoose.Schema({
    title: { 
        type: String, 
        trim: true,
        maxlength: 100
    },
    date: { 
        type: Date,
        default: Date.now,
        index: true
    },
    status: { 
        type: String,
        enum: ['Hot', 'Warm', 'Cold', 'Lost', 'Closed'],
        required: true,
        index: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    remark: {
        feedback: { 
            type: String, 
            required: true,
            trim: true,
            maxlength: 500
        },
        nextFollowUp: {
            date: { type: Date, index: true },
            time: { type: String, trim: true },
            location: { type: String, trim: true }
        },
        assignTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CompanyUser',
            index: true
        },
        attachments: [{
            url: String,
            name: String,
            type: String
        }],
        note: { 
            type: String, 
            trim: true,
            maxlength: 500
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CompanyUser',
            required: true
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
}, { timestamps: true });

const leadSchema = new mongoose.Schema({
    customerName: { 
        type: String, 
        required: true, 
        trim: true,
        minlength: 3,
        maxlength: 100,
        index: true
    },
    contactDetails: {
        phone: { 
            type: String, 
            required: true,
            trim: true,
            validate: {
                validator: v => validator.isMobilePhone(v, 'en-IN'),
                message: props => `${props.value} is invalid`
            }
        },
        alternatePhones: [{
            type: String,
            validate: {
                validator: v => validator.isMobilePhone(v, 'en-IN'),
                message: props => `${props.value} is invalid`
            }
        }],
        landline: { 
            type: String, 
            trim: true,
            default: '', // Add default value
            validate: {
                validator: function(v) {
                    // Only validate if value is provided
                    return v === '' || (validator.isNumeric(v) && v.length >= 5 && v.length <= 15);
                },
                message: 'Landline must be 5-15 digits'
            }
        },
        email: { 
            type: String, 
            trim: true, 
            lowercase: true,
            default: '', // Add default value
            validate: {
                validator: function(v) {
                    // Only validate if value is provided
                    return v === '' || validator.isEmail(v);
                },
                message: 'Invalid email'
            }
        },
        socialMedia: {
            whatsapp: String,
            linkedin: String
        }
    },
    companyDetails: {
        name: { 
            type: String, 
            trim: true,
            maxlength: 100
        },
        address: { 
            type: String, 
            trim: true,
            maxlength: 200
        },
        industry: String,
        website: String
    },
    leadInfo: {
        source: { 
            type: String, 
            required: true, 
            trim: true,
            index: true
        },
        purpose: { 
            type: String, 
            trim: true 
        },
        status: { 
            type: String,
            enum: ['Hot', 'Warm', 'Cold', 'Lost', 'Closed'],
            required: true,
            default: 'Warm',
            index: true
        },
        type: { 
            type: String, 
            trim: true,
            index: true
        }
    },
    agent: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'CompanyUser',
        index: true
    },
    followUps: [followUpSchema],
    tags: [String],
    customFields: mongoose.Schema.Types.Mixed,
    metadata: {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CompanyUser',
            required: true
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            index: true
        },
        lastUpdatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CompanyUser'
        }
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for next follow-up date
leadSchema.virtual('nextFollowUpDate').get(function() {
    if (!this.followUps) return null;
    const upcoming = this.followUps
        .filter(f => f.remark?.nextFollowUp?.date > new Date())
        .sort((a, b) => a.remark.nextFollowUp.date - b.remark.nextFollowUp.date);
    return upcoming[0]?.remark.nextFollowUp.date;
});

// Indexes
leadSchema.index({
    'leadInfo.status': 1,
    'leadInfo.type': 1,
    'metadata.company': 1
});

leadSchema.index({
    'contactDetails.phone': 1,
    'metadata.company': 1
}, { unique: true });

module.exports = mongoose.model('Lead', leadSchema);