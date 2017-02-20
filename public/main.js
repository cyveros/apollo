
Vue.component('ResultHeader', {
	template: `
		<thead>
			<tr>
				<th v-for="caption in header">{{ caption }}</th>
			</tr>
		</thead>
	`,
	props: ['header']
});

Vue.component('ResultBody', {
	template: `
		<tbody>
			<tr v-for="result in results">
				<td><small>{{ result.date }}</small></td>
				<td v-for="num in result.number">{{ num }}</td>
			</tr>
		</tbody>
	`,
	props: ['results']
});

Vue.component('ResultStatsButton', {
	template: `
		<div class="col-md-4 col-md-offset-4">
			<div class="btn-group" role="group">
				<button class="btn btn-default" v-on:click="compute4seq">4-seq</button>
				<button class="btn btn-default">3 plus 1</button>
				<button class="btn btn-default">2 plus 2</button>
			</div>
			{{ stats }}
		</div>
	`,
	props: ['stats'],
	data: function() {
		return {
			buttonid: 0
		};
	},
	methods: {
		compute4seq: function() {
			this.buttonid = 1;
			this.$emit('compute4seq');
		}
	}
});

const app = new Vue({
	el: '#banco',
	template: `
		<div class="table-responsive">
			<ResultStatsButton v-bind:stats="stats" v-on:compute4seq="buttonid = 1;"></ResultStatsButton>
			<table class="table table-condensed">
				<ResultHeader v-bind:header="header"></ResultHeader>
				<ResultBody v-bind:results="results"></ResultBody>
			</table>
		</div>
	`,
	data: {
		results: [],
		buttonid: 0
	},
	computed: {
		header: function() {
			let hdr = [];

			hdr.push('');

			for (let i = 1; i <= 70; i++) {
				hdr.push(i);
			}

			return hdr;
		},
		stats: function() {
			if (this.buttonid != 1) {
				return 0;
			}

			return this.count4seq();
		}
	},
	mounted: function() {
		let _this = this;

		axios.get('/reception').then(function(response){
			_this.results = _this.processResults(response.data);
		});
	},
	methods: {
		processResults: function(results) {

			for (let index in results) {
				let numbers = this.emptyArray(70);

				for (let number of results[index].number) {
					numbers[number - 1] = 'o';
				}

				results[index].number = numbers;
			} 

			return results;
		},
		emptyArray: function(size) {
			let numbers = [];

			for (let i = 1; i <= size; i++) {
				numbers[i] = '';
			}

			return numbers;

		},
		count4seq: function() {
			let total = this.results.length;
			let occurrence = 0;

			for (let result of this.results) {
				let numbers = result.number;
				let flag = 0;

				for (let i = 0; i < numbers.length; i++) {
					if (numbers[i] != 'o') {
						flag = 0;

						continue;
					}


					++flag;

					if (flag >= 4) {
						occurrence++;
					}
				}
			}

			return occurrence / total;
		}
	}
});