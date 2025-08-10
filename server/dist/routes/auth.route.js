"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validationSchemas_1 = require("../utils/validationSchemas");
const auth_controller_1 = require("../controllers/auth.controller");
const common_1 = require("../middlewares/common");
const express_1 = require("express");
const router = (0, express_1.Router)();
// Base route: /api/v1/auth
router.post('/register', auth_controller_1.register);
router.post('/login', (0, common_1.isValidated)(validationSchemas_1.loginUserSchema), auth_controller_1.login);
router.post('/refresh', auth_controller_1.refresh);
router.all('/logout', auth_controller_1.logout);
router.post('/verify-email', (0, common_1.isValidated)(validationSchemas_1.verifyEmailSchema), auth_controller_1.verifyEmail);
router.post('/forget-password', (0, common_1.isValidated)(validationSchemas_1.forgetPassSchema), auth_controller_1.forgetPassword);
router.post('/reset-password/:resetPassToken', (0, common_1.isValidated)(validationSchemas_1.resetPassSchema), auth_controller_1.resetPassword);
exports.default = router;
//# sourceMappingURL=auth.route.js.map