export default function(req, res, next) {
	req.protagonist = {name: 'wti'};

	next();
}