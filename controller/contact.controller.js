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
exports.ContactController = void 0;
const contact_service_1 = require('../service/contact.service');
class ContactController {
    contactUs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return new contact_service_1.ContactService().contactUs(
                    req,
                    res,
                );
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
exports.ContactController = ContactController;
