import jwt from 'jsonwebtoken';

export default function(req, res, next) {
	let token = req.get('x-apollo-token');
	
	if (token === undefined) {
		res.status(400).end();

		return;
	}

	let payload = jwt.decode(token);

	if (!payload) {
		res.status(401).end();

		return;
	}

	next();
}