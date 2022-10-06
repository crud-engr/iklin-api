import { NextFunction, Request, Response } from 'express';
import * as Joi from 'joi';

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
}
