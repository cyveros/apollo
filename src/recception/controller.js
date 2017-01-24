// /src/reception/controller.js

class Controller
{
	static postReceived(req, res, next)
	{
		res.json({
			status: 'OK',
			timestamps: Date.now(),
			req: req.params
		});
	}
}

export default Controller;
