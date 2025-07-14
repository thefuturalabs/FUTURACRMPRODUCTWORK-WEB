const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const { createCompany, updateCompany } = require("../controllers/company");
const router = express.Router();

router.route('/create').post(isAuthenticatedUser, authorizeRoles('superAdmin'), createCompany);
router.route('/:id').post(isAuthenticatedUser, authorizeRoles('superAdmin'), updateCompany);


module.exports = router;
