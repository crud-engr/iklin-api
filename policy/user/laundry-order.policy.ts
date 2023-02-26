import { NextFunction, Request, Response } from 'express';
import * as Joi from 'joi';

export class OrderPolicy {
    async validateCreateLaundryOrder(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const schema = Joi.object({
            serviceType: Joi.string().required().trim().messages({
                'string.required': 'service type is required',
                'string.empty': 'service type cannot be empty',
            }),
            laundryType: Joi.string().required().trim().messages({
                'string.required': 'laundry type is required',
                'string.empty': 'laundry type cannot be empty',
            }),
            preferredLaundry: Joi.string().required().trim().messages({
                'string.required': 'preferred laundry is required',
                'string.empty': 'preferred laundry cannot be empty',
            }),
            basket: Joi.array().items(Joi.object()).required().messages({
                'array.required': 'basket is required',
                'array.empty': 'basket cannot be empty',
            }),
            pickupDate: Joi.date().required().messages({
                'date.required': 'pickup date is required',
                'date.empty': 'pickup date cannot be empty',
            }),
            deliveryDate: Joi.date().required().messages({
                'date.required': 'delivery date is required',
                'date.empty': 'delivery cannot be empty',
            }),
            laundryMode: Joi.string().required().trim().messages({
                'string.required': 'laundry mode is required',
                'string.empty': 'laundry mode cannot be empty',
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
