// /src/auth/controller.js

class Controller
{
	static getAuth(req, res, next)
	{
		res.render('auth/index', { title: 'Express auth' });
	}

	static postAuth(req, res, next)
	{
		res.render('auth/index', { title: 'Express auth post' });
	}
}

export default Controller;
