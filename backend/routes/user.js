const express = require("express");
const { registerSuperAdmin, userLogin, userLogout, updateSuperAdmin, updateCompanyAdminAndUser, registerCompanyAdminAndUser, generateResetToken, resetPassword } = require("../controllers/user");
const { rToken } = require("../middlewares/tokenGen");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

router.route('/superadmin/register').post(registerSuperAdmin);
router.route('/superadmin/update/:id').put(isAuthenticatedUser, authorizeRoles('superAdmin'), updateSuperAdmin);
router.route('/companyuser/register').post(isAuthenticatedUser, authorizeRoles('superAdmin', 'companyAdmin'), registerCompanyAdminAndUser);
router.route('/companyuser/update/:id/:role').put(isAuthenticatedUser, authorizeRoles('superAdmin', 'companyAdmin', 'companyUser'), updateCompanyAdminAndUser);

router.route('/login').post(userLogin);

router.route('/rtoken').post(rToken);
router.route('/logout').post(isAuthenticatedUser, userLogout);

router.route('/reset-token-generate').post(generateResetToken);
router.route('/reset-password').post(resetPassword);

// Example protected route
router.get('/admin-dashboard', isAuthenticatedUser, authorizeRoles('superAdmin'), (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the admin dashboard'
    });
});


module.exports = router;
