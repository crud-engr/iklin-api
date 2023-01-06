'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const contact_controller_1 = require('../controller/contact.controller');
const contact_policy_1 = require('../policy/contact.policy');
const router = (0, express_1.Router)();
router
    .route('')
    .post(
        [new contact_policy_1.ContactPolicy().validateContactForm],
        new contact_controller_1.ContactController().contactUs,
    );
exports.default = router;
