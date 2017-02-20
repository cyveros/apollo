// support/router-provider.js
//
class RouterProvider
{
	constructor(router) {
		this.router = router;
		this.mountPoint = '/';
		this.controllerMap = new Map();
		this.modelMap = new Map();
	}

	model(name, clazz) {
		if (!this.modelMap.has(name)) {
			this.modelMap.set(name, clazz);
		}

		return this;
	}

	register(method, cb) {
		this.controllerMap.set(method, cb);

		return this;
	}

	mount(route) {
		this.mountPoint = route;

		return this;
	}

	provide() {
		let router = this.router.route(this.mountPoint);

		// link controller
		for (let [method, {controller, action}] of this.controllerMap) {
			controller.application(this.app);
			router[method](controller[action].bind(controller));
		}

		// link model
		for (let [name, clazz] of this.modelMap) {
			if (!this.app.get(name)) {
				this.app.set(name, clazz);
			}
		}


		return this.router;
	}

	application(app) {
		this.app = app;

		return this;
	}
}

export default RouterProvider;
