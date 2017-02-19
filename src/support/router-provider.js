class RouterProvider
{
	constructor(router) {
		this.router = router;
	}

	mount(route) {
		this.mountTo = route;

		return this;
	}

	provide() {
		let router = this.router.route(this.mountTo);

		for (let key in this.controllerMapping) {
			router[key](this.controllerMapping[key])
		}

		return this.router;
	}
}

export default RouterProvider;