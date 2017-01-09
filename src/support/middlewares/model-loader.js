export default function(name, factory) {

	return function(req, res, next) {
		if (req.app.get(name) !== undefined) {
			return next();
		}

		let db = req.app.get('db');
		let mf = new factory(db);
		const m = db.define(mf.getEntityName(), mf.getDefinition(), mf.getOptions());

		req.app.set(name, m);

		next();
	};
	
}