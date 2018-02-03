// /src/reception/endpoint/web.js
//
import Controller from './../../support/controller';
import request from 'request';
import cheerio from 'cheerio';

class Web extends Controller
{
	getReception(req, res, next)
	{
		let year = req.query.year || 2017;

		request('https://loteries.espacejeux.com/en/lotteries/banco?widget=resultats-anterieurs&noProduit=208&annee=' + year, function(err, response, body) {
			if (err) {
				return next(err);
			}

			let $ = cheerio.load(body);

			let $rows = $('tr:not(.titre)');

			let len = $rows.length;
			let index = 1;

			let banco = [];


			while (index < len) {
				let $row = $rows.eq(index);

				let nums = [];

				let $numbers = $row.find('.numerosGangnants span');

				let key = 0;

				while (key < $numbers.length) {
					nums.push(parseInt($numbers.eq(key).text()));

					key++;
				}


				banco.push({
					date: $row.find('.date').text(),
					number: nums
				});

				index++;

			}

			res.json(banco);
		});

		// const Result = this.factory('model.factory.result');

		// Result.findAll().then(function(results){
		// 	res.json({
		// 		health: 'OK',
		// 		timestamps: Date.now(),
		// 		yes: true,
		// 		results: results
		// 	});
		// }).catch(function(err){
		// 	next(err);
		// });
	}

	getResults(req, res, next) {
		request('http://diffusion.loto-quebec.com/sw3/res/asp/index.asp?l=1&pRequest=11&cProduit=6&pAnnee=2017', function(err, response, body) {
			if (err) {
				return next(err);
			}

			res.send(body);
		});
	}
}

export default Web;
