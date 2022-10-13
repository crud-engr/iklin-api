import { Router, Request, Response } from 'express';
import { ContactController } from '../controller/contact.controller';
import { ContactPolicy } from '../policy/contact.policy';

const router = Router();

router
    .route('')
    .post(
        [new ContactPolicy().validateContactForm],
        new ContactController().contactUs,
    );

export default router;
