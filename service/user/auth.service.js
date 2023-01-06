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
exports.AuthService = void 0;
const crypto_1 = __importDefault(require('crypto'));
const bcryptjs_1 = __importDefault(require('bcryptjs'));
const config_1 = __importDefault(require('config'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const TemporarySignup_1 = __importDefault(
    require('../../model/TemporarySignup'),
);
const signupOTP_1 = require('../../mails/signupOTP');
const OTP_1 = __importDefault(require('../../model/OTP'));
const moment_1 = __importDefault(require('moment'));
const accountVerifySuccess_1 = require('../../mails/accountVerifySuccess');
const User_1 = __importDefault(require('../../model/User'));
const Card_1 = __importDefault(require('../../model/Card'));
const Wallet_1 = __importDefault(require('../../model/Wallet'));
const resetPassword_1 = require('../../mails/resetPassword');
// import recordActivityLogs from '../../utils/activityLogs';
class AuthService {
    generateOTP() {
        return __awaiter(this, void 0, void 0, function* () {
            return `${Math.floor(
                Math.random() * (999999 - 100000 + 1) + 100000,
            )}`;
        });
    }
    saveBasicRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield TemporarySignup_1.default.exists({ email });
                if (user) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'User already exists',
                        code: 400,
                    });
                }
                const tempUser = new TemporarySignup_1.default({ email });
                yield tempUser.save();
                const otp = yield this.generateOTP();
                console.log('O-T-P: ', otp);
                // send otp mail to user
                yield (0, signupOTP_1.sendBasicSignupOTPEmail)(email, otp);
                // record log activity to database
                // await recordActivityLogs({
                //     email,
                //     action: 'Sent a verification code',
                //     ipAddress: req.socket.remoteAddress,
                // });
                // hash otp
                const hashedOTP = crypto_1.default
                    .createHash('sha256')
                    .update(otp)
                    .digest('hex');
                yield TemporarySignup_1.default.findOneAndUpdate(
                    { email },
                    { email, activationToken: hashedOTP },
                );
                yield OTP_1.default
                    .findOneAndUpdate(
                        { email },
                        {
                            email,
                            otpCode: hashedOTP,
                            expiry: (0, moment_1.default)().add('5', 'minutes'),
                            used: false,
                        },
                        { new: true, upsert: true, setDefaultsOnInsert: true },
                    )
                    .exec();
                return res.status(201).json({
                    status: 'success',
                    message: `Verification code has been sent to ${tempUser.email}`,
                    code: 201,
                });
            } catch (err) {
                console.log(err.message);
                return res.status(500).json({
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                });
            }
        });
    }
    // send email to this endpoint
    activateBasicRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp, email } = req.body;
                if (!email) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'User not found',
                        code: 400,
                    });
                }
                // encrypt otp
                const hashed_otp = crypto_1.default
                    .createHash('sha256')
                    .update(otp)
                    .digest('hex');
                const isOTPFound = yield OTP_1.default
                    .findOne({
                        email,
                        otpCode: hashed_otp,
                        used: false,
                    })
                    .exec();
                if (!isOTPFound) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Invalid OTP',
                        code: 400,
                    });
                }
                // check if otp has not expired
                const now = (0, moment_1.default)(Date.now());
                const sentTime = (0, moment_1.default)(isOTPFound.expiry);
                const duration = moment_1.default.duration(now.diff(sentTime));
                const mins = duration.asMinutes();
                if (mins > 60) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Invalid or expired otp. Please resend!',
                        code: 400,
                    });
                }
                yield OTP_1.default
                    .findOneAndUpdate(
                        { otpCode: hashed_otp, used: false },
                        { otpCode: hashed_otp, used: true },
                    )
                    .exec();
                // send account verify mail
                yield (0,
                accountVerifySuccess_1.accountVerificationSuccessEmail)(isOTPFound.email);
                yield TemporarySignup_1.default
                    .findOneAndUpdate(
                        { email: isOTPFound.email },
                        { email: isOTPFound.email, activated: true },
                    )
                    .exec();
                return res.status(200).json({
                    status: 'success',
                    message: 'Account successfully verified.',
                    code: 200,
                });
            } catch (err) {
                console.log(err.message);
                return res.status(500).json({
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                });
            }
        });
    }
    reformatPhoneNumber(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            // remove starting zero for all phone numbers
            if (phone.startsWith('0')) {
                phone = phone.substring(1);
            }
            return phone;
        });
    }
    // send email to this endpoint
    completeSignupProcess(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, firstName, lastName, phone, password, referral } =
                    req.body;
                const tempUser = yield TemporarySignup_1.default
                    .findOne({ email })
                    .exec();
                if (!tempUser) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'User not found',
                        code: 400,
                    });
                }
                if (!tempUser.activated) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'account is not activated',
                        code: 400,
                    });
                }
                const userExist = yield User_1.default
                    .findOne({ email })
                    .exec();
                if (userExist) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'user already exist',
                        code: 400,
                    });
                }
                phone = yield this.reformatPhoneNumber(phone);
                password = yield this.hashPassword(password);
                let fieldsToUpdate = {
                    email,
                    firstName,
                    lastName,
                    phone,
                    password,
                    referral: referral ? referral : '',
                };
                yield TemporarySignup_1.default
                    .findOneAndUpdate({ email }, fieldsToUpdate)
                    .exec();
                const user = yield TemporarySignup_1.default
                    .findOne({ email })
                    .exec();
                const finalUser = new User_1.default({
                    email:
                        user === null || user === void 0 ? void 0 : user.email,
                    firstName:
                        user === null || user === void 0
                            ? void 0
                            : user.firstName,
                    lastName:
                        user === null || user === void 0
                            ? void 0
                            : user.lastName,
                    phone:
                        user === null || user === void 0 ? void 0 : user.phone,
                    password:
                        user === null || user === void 0
                            ? void 0
                            : user.password,
                    referral:
                        user === null || user === void 0
                            ? void 0
                            : user.referral,
                    activated:
                        user === null || user === void 0
                            ? void 0
                            : user.activated,
                    activationToken:
                        user === null || user === void 0
                            ? void 0
                            : user.activationToken,
                });
                yield finalUser.save();
                // prepare user wallet
                yield this.prepareUserWallet(finalUser._id.toString());
                yield TemporarySignup_1.default.deleteOne({ email }).exec();
                return res.status(201).json({
                    status: 'success',
                    message: 'Account successfully created',
                    code: 200,
                });
            } catch (err) {
                console.log(err.message);
                return res.status(500).json({
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                });
            }
        });
    }
    // send email to this endpoint
    saveLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const location = req.body.location;
                const email = req.body.email;
                if (!email) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'User not found',
                        code: 400,
                    });
                }
                if (!location) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Location is required',
                        code: 400,
                    });
                }
                const user = yield User_1.default.findOneAndUpdate(
                    { email },
                    { email, location },
                );
                return res.status(200).json({
                    status: 'success',
                    message: 'Location successfully saved',
                    code: 200,
                });
            } catch (err) {
                console.log(err.message);
                return res.status(500).json({
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                });
            }
        });
    }
    validateCard(expiryDate) {
        return __awaiter(this, void 0, void 0, function* () {
            let expiry_month = parseInt(expiryDate.split('/')[0]);
            let expiry_year = parseInt(expiryDate.split('/')[1]);
            let current_month = (0, moment_1.default)().month();
            let current_year = parseInt(
                (0, moment_1.default)().year().toString().substring(2),
            );
            if (current_year > expiry_year || current_month > expiry_month) {
                return false;
            }
            return true;
        });
    }
    signJWTToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign(
                { userId },
                config_1.default.get('JWT_SECRET'),
                {
                    expiresIn: config_1.default.get('JWT_EXPIRES_IN'),
                },
            );
        });
    }
    prepareUserWallet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Preparing user wallet -----------------');
                return yield Wallet_1.default.create({ user: userId });
            } catch (err) {
                console.log('Error creating user wallet');
                throw new Error('Error creating user wallet');
            }
        });
    }
    // send email to this endpoint
    saveCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const card_number = req.body.cardNumber;
                let expiry = req.body.expiry;
                const cvv = req.body.cvv;
                const email = req.body.email;
                const user = yield User_1.default.findOne({ email }).exec();
                if (!user) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'User not found',
                        code: 400,
                    });
                }
                const findCard = yield Card_1.default
                    .findOne({
                        cardNumber: card_number,
                    })
                    .exec();
                if (findCard) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Card already exist',
                        code: 400,
                    });
                }
                // validate card
                const isCardValid = yield this.validateCard(expiry);
                if (!isCardValid) {
                    return res.status(200).json({
                        status: 'error',
                        message: 'Invalid or expired card',
                        code: 200,
                    });
                }
                const card = new Card_1.default({
                    user: user._id,
                    cardNumber: card_number,
                    expiry,
                    cvv,
                });
                yield card.save();
                const token = yield this.signJWTToken(user._id);
                return res.status(200).json({
                    status: 'success',
                    message: 'Account successfully completed',
                    token,
                    code: 200,
                });
            } catch (err) {
                console.log(err.message);
                return res.status(500).json({
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                });
            }
        });
    }
    // send email to this endpoint
    resendToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const user = yield User_1.default.findOne({ email }).exec();
                if (!user) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'User not found',
                        code: 400,
                    });
                }
                const otp = yield this.generateOTP();
                console.log('O-T-P: ', otp);
                yield (0, signupOTP_1.sendBasicSignupOTPEmail)(email, otp);
                const hashedOTP = crypto_1.default
                    .createHash('sha256')
                    .update(otp)
                    .digest('hex');
                yield User_1.default.findOneAndUpdate(
                    { email },
                    { email, activationToken: hashedOTP },
                );
                yield OTP_1.default
                    .findOneAndUpdate(
                        { email },
                        {
                            email,
                            otpCode: hashedOTP,
                            expiry: (0, moment_1.default)().add('5', 'minutes'),
                            used: false,
                        },
                        { new: true, upsert: true, setDefaultsOnInsert: true },
                    )
                    .exec();
                return res.status(200).json({
                    status: 'success',
                    message: 'Token successfully resent.',
                    code: 200,
                });
            } catch (err) {
                console.log(err.message);
                return res.status(500).json({
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                if (!email) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Email is required',
                        code: 400,
                    });
                }
                const user = yield User_1.default.findOne({ email }).exec();
                if (!user) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'User not found',
                        code: 400,
                    });
                }
                const otp = yield this.generateOTP();
                console.log('O-T-P: ', otp);
                yield (0,
                resetPassword_1.sendResetPasswordOTPEmail)(email, otp, user.firstName);
                const hashedOTP = crypto_1.default
                    .createHash('sha256')
                    .update(otp)
                    .digest('hex');
                yield User_1.default.findOneAndUpdate(
                    { email },
                    { email, activationToken: hashedOTP },
                );
                yield OTP_1.default
                    .findOneAndUpdate(
                        { email },
                        {
                            email,
                            otpCode: hashedOTP,
                            expiry: (0, moment_1.default)().add('5', 'minutes'),
                            used: false,
                        },
                        { new: true, upsert: true, setDefaultsOnInsert: true },
                    )
                    .exec();
                return res.status(200).json({
                    status: 'success',
                    message: `A reset code has been sent to ${email}`,
                });
            } catch (err) {
                console.log(err.message);
                return res.status(500).json({
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.body.token;
                const password = req.body.password;
                // const confirmPassword: string = req.body.confirmPassword;
                // compare token
                const hashedToken = crypto_1.default
                    .createHash('sha256')
                    .update(token)
                    .digest('hex');
                // check if token is there.
                const tokenExist = yield OTP_1.default
                    .findOne({
                        otpCode: hashedToken,
                        used: false,
                    })
                    .exec();
                if (!tokenExist) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Token not found',
                        code: 400,
                    });
                }
                // check if token not yet expired
                const now = (0, moment_1.default)(Date.now());
                const sent = (0, moment_1.default)(tokenExist.expiry);
                const duration = moment_1.default.duration(now.diff(sent));
                const mins = duration.asMinutes();
                if (mins > 60) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Invalid or expired token',
                        code: 400,
                    });
                }
                // hash new password
                const hashedPassword = yield this.hashPassword(password);
                yield User_1.default
                    .findOneAndUpdate(
                        { email: tokenExist.email },
                        { email: tokenExist.email, password: hashedPassword },
                    )
                    .exec();
                yield OTP_1.default
                    .findOneAndUpdate(
                        { email: tokenExist.email, used: false },
                        { email: tokenExist.email, used: true },
                    )
                    .exec();
                // const user: IUser | null = await User.findOne({
                //     email: tokenExist.email,
                // }).exec();
                // send password reset success mail-----------------------------
                // await sendResetPasswordSuccessEmail(user?.email, user?.firstName);
                return res.status(200).json({
                    status: 'success',
                    message: 'Password successfully reset',
                    code: 200,
                });
            } catch (err) {
                console.log(err.message);
                return res.status(500).json({
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                });
            }
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.hash(
                password,
                parseInt(config_1.default.get('PASSWORD_SALT')),
            );
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const password = req.body.password;
                const user = yield User_1.default.findOne({ email }).exec();
                if (!user) {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Invalid email',
                        code: 401,
                    });
                }
                if (!(yield user.comparePasswordMatch(password))) {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Invalid password',
                        code: 401,
                    });
                }
                if (!user.isUserAuthorized('user')) {
                    return res.status(401).json({
                        status: 'error',
                        message: 'User is not authorized for this resource',
                        code: 401,
                    });
                }
                if (user.isDeleted) {
                    return res.status(401).json({
                        status: 'error',
                        message: 'User does not exists',
                        code: 401,
                    });
                }
                if (user.isLocked) {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Account is temporarily locked',
                        code: 401,
                    });
                }
                if (!user.activated) {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Account is not activated',
                        code: 401,
                    });
                }
                const token = yield this.signJWTToken(user._id);
                return res.status(200).json({
                    status: 'success',
                    message: 'Login successful',
                    data: { token },
                    code: 200,
                });
            } catch (err) {
                console.log(err.message);
                return res.status(500).json({
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                });
            }
        });
    }
}
exports.AuthService = AuthService;
