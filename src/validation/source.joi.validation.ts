import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

export const addSource = {
    body: Joi.object().keys({
		sourceName: Joi.string().label('Source Name').required(),
        status:Joi.number()
	})
}
export const updateSource = {
	body : Joi.object().keys({
		id : Joi.objectId().required(),
		sourceName: Joi.string().label('Source Name').allow(''),
        status:Joi.number()
	})
}
export const deleteSource = {
	body : Joi.object().keys({
		id : Joi.objectId().required(),
	})
}
export const changeSourceStatus = {
	body : Joi.object().keys({
		id : Joi.objectId().required(),
		status : Joi.number().label('Status').required().min(0).max(1)
	})
}