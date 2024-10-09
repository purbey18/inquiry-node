import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

export const addNotification = {
    body: Joi.object({
        title: Joi.string().label('title').required(),
        body: Joi.string().required(),
        type: Joi.string().valid('Advertisement', 'General').required(),
        data: Joi.object()
    }),
}
