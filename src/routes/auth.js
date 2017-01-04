import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('auth/index', { title: 'Express auth' });
});

router.post('/', function(req, res, next) {
	res.json(req.protagonist);
	// console.log(req.user);

	// res.render('auth/index', { title: 'Express auth post' +  });
});

export default router;
