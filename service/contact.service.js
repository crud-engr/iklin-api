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
exports.ContactService = void 0;
const contactUs_1 = require('../mails/contactUs');
const ContactUs_1 = __importDefault(require('../model/ContactUs'));
class ContactService {
    contactUs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, subject, message } = req.body;
                yield ContactUs_1.default.create({
                    name,
                    email,
                    subject,
                    message,
                });
                // send mail to iklin
                yield (0,
                contactUs_1.sendContactUsEmail)(name, email, subject, message);
                return res.status(200).json({
                    status: 'success',
                    message: 'Message sent',
                    code: 200,
                });
            } catch (err) {
                return {
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                };
            }
        });
    }
}
exports.ContactService = ContactService;
