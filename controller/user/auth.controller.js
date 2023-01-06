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
Object.defineProperty(exports, '__esModule', { value: true });
exports.AuthController = void 0;
const auth_service_1 = require('../../service/user/auth.service');
class AuthController {
    saveBasicRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return new auth_service_1.AuthService().saveBasicRegistration(
                    req,
                    res,
                );
            } catch (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                });
            }
        });
    }
    activateBasicRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return new auth_service_1.AuthService().activateBasicRegistration(
                    req,
                    res,
                );
            } catch (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                });
            }
        });
    }
    completeSignupProcess(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return new auth_service_1.AuthService().completeSignupProcess(
                    req,
                    res,
                );
            } catch (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                });
            }
        });
    }
    saveLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return new auth_service_1.AuthService().saveLocation(req, res);
            } catch (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                });
            }
        });
    }
    saveCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return new auth_service_1.AuthService().saveCard(req, res);
            } catch (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                });
            }
        });
    }
    resendToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return new auth_service_1.AuthService().resendToken(req, res);
            } catch (err) {
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
                return new auth_service_1.AuthService().resetPassword(req, res);
            } catch (err) {
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
                return new auth_service_1.AuthService().forgotPassword(
                    req,
                    res,
                );
            } catch (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return new auth_service_1.AuthService().login(req, res);
            } catch (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'an error occured',
                    code: 500,
                });
            }
        });
    }
}
exports.AuthController = AuthController;
