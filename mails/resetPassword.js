'use strict';
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next(),
            );
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.sendResetPasswordOTPEmail = void 0;
const config_1 = __importDefault(require('config'));
const axios_1 = __importDefault(require('axios'));
const moment_1 = __importDefault(require('moment'));
let sendchamp_email_url = config_1.default.get('SENDCHAMP_EMAIL_URL');
let sendchamp_public_access_key = config_1.default.get(
    'SENDCHAMP_PUB_ACCESS_KEY',
);
let email_name_from = config_1.default.get('EMAIL_NAME_FROM');
let email_from = config_1.default.get('EMAIL_FROM');
const sendResetPasswordOTPEmail = (email, otp, firstName) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const timeStamp = (0, moment_1.default)().format('LLLL');
        try {
            const response = yield (0, axios_1.default)(sendchamp_email_url, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: `Bearer ${sendchamp_public_access_key}`,
                },
                data: {
                    to: [{ email, name: `${firstName}` }],
                    from: { name: email_name_from, email: email_from },
                    message_body: {
                        type: 'text/html',
                        value: `
                        <div>
                            <p>Hi ${firstName}.</p>
                            <p>Welcome Back!</p>
                            <p>You forgot your password and requested for password reset on ${timeStamp}.</p>
                            <p>Use this reset code ${otp} as your One Time Password to reset your Iklin password</p>
                            <p>If this is not you, please ignore and send us a mail on hello@iklin.app </p>
                        </div>`,
                    },
                    subject: 'Iklin Reset Password Code',
                },
            });
        } catch (err) {
            console.log('Unable to send email ----------');
            throw Error(err);
        }
    });
exports.sendResetPasswordOTPEmail = sendResetPasswordOTPEmail;
