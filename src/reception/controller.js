// /src/reception/controller.js

class Controller
{
	static postReceived(req, res, next)
	{
		console.log(req.body);

		res.json({
			status: 'OK',
			timestamps: Date.now(),
			req: req.body
		});
	}
}

export default Controller;
