// support/router-provider.js
//
class RouterProvider
{
	constructor(router) {
		this.router = router;
		this.mountPoint = '/';
		this.controllerMap = new Map();
	}

	name(name) {
		this.name = name;
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
		let app = this.app;

		for (let [method, {controller, action}] of this.controllerMap) {
			controller.application(this.app);
			router[method](controller[action]);
		}

		return this.router;
	}

	application(app) {
		this.app = app;

		return this;
	}
}

export default RouterProvider;
