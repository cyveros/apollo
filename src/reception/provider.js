// reception/endpoint/provider.js
//
import { Router } from 'express';
import RouterProvider from './router-provider';
import Web from './endpoint/web';
import Result from './model/result';

const rp = new RouterProvider(Router());

rp.mount('/reception');
rp.controller(new Web());
rp.model('model.factory.result', Result);

export default rp;
