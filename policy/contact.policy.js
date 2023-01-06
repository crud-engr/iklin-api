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
exports.ContactPolicy = void 0;
const joi_1 = __importDefault(require('joi'));
class ContactPolicy {
    validateContactForm(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = joi_1.default
                .object({
                    name: joi_1.default.string().required().trim().messages({
                        'string.required': 'name is required',
                        'string.empty': 'name cannot be empty',
                    }),
                    email: joi_1.default
                        .string()
                        .required()
                        .email({ minDomainSegments: 2, tlds: { allow: false } })
                        .trim()
                        .messages({
                            'string.required': 'email is required',
                            'string.empty': 'email cannot be empty',
                            'string.email':
                                'email must be a valid email address',
                        }),
                    subject: joi_1.default.string().required().trim().messages({
                        'string.required': 'subject is required',
                        'string.empty': 'subject cannot be empty',
                    }),
                    message: joi_1.default.string().required().trim().messages({
                        'string.required': 'message is required',
                        'string.empty': 'message cannot be empty',
                    }),
                })
                .options({ abortEarly: true });
            try {
                const value = yield schema.validateAsync(req.body);
                next();
            } catch (err) {
                let errMessage = err.details[0].message.split(' ');
                let [field, ...others] = errMessage;
                field = field.replace(/['"]+/g, '');
                let newErrorMessage = `${field} ${others.join(' ')}`;
                return res.status(422).json({
                    status: 'error',
                    message: newErrorMessage,
                    code: 422,
                });
            }
        });
    }
}
exports.ContactPolicy = ContactPolicy;
