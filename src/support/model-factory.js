// support/model.js
//

class ModelFactory
{
	constructor(db) {
		this.db = db;
	}

	exportModel(name, definition, option) {
		return this.db.define(name, definition, option);
	}
}