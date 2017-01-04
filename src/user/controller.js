// /src/user/controller.js

class Controller
{
	static getUser(req, res, next)
	{
		res.json(req.user);
		
	}

	static createUser(req, res, next)
	{
		res.render('auth/index', { title: 'Express auth post' });
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
