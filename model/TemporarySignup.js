'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importDefault(require('mongoose'));
const TemporarySignupSchema = new mongoose_1.default.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            default: '',
        },
        lastName: {
            type: String,
            default: '',
        },
        phone: {
            type: String,
            default: '',
        },
        password: {
            type: String,
            default: '',
        },
        referral: {
            type: String,
            default: '',
        },
        location: {
            type: String,
            default: '',
        },
        activated: {
            type: Boolean,
            default: false,
        },
        activationToken: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            default: 'user',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);
exports.default = mongoose_1.default.model(
    'TemporarySignup',
    TemporarySignupSchema,
);
