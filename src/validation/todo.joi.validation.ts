import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

export const addTodo = {
	body: Joi.object().keys({
		title: Joi.string().label('Title').required(),
		date: Joi.string().label('Date').required(),
	})
}
export const updateToDo = {
	body: Joi.object().keys({
		id: Joi.objectId().required(),
		title: Joi.string().label('Title'),
		date: Joi.string().label('Date'),
	})
}
export const deleteTodo = {
	body: Joi.object().keys({
		id: Joi.objectId().required(),
	})
}
export const changeTodoStatus = {
	body: Joi.object().keys({
		id: Joi.objectId().required(),
		status: Joi.number().label('Status').required().min(0).max(1)
	})
}