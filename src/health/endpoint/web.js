// /src/health/endpoint/web.js
//
import Controller from './../../support/controller';

class Web extends Controller
{
	getHealth(req, res, next)
	{
		// res.json({
		// 	health: 'OK',
		// 	timestamps: Date.now()
		// });

		res.render('index');
	}
}

export default Web;
