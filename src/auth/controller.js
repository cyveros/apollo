// /src/auth/controller.js
import jwt from 'jsonwebtoken';
import HTTPStatus from 'http-status';
import argon2 from 'argon2';
import config from '../config';
import AppErrorHandle from '../support/app-error';

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
		let Users = req.app.get('user.model.users');

		Users.findOne({
			where: {
				email: req.body.email
			}
		}).then(user => {
			if (user === null) {
				return next(AppErrorHandle('blablabl', HTTPStatus.UNAUTHORIZED));
			}

			argon2.verify(user.password, req.body.password).then(match => {
				if (match) {
					const token = jwt.sign({
						email: req.body.email
					}, config.jwtSecret);

					res.json({token, username: user.username});
				} else {
					next(AppErrorHandle('Authentication failed', HTTPStatus.UNAUTHORIZED));
				}
			}).catch(err => {
				next(err);
			});
		}).catch(err => {
			next(err);
		});
	}
}

export default Controller;
