const Lead = require('../models/lead');
const CompanyUser = require('../models/companyUser');
const Company = require('../models/company'); // Ensure you have a Company model
const ErrorHandler = require("../utils/utility-class");
const { TryCatch } = require("../middlewares/error");
const validator = require('validator');

exports.addLead = TryCatch(async (req, res, next) => {    
    const {
        customerName,
        contactDetails,
        companyDetails,
        leadInfo,
        agent,
        tags,
        customFields
    } = req.body;

    // Authorization check
    if (req.user.role !== 'companyUser' && req.user.role !== 'companyAdmin') {
        return next(new ErrorHandler("You are not authorized to create leads.", 403));
    }

    // Company validation
    const company = req.user.companyId;
    if (!company) {
        return next(new ErrorHandler("Company reference not found in user details.", 400));
    }

    const existingCompany = await Company.findById(company);
    if (!existingCompany) {
        return next(new ErrorHandler("Company not found.", 404));
    }

    // Required field validation
    if (!customerName || !contactDetails?.phone || !leadInfo?.source || !leadInfo?.status) {
        return next(
            new ErrorHandler("Please fill all required fields: Customer Name, Phone, Lead Source, Lead Status", 400)
        );
    }

    // Phone validation
    if (!validator.isMobilePhone(contactDetails.phone, 'en-IN')) {
        return next(new ErrorHandler("Invalid primary phone number", 400));
    }

    // Agent validation
    if (agent) {
        const existingAgent = await CompanyUser.findById(agent);
        if (!existingAgent) {
            return next(new ErrorHandler("Agent not found.", 404));
        }
    }

    // Create the lead
    const lead = await Lead.create({
        customerName,
        contactDetails: {
            phone: contactDetails.phone,
            alternatePhones: contactDetails.alternatePhones || [],
            landline: contactDetails.landline || '',
            email: contactDetails.email || '',
            socialMedia: contactDetails.socialMedia || {}
        },
        companyDetails: companyDetails || {
            name: '',
            address: '',
            industry: '',
            website: ''
        },
        leadInfo: {
            source: leadInfo.source,
            purpose: leadInfo.purpose || '',
            status: leadInfo.status,
            type: leadInfo.type || ''
        },
        agent: agent || null,
        followUps: [],
        tags: tags || [],
        customFields: customFields || {},
        metadata: {
            createdBy: req.user._id,
            company: company,
            lastUpdatedBy: req.user._id
        }
    });

    res.status(201).json({
        success: true,
        message: 'Lead added successfully.',
        lead
    });
});

exports.editLead = TryCatch(async (req, res, next) => {
    const { leadId } = req.params;
    const {
        customerName,
        contactDetails,
        companyDetails,
        leadInfo,
        agent,
        tags,
        customFields
    } = req.body;

    // Authorization check
    if (req.user.role !== 'companyUser' && req.user.role !== 'companyAdmin') {
        return next(new ErrorHandler("You are not authorized to edit leads.", 403));
    }

    // Find the lead to edit
    const lead = await Lead.findById(leadId);
    if (!lead) {
        return next(new ErrorHandler("Lead not found.", 404));
    }

    // Verify the lead belongs to the user's company
    if (!lead.metadata.company.equals(req.user.companyId)) {
        return next(new ErrorHandler("You are not authorized to edit this lead.", 403));
    }

    // Required field validation
    if (!customerName || !contactDetails?.phone || !leadInfo?.source || !leadInfo?.status) {
        return next(
            new ErrorHandler("Please fill all required fields: Customer Name, Phone, Lead Source, Lead Status", 400)
        );
    }

    // Phone validation
    if (!validator.isMobilePhone(contactDetails.phone, 'en-IN')) {
        return next(new ErrorHandler("Invalid primary phone number", 400));
    }

    // Agent validation
    if (agent) {
        const existingAgent = await CompanyUser.findById(agent);
        if (!existingAgent) {
            return next(new ErrorHandler("Agent not found.", 404));
        }
    }

    // Update the lead
    lead.customerName = customerName;
    lead.contactDetails = {
        phone: contactDetails.phone,
        alternatePhones: contactDetails.alternatePhones || lead.contactDetails.alternatePhones || [],
        landline: contactDetails.landline || lead.contactDetails.landline || '',
        email: contactDetails.email || lead.contactDetails.email || '',
        socialMedia: contactDetails.socialMedia || lead.contactDetails.socialMedia || {}
    };
    lead.companyDetails = companyDetails || lead.companyDetails || {
        name: '',
        address: '',
        industry: '',
        website: ''
    };
    lead.leadInfo = {
        source: leadInfo.source,
        purpose: leadInfo.purpose || lead.leadInfo.purpose || '',
        status: leadInfo.status,
        type: leadInfo.type || lead.leadInfo.type || ''
    };
    lead.agent = agent || lead.agent || null;
    lead.tags = tags || lead.tags || [];
    lead.customFields = customFields || lead.customFields || {};
    lead.metadata.lastUpdatedBy = req.user._id;
    lead.metadata.updatedAt = new Date();

    await lead.save();

    res.status(200).json({
        success: true,
        message: 'Lead updated successfully.',
        lead
    });
});

// leadFollowUpAdd

exports.leadFollowUpAdd = TryCatch(async (req, res, next) => {
    const { leadId } = req.params;
    const {
        title,
        status,
        priority,
        remark
    } = req.body;

    // Authorization check
    if (req.user.role !== 'companyUser' && req.user.role !== 'companyAdmin') {
        return next(new ErrorHandler("You are not authorized to add follow-ups.", 403));
    }

    // Find the lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
        return next(new ErrorHandler("Lead not found.", 404));
    }

    // Verify the lead belongs to the user's company
    if (!lead.metadata.company.equals(req.user.companyId)) {
        return next(new ErrorHandler("You are not authorized to add follow-ups to this lead.", 403));
    }

    // Required field validation
    if (!status || !remark?.feedback) {
        return next(new ErrorHandler("Status and feedback are required fields.", 400));
    }

    // Validate status enum
    const validStatuses = ['Hot', 'Warm', 'Cold', 'Lost', 'Closed'];
    if (!validStatuses.includes(status)) {
        return next(new ErrorHandler(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400));
    }

    // Validate priority if provided
    if (priority) {
        const validPriorities = ['Low', 'Medium', 'High'];
        if (!validPriorities.includes(priority)) {
            return next(new ErrorHandler(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`, 400));
        }
    }

    // Validate next follow-up date if provided
    if (remark.nextFollowUp?.date) {
        const nextDate = new Date(remark.nextFollowUp.date);
        if (isNaN(nextDate.getTime())) {
            return next(new ErrorHandler("Invalid next follow-up date", 400));
        }
        if (nextDate < new Date()) {
            return next(new ErrorHandler("Next follow-up date cannot be in the past", 400));
        }
    }

    // Create the follow-up object
    const newFollowUp = {
        title: title || '',
        status,
        priority: priority || 'Medium',
        remark: {
            feedback: remark.feedback,
            nextFollowUp: remark.nextFollowUp || {},
            assignTo: remark.assignTo || null,
            attachments: remark.attachments || [],
            note: remark.note || '',
            updatedBy: req.user._id
        }
    };

    // Add the follow-up to the lead
    lead.followUps.push(newFollowUp);
    
    // Update lead status if it's being changed to Closed or Lost
    if (status === 'Closed' || status === 'Lost') {
        lead.leadInfo.status = status;
    }

    // Update last updated metadata
    lead.metadata.lastUpdatedBy = req.user._id;
    
    await lead.save();

    res.status(201).json({
        success: true,
        message: 'Follow-up added successfully.',
        followUp: newFollowUp,
        lead
    });
});


exports.editLeadFollowUp = TryCatch(async (req, res, next) => {
    const { leadId, followUpId } = req.params;
    const {
        title,
        status,
        priority,
        remark
    } = req.body;

    // Authorization check
    if (req.user.role !== 'companyUser' && req.user.role !== 'companyAdmin') {
        return next(new ErrorHandler("You are not authorized to edit follow-ups.", 403));
    }

    // Find the lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
        return next(new ErrorHandler("Lead not found.", 404));
    }

    // Verify the lead belongs to the user's company
    if (!lead.metadata.company.equals(req.user.companyId)) {
        return next(new ErrorHandler("You are not authorized to edit follow-ups for this lead.", 403));
    }

    // Find the follow-up to edit
    const followUpToEdit = lead.followUps.id(followUpId);
    if (!followUpToEdit) {
        return next(new ErrorHandler("Follow-up not found.", 404));
    }

    // Validate status enum if provided
    if (status) {
        const validStatuses = ['Hot', 'Warm', 'Cold', 'Lost', 'Closed'];
        if (!validStatuses.includes(status)) {
            return next(new ErrorHandler(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400));
        }
    }

    // Validate priority if provided
    if (priority) {
        const validPriorities = ['Low', 'Medium', 'High'];
        if (!validPriorities.includes(priority)) {
            return next(new ErrorHandler(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`, 400));
        }
    }

    // Validate next follow-up date if provided
    if (remark?.nextFollowUp?.date) {
        const nextDate = new Date(remark.nextFollowUp.date);
        if (isNaN(nextDate.getTime())) {
            return next(new ErrorHandler("Invalid next follow-up date", 400));
        }
        if (nextDate < new Date()) {
            return next(new ErrorHandler("Next follow-up date cannot be in the past", 400));
        }
    }

    // Validate assignTo if provided
    if (remark?.assignTo && !mongoose.Types.ObjectId.isValid(remark.assignTo)) {
        return next(new ErrorHandler("Invalid assignTo ID format", 400));
    }

    // Update follow-up fields if they exist in request
    if (title !== undefined) followUpToEdit.title = title;
    if (status !== undefined) followUpToEdit.status = status;
    if (priority !== undefined) followUpToEdit.priority = priority;
    
    // Update remark fields if they exist in request
    if (remark) {
        if (remark.feedback !== undefined) followUpToEdit.remark.feedback = remark.feedback;
        if (remark.nextFollowUp !== undefined) followUpToEdit.remark.nextFollowUp = remark.nextFollowUp;
        if (remark.assignTo !== undefined) {
            followUpToEdit.remark.assignTo = remark.assignTo 
                ? new mongoose.Types.ObjectId(remark.assignTo) 
                : null;
        }
        if (remark.attachments !== undefined) followUpToEdit.remark.attachments = remark.attachments;
        if (remark.note !== undefined) followUpToEdit.remark.note = remark.note;
        
        // Always update updatedBy and updatedAt when remark is modified
        followUpToEdit.remark.updatedBy = req.user._id;
        followUpToEdit.remark.updatedAt = new Date();
    }

    // Update lead status if follow-up status is being changed to Closed or Lost
    if (status === 'Closed' || status === 'Lost') {
        lead.leadInfo.status = status;
    }

    // Update last updated metadata
    lead.metadata.lastUpdatedBy = req.user._id;
    
    await lead.save();

    res.status(200).json({
        success: true,
        message: 'Follow-up updated successfully.',
        followUp: followUpToEdit,
        lead
    });
});

exports.deleteLeadFollowUp = TryCatch(async (req, res, next) => {
    const { leadId, followUpId } = req.params;

    // Authorization check
    if (req.user.role !== 'companyUser' && req.user.role !== 'companyAdmin') {
        return next(new ErrorHandler("You are not authorized to delete follow-ups.", 403));
    }

    // Find the lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
        return next(new ErrorHandler("Lead not found.", 404));
    }

    // Verify the lead belongs to the user's company
    if (!lead.metadata.company.equals(req.user.companyId)) {
        return next(new ErrorHandler("You are not authorized to delete follow-ups from this lead.", 403));
    }

    // Find the follow-up to delete
    const followUpToDelete = lead.followUps.id(followUpId);
    if (!followUpToDelete) {
        return next(new ErrorHandler("Follow-up not found.", 404));
    }

    // Special handling if deleting a Closed/Lost follow-up
    const wasClosedOrLost = followUpToDelete.status === 'Closed' || followUpToDelete.status === 'Lost';

    // Remove the follow-up
    lead.followUps.pull(followUpId);

    // If we deleted a Closed/Lost follow-up, check if we need to update lead status
    if (wasClosedOrLost) {
        const hasOtherClosedFollowUps = lead.followUps.some(fu => 
            fu.status === 'Closed' || fu.status === 'Lost'
        );
        
        if (!hasOtherClosedFollowUps) {
            // Find the most recent non-Closed/Lost status from remaining follow-ups
            const recentFollowUp = [...lead.followUps]
                .sort((a, b) => b.date - a.date)
                .find(fu => fu.status !== 'Closed' && fu.status !== 'Lost');
            
            lead.leadInfo.status = recentFollowUp?.status || 'Warm'; // Default to 'Warm' if no other follow-ups
        }
    }

    // Update last updated metadata
    lead.metadata.lastUpdatedBy = req.user._id;
    
    await lead.save();

    res.status(200).json({
        success: true,
        message: 'Follow-up deleted successfully.',
        lead
    });
});
