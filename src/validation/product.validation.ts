import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

export const addProduct = {
    body: Joi.object().keys({
        categoryId: Joi.objectId(),
        perUnitPrice: Joi.number().allow(''),
        productName: Joi.string().label('Product Name').required(),
        attachPhotos: Joi.array().items(Joi.string()),
        units: Joi.number().allow('')
    })
}

export const updateProduct = {
    body: Joi.object().keys({
        categoryId: Joi.objectId(),
        perUnitPrice: Joi.number().allow(''),
        productName: Joi.string().label('Product Name').required(),
        attachPhotos: Joi.array().items(Joi.string()),
        units: Joi.number().allow(''),
        oldImg: Joi.string(),
        productId: Joi.objectId().required()
    })
}

export const addOrDeleteProductImage = {
    body: Joi.object().keys({
        attachPhotos: Joi.array().items(Joi.string()),
        oldImg: Joi.string(),
        productId: Joi.objectId().required()
    })
}
