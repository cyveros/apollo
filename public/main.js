
Vue.component('ResultHeader', {
	template: `
		<thead>
			<tr>
				<td></td>
				<td><span v-for="(caption, index) in header" v-bind:title="index">&nbsp;{{ index % 5 == 0 ? '■' : '□' }}</span></td>
			</tr>
		</thead>
	`,
	props: ['header']
});

Vue.component('ResultBody', {
	template: `
		<tbody>
			<tr v-for="result in results" v-bind:class="{'bg-warning': result.highlight}">
				<td><small>{{ result.date }}</small></td>
				<td><span v-for="(num, index) in result.number" v-bind:class="{'text-muted': !num}" v-bind:title="index + 1">&nbsp;{{ num ? '■' : '□' }}</span></td>
			</tr>
		</tbody>
	`,
	props: ['results']
});

Vue.component('ResultStatsButton', {
	template: `
		<div class="row">
			<div class="col-lg-4">
				<div class="btn-group btn-group-xs" role="group">
					<button class="btn btn-default" v-on:click="retrieve"><i class="glyphicon glyphicon-refresh"></i></button>
				</div>
			</div>
			<div class="col-lg-4">
				<div class="btn-group btn-group-justified btn-group-xs" role="group">
					<a class="btn btn-default" v-on:click="compute4seq" v-bind:class="{active: filters.fourseq}">4-seq</a>
					<a class="btn btn-default">3 + 1</a>
					<a class="btn btn-default">2 + 2</a>
				</div>
				
			</div>
			<div class="col-lg-4 text-right">
				{{ stats * 100 + ' %' }}
			</div>
		</div>
	`,
	props: ['stats', 'filters'],
	data: function() {
		return {
			buttonid: 0
		};
	},
	methods: {
		compute4seq: function() {
			this.buttonid = 1;
			this.$emit('compute4seq');
		},
		retrieve: function() {
			this.buttonid = 0;
			this.$emit('retrieve');
		}
	}
});

const app = new Vue({
	el: '#banco',
	template: `
	<div>
		<div class="panel">
			<div class="panel-heading">
				<ResultStatsButton 
					v-bind:stats="stats" 
					v-bind:filters="filters" 
					v-on:compute4seq="filters.fourseq = true;" 
					v-on:retrieve="buttonid = 0;retrieveResults();">
				</ResultStatsButton>
			</div>
			<div class="panel-body">
				<table class="table table-condensed table-hover">
					<ResultHeader v-bind:header="header"></ResultHeader>
					<ResultBody v-bind:results="results"></ResultBody>
				</table>
			</div>
		</div>
	</div>
	`,
	data: {
		results: [],
		buttonid: 0,
		filters: {
			fourseq: false,
			threeplusone: false,
			twoplustwo: false
		}
	},
	computed: {
		header: function() {
			return this.emptyArray(70, false);
		},
		stats: function() {
			if (this.filters.fourseq) {
				return this.count4seq();
			}

			return 0;
		}
	},
	mounted: function() {
		this.retrieveResults();
	},
	methods: {
		retrieveResults: function() {
			let _this = this;

			axios.get('/reception').then(function(response){
				_this.results = _this.processResults(response.data);
			});
		},
		processResults: function(results) {

			for (let index in results) {
				let numbers = this.emptyArray(70, false);

				for (let number of results[index].number) {
					numbers[number - 1] = true;
				}

				results[index].number = numbers;
				results[index].highlight = false;
			} 

			return results;
		},
		emptyArray: function(size, fill) {
			let numbers = [];

			for (let i = 1; i <= size; i++) {
				numbers[i] = fill;
			}

			return numbers;

		},
		count4seq: function() {
			let total = this.results.length;
			let occurrence = 0;

			for (let index in this.results) {
				let numbers = this.results[index].number;
				let flag = 0;

				for (let i = 0; i < numbers.length; i++) {
					if (!numbers[i]) {
						flag = 0;

						continue;
					}

					++flag;

					if (flag == 4) {
						occurrence++;
						this.results[index].highlight = true;
					}
				}
			}

			return occurrence / total;
		}
	}
});