// /src/reception/controller.js

class Controller
{
	static getReceived(req, res, next)
	{
		res.json({
			health: 'OK',
			timestamps: Date.now(),
			req: req
		});
	}
}

export default Controller;
