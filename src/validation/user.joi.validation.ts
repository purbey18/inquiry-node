import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

export const login = {
	body: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().trim().min(6).required(),
	}),
};

export const mobileLogin = {
	body: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().trim().min(6).required(),
		device_token: Joi.string().required().allow(""),
	}),
};

export const register = {
	body: Joi.object().keys({
		full_name: Joi.string().label('Name').min(3).max(30).required().pattern(/^[a-zA-Z0-9, ]*$/)
			.messages({
				'string.pattern.base':
					'{{#label}} is only allowed to alphabet characters'
			}),
		about: Joi.string().allow(''),
		email: Joi.string().label('Email').email().required(),
		position_id: Joi.number().min(1).max(3).required(),
		password: Joi.string().label('Password').min(6).required(),
		confirmPassword: Joi.string().label('Confirm password').min(5).required(),
		status: Joi.number().label('Status').min(0).max(1),
		remark: Joi.string().allow(''),
	})
}

export const editProfile = {
	body: Joi.object().keys({
		full_name: Joi.string().label('Name').min(3).max(30).required().pattern(/^[a-zA-Z0-9, ]*$/)
			.messages({
				'string.pattern.base':
					'{{#label}} is only allowed to alphabet characters'
			}),
		status: Joi.number().label('Status').required().min(0).max(1),
		about: Joi.string().allow(''),
		email: Joi.string().label('Email').email().required(),
		remark: Joi.string().allow(''),
		password: Joi.string().label('Password').min(6),
		confirmPassword: Joi.string().label('Confirm Password').min(6),
	})
}

export const adminEditProfile = {
	body: Joi.object().keys({
		id: Joi.objectId().required(),
		full_name: Joi.string().label('Name').min(3).max(30).pattern(/^[a-zA-Z0-9, ]*$/)
			.messages({
				'string.pattern.base':
					'{{#label}} is only allowed to alphabet characters'
			}),
		password: Joi.string().label('Password').min(6),
		confirmPassword: Joi.string().label('Confirm password').min(5),
		position_id: Joi.number().min(1).max(3),
		status: Joi.number().label('Status').min(0).max(1),
		about: Joi.string().allow(''),
		email: Joi.string().label('Email').email(),
		remark: Joi.string().allow(''),
	})
}
