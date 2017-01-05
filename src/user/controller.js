// /src/user/controller.js
import User from './models/user';
import HTTPStatus from 'http-status';

class Controller
{
	static getUser(req, res, next)
	{
		User.all().then(function(users){
			res.json(users);
		});
	}

	static createUser(req, res, next)
	{
		User.findOne({
			email: req.body.email 
		}).then(function(existed){
			if (existed) {
				return next(new Error('User existed with email ' + existed.email, HTTPStatus.CONFLICT));
			}

			let newUser = new User({
				email: req.body.email,
				password: req.body.password
			});

			newUser.save(function(err, user){
				if (err) {
					return next(err);
				}

				res.json({
					email: user.email,
					createdAt: user.createdAt
				});
			});
		});
	}

	static updateUser(req, res, next)
	{
		res.render('auth/index', { title: 'Express auth post' });
	}

	static deleteUser(req, res, next)
	{
		res.render('auth/index', { title: 'Express auth post' });
	}
}

export default Controller;
