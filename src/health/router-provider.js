// health/router-provider.js
//
import BaseRouterProvider from './../support/router-provider';

class RouterProvider extends BaseRouterProvider
{
	controller(web) {
		this.register('get', {controller: web, action: 'getHealth'});

		return this;
	}
}

export default RouterProvider;