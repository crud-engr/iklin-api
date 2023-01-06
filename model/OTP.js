'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importDefault(require('mongoose'));
const OTPSchema = new mongoose_1.default.Schema(
    {
        email: {
            type: String,
        },
        otpCode: {
            type: String,
        },
        expiry: {
            type: Date,
        },
        used: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);
exports.default = mongoose_1.default.model('OTP', OTPSchema);
