// /src/auth/middlewares/validation.js
import Joi from 'joi';

const rules = {
	auth: {
		body: {
			email: Joi.string().email().required(),
			password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
		}
	}
};

export default rules;