import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

export const addReminder = {
	body: Joi.object().keys({
		inquiryId: Joi.objectId().allow(''),
		title: Joi.string().label('Title').required(),
		date: Joi.string(),
		time: Joi.string(),
		description: Joi.string().label('Description').required(),
		status: Joi.number()
	})
}
export const updateReminder = {
	body: Joi.object().keys({
		id: Joi.objectId().required(),
		title: Joi.string().label('Title').allow(''),
		time: Joi.string(),
		date: Joi.string().label('Date').required(),
		description: Joi.string().label('Description').allow(''),
	})
}
export const deleteReminder = {
	body: Joi.object().keys({
		id: Joi.objectId().required(),
	})
}
export const changeReminderStatus = {
	body: Joi.object().keys({
		id: Joi.objectId().required(),
		status: Joi.number().label('Status').required().min(0).max(1)
	})
}