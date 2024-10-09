import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

export const addCategory = {
    body: Joi.object().keys({
        categoryName: Joi.string().required()
    })
}

export const deleteCategory = {
    body: Joi.object().keys({
        categoryId: Joi.string().required()
    })
}