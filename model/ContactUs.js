'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importDefault(require('mongoose'));
const ContactUsSchema = new mongoose_1.default.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        subject: {
            type: String,
        },
        message: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);
exports.default = mongoose_1.default.model('ContactUs', ContactUsSchema);
