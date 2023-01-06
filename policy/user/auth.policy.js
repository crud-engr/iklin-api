'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (
                  !desc ||
                  ('get' in desc
                      ? !m.__esModule
                      : desc.writable || desc.configurable)
              ) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k];
                      },
                  };
              }
              Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', {
                  enumerable: true,
                  value: v,
              });
          }
        : function (o, v) {
              o['default'] = v;
          });
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (
                    k !== 'default' &&
                    Object.prototype.hasOwnProperty.call(mod, k)
                )
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
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
exports.AuthPolicy = void 0;
const Joi = __importStar(require('joi'));
const joi_password_complexity_1 = __importDefault(
    require('joi-password-complexity'),
);
class AuthPolicy {
    validateBasicRegistration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object({
                email: Joi.string()
                    .required()
                    .email({ minDomainSegments: 2, tlds: { allow: false } })
                    .trim()
                    .messages({
                        'string.required': 'email is required',
                        'string.empty': 'email cannot be empty',
                        'string.email': 'email must be a valid email address',
                    }),
            }).options({ abortEarly: true });
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
    validateActivateBasicRegistration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object({
                otp: Joi.string().required().messages({
                    'string.required': 'otp is required',
                    'string.empty': 'otp cannot be empty',
                }),
                email: Joi.string()
                    .required()
                    .email({ minDomainSegments: 2, tlds: { allow: false } })
                    .trim()
                    .messages({
                        'string.required': 'email is required',
                        'string.empty': 'email cannot be empty',
                        'string.email': 'email must be a valid email address',
                    }),
            }).options({ abortEarly: true });
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
    validateCompleteSignupProcess(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object({
                email: Joi.string()
                    .required()
                    .email({ minDomainSegments: 2, tlds: { allow: false } })
                    .trim()
                    .messages({
                        'string.required': 'email is required',
                        'string.empty': 'email cannot be empty',
                        'string.email': 'email must be a valid email address',
                    }),
                firstName: Joi.string().required().trim().messages({
                    'string.required': 'first name is required',
                    'string.empty': 'first name cannot be empty',
                }),
                lastName: Joi.string().required().trim().messages({
                    'string.required': 'last name is required',
                    'string.empty': 'last name cannot be empty',
                }),
                phone: Joi.string().required().trim().messages({
                    'string.required': 'phone number is required',
                    'string.empty': 'phone number cannot be empty',
                }),
                referral: Joi.optional().allow(),
                password: (0, joi_password_complexity_1.default)({
                    min: 8,
                    max: 26,
                    lowerCase: 1,
                    upperCase: 1,
                    numeric: 1,
                    symbol: 1,
                    requirementCount: 4,
                }),
                confirmPassword: Joi.ref('password'),
            }).options({ abortEarly: true });
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
    validateSaveCard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object({
                email: Joi.string()
                    .required()
                    .email({ minDomainSegments: 2, tlds: { allow: false } })
                    .trim()
                    .messages({
                        'string.required': 'email is required',
                        'string.empty': 'email cannot be empty',
                        'string.email': 'email must be a valid email address',
                    }),
                cardNumber: Joi.string().required().trim().messages({
                    'string.required': 'Card number is required',
                    'string.empty': 'Card number cannot be empty',
                }),
                expiry: Joi.string().required().trim().messages({
                    'string.required': 'expiry is required',
                    'string.empty': 'expiry cannot be empty',
                }),
                cvv: Joi.string().max(3).required().messages({
                    'string.required': 'cvv is required',
                    'string.empty': 'cvv cannot be empty',
                    'string.limit': 'cvv should be #{limit} digits',
                }),
            }).options({ abortEarly: true });
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
    validateResetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object({
                token: Joi.string().required().messages({
                    'string.required': 'otp is required',
                    'string.empty': 'otp cannot be empty',
                }),
                password: (0, joi_password_complexity_1.default)({
                    min: 8,
                    max: 26,
                    lowerCase: 1,
                    upperCase: 1,
                    numeric: 1,
                    symbol: 1,
                    requirementCount: 4,
                }),
                confirmPassword: Joi.ref('password'),
            }).options({ abortEarly: true });
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
    validateLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = Joi.object({
                email: Joi.string()
                    .required()
                    .email({ minDomainSegments: 2, tlds: { allow: false } })
                    .trim()
                    .messages({
                        'string.required': 'email is required',
                        'string.empty': 'email cannot be empty',
                        'string.email': 'email must be a valid email address',
                    }),
                password: (0, joi_password_complexity_1.default)({
                    min: 8,
                    max: 26,
                    lowerCase: 1,
                    upperCase: 1,
                    numeric: 1,
                    symbol: 1,
                    requirementCount: 4,
                }),
            }).options({ abortEarly: true });
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
exports.AuthPolicy = AuthPolicy;
