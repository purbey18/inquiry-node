import { NextFunction, Request, Response } from "express"
import { codes } from "./messages"
import { pick } from "lodash"
import response from "./response"
import Joi from "@hapi/joi"

export const validate = (schema) => (req: Request, res: Response, next: NextFunction) => {
	const validSchema = pick(schema, ['params', 'query', 'body'])
	const object = pick(req, Object.keys(validSchema))
	const { value, error } = Joi.compile(validSchema)
		.allow('')
		.prefs({ errors: { label: 'key' } })
		.validate(object)

	if (error) {
		const errorMessage = error.details
			.map((details) => details.message)
			.join(',')
			.replace(/['"]+/g, '')

		return res.send(response.error_response(codes.error.badRequest, errorMessage))
	}
	Object.assign(req, value)
	return next()
}

