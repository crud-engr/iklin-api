'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importDefault(require('mongoose'));
const CardSchema = new mongoose_1.default.Schema(
    {
        user: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
        },
        cardNumber: {
            type: String,
        },
        expiry: {
            type: String,
        },
        cvv: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);
exports.default = mongoose_1.default.model('Card', CardSchema);
