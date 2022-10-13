import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export class ContactPolicy {
    async validateContactForm(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            name: Joi.string().required().trim().messages({
                'string.required': 'name is required',
                'string.empty': 'name cannot be empty',
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
            subject: Joi.string().required().trim().messages({
                'string.required': 'subject is required',
                'string.empty': 'subject cannot be empty',
            }),
            message: Joi.string().required().trim().messages({
                'string.required': 'message is required',
                'string.empty': 'message cannot be empty',
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
