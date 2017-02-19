import BaseRouterProvider from './../support/router-provider';

class RouterProvider extends BaseRouterProvider
{
	controller(web) {
		this.controllerMapping = {
			get: web.getHealth
		};

		return this;
	}
}

export default RouterProvider;