const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const { addLead, leadFollowUpAdd, editLeadFollowUp, editLead, deleteLeadFollowUp } = require("../controllers/lead");
const router = express.Router();

router.route('/add').post(isAuthenticatedUser, authorizeRoles('companyUser', 'companyAdmin'), addLead);
router.route('/:leadId').patch(isAuthenticatedUser, authorizeRoles('companyUser', 'companyAdmin'), editLead);

router.route('/:leadId/follow-ups/add').post(isAuthenticatedUser, authorizeRoles('companyUser', 'companyAdmin'), leadFollowUpAdd);
router.route('/:leadId/follow-ups/:followUpId')
.patch(isAuthenticatedUser, authorizeRoles('companyUser', 'companyAdmin'), editLeadFollowUp)
.delete(isAuthenticatedUser, authorizeRoles('companyUser', 'companyAdmin'), deleteLeadFollowUp)


module.exports = router;







