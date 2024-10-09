import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

export const addRequirement = {
	body: Joi.object().keys({
		requirement: Joi.string().label('Requirement').required(),
		units: Joi.string(),
		perUnitPrice: Joi.number().allow(''),
	})
}
export const updateRequirement = {
	body: Joi.object().keys({
		id: Joi.objectId().required(),
		requirement: Joi.string().label('Requirement'),
		units: Joi.string(),
		perUnitPrice: Joi.number().allow(''),
	})
}
export const deleteRequirement = {
	body: Joi.object().keys({
		id: Joi.objectId().required(),
	})
}
export const changeRequirementStatus = {
	body: Joi.object().keys({
		id: Joi.objectId().required(),
		status: Joi.number().label('Status').required().min(0).max(1)
	})
}