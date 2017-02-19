// health/endpoint/provider.js
//
import { Router } from 'express';
import RouterProvider from './router-provider';
import Web from './endpoint/web';


const rp = new RouterProvider(Router());

rp.mount('/');
rp.controller(new Web());

export default rp;
