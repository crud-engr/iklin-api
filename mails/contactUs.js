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
exports.sendContactUsEmail = void 0;
const config_1 = __importDefault(require('config'));
const axios_1 = __importDefault(require('axios'));
let sendchamp_email_url = config_1.default.get('SENDCHAMP_EMAIL_URL');
let sendchamp_public_access_key = config_1.default.get(
    'SENDCHAMP_PUB_ACCESS_KEY',
);
let email_name_from = config_1.default.get('EMAIL_NAME_FROM');
let email_from = config_1.default.get('EMAIL_FROM');
const sendContactUsEmail = (user_name, user_email, subject, user_message) =>
    __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, axios_1.default)(sendchamp_email_url, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: `Bearer ${sendchamp_public_access_key}`,
                },
                data: {
                    to: [{ email: 'hello@iklin.app', name: 'Iklin' }],
                    from: { name: user_name, email: user_email },
                    message_body: {
                        type: 'text/html',
                        value: `
                        <div>
                            <p>Hello Iklin.</p>
                            <p>${user_message}</p>
                        </div>`,
                    },
                    subject,
                },
            });
        } catch (err) {
            console.log('Unable to send email ----------');
            throw Error(err);
        }
    });
exports.sendContactUsEmail = sendContactUsEmail;
