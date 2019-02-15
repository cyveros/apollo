// /src/user/controller.js
import User from './models/user';
import HTTPStatus from 'http-status';
import UserModel from './models/user.seq';
import Sequelize from 'sequelize';


class Controller {
    static getUser(req, res, next) {
    	let Users = req.app.get('user.model.users');

        Users.findAll({
        	attributes: ['id', 'email', 'createdAt', 'updatedAt']
        }).then(function(users) {
            res.json(users);
        });
    }

    static createUser(req, res, next) {
        let Users = req.app.get('user.model.users');

        Users.count({
            where: {
                email: req.body.email
            }
        }).then(function(result) {
            if (result > 0) {
                return next(new Error('User existed with email ' + req.body.email, HTTPStatus.CONFLICT));
            }
        });

        // User.findOne({
        // 	email: req.body.email 
        // }).then(function(existed){
        // 	if (existed) {
        // 		return next(new Error('User existed with email ' + existed.email, HTTPStatus.CONFLICT));
        // 	}

        // 	let newUser = new User({
        // 		email: req.body.email,
        // 		password: req.body.password
        // 	});

        // 	newUser.save(function(err, user){
        // 		if (err) {
        // 			return next(err);
        // 		}

        // 		res.json({
        // 			email: user.email,
        // 			createdAt: user.createdAt
        // 		});
        // 	});
        // });
    }

    static updateUser(req, res, next) {
        res.render('auth/index', {
            title: 'Express auth post'
        });
    }

    static deleteUser(req, res, next) {
        res.render('auth/index', {
            title: 'Express auth post'
        });
    }
}

export default Controller;