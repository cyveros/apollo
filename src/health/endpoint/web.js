// /src/health/endpoint/web.js

class Web
{
	static getHealth(req, res, next)
	{
		res.json({
			health: 'OK',
			timestamps: Date.now()
		});
	}
}

export default Web;
