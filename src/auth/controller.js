// /src/auth/controller.js
import jwt from 'jsonwebtoken';
import HTTPStatus from 'http-status';
import config from '../config';

const user = {
	username: 'react',
	password: 'express'
};

class Controller
{
	static getAuth(req, res, next)
	{
		res.render('auth/index', { title: 'Express auth' });
	}

	static postAuth(req, res, next)
	{
		// if (let auth = false) {
		// 	return next(new Error('blablabl', HTTPStatus.UNAUTHORIZED));
		// }

		const token = jwt.sign({
			email: req.body.email
		}, config.jwtSecret);

		res.json({token, username: user.username});
	}
}

export default Controller;
