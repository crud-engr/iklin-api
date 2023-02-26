import { NextFunction, Request, Response } from 'express';
import * as Joi from 'joi';
import PasswordComplexity from 'joi-password-complexity';

export class AuthPolicy {
    async validateBasicRegistration(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
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
            const value = await schema.validateAsync(req.body);
            next();
        } catch (err: any) {
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
    }

    async validateActivateBasicRegistration(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
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
            const value = await schema.validateAsync(req.body);
            next();
        } catch (err: any) {
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
    }

    async validateCompleteSignupProcess(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
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
            businessName: Joi.string().required().trim().messages({
                'string.required': 'business name is required',
                'string.empty': 'business name cannot be empty',
            }),
            businessAddress: Joi.string().required().trim().messages({
                'string.required': 'business address is required',
                'string.empty': 'business address cannot be empty',
            }),
            profession: Joi.string().required().trim().messages({
                'string.required': 'profession is required',
                'string.empty': 'profession cannot be empty',
            }),
            nin: Joi.string().required().trim().messages({
                'string.required': 'nin is required',
                'string.empty': 'nin cannot be empty',
            }),
            cac: Joi.string().required().trim().messages({
                'string.required': 'cac is required',
                'string.empty': 'cac cannot be empty',
            }),
            referral: Joi.optional().allow(),
            password: PasswordComplexity({
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
            const value = await schema.validateAsync(req.body);
            next();
        } catch (err: any) {
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
    }

    async validateResetPassword(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
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
            token: Joi.string().required().messages({
                'string.required': 'otp is required',
                'string.empty': 'otp cannot be empty',
            }),
            password: PasswordComplexity({
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
            const value = await schema.validateAsync(req.body);
            next();
        } catch (err: any) {
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
    }

    async validateLogin(req: Request, res: Response, next: NextFunction) {
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
            password: PasswordComplexity({
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
            const value = await schema.validateAsync(req.body);
            next();
        } catch (err: any) {
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
    }
}
