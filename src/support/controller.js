// support/controller.js

class Controller
{
	constructor() {
		this.modelMap = new Map();
	}

	application(app) {
		this.app = app;
	}

	factory(name) {
		const Model = this.app.get(name);

		let model = new Model(this.app.get('db'));

		return model.exportModel(model.name(), model.definition(), model.option());
	}
}

export default Controller;
