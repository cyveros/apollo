// /src/health/controller.js

class Controller
{
	static getHealth(req, res, next)
	{
		res.json({
			health: 'OK'
		});
	}
}

export default Controller;
