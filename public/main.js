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
					<a class="btn btn-default" v-on:click="presence('fourseq')" v-bind:class="{active: filters.fourseq}">4-seq</a>
					<a class="btn btn-default" v-on:click="presence('threeplusone')" v-bind:class="{active: filters.threeplusone}">3 + 1</a>
					<a class="btn btn-default">2 + 2</a>
				</div>
				
			</div>
			<div class="col-lg-4 text-right">
				{{ stats.occurrence }} / {{ stats.total }} - {{ stats.ratio * 100 + ' %' }}
			</div>
		</div>
	`,
    props: ['stats', 'filters'],
    methods: {
        presence: function(filter) {
            this.$emit('presence', {toggle: filter});
        },
        retrieve: function() {
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
					v-on:presence="presence" 
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
        	let rfs = [];

            if (this.filters.fourseq) {
                rfs.push('presence4seq');
            }

            if (this.filters.threeplusone) {
            	rfs.push('presence31');
            }

            return this.applyResultFilters(rfs);
        }
    },
    mounted: function() {
        this.retrieveResults();
    },
    methods: {
        retrieveResults: function() {
            let _this = this;

            axios.get('/reception').then(function(response) {
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
        applyResultFilters(rfs) {
        	let stats = {
        		occurrence: 0,
        		total: this.results.length,
        		ratio: 0
        	};

            for (let index in this.results) {
            	let result = this.results[index];
                let numbers = result.number;

                result.highlight = false;

                for (let rf of rfs) {
                	if (this[rf](result.number)) {
                		stats.occurrence++;
                		result.highlight = true;
                	}
                }
            }

            stats.ratio = stats.occurrence / stats.total;

            return stats;
        },
        presence: function(filter) {
        	this.filters[filter.toggle] = !this.filters[filter.toggle];
        },
    	presence4seq: function(numbers) {
            for (let i = 0; i < numbers.length - 4; i++) {
            	if (this.assertTrue(numbers, i, i + 3)) {
            		return true;
            	}
            }

            return false;
    	},
    	presence31: function(numbers) {
            for (let i = 0; i < numbers.length - 4; i++) {
            	if ((numbers[i] && !numbers[i + 1] && this.assertTrue(numbers, i + 2, i + 4))
            		|| (this.assertTrue(numbers, i, i + 2) && !numbers[i + 3] && numbers[i + 4])
            	) {
            		return true;
            	}
            }

            return false;
    	},
    	assertTrue(numbers, low, high) {
    		let assertion = true;

    		for (let i = low; i <= high; i++) {
    			assertion = assertion && numbers[i];

    			if (!assertion) {
    				return false;
    			}
    		}

    		return true;
    	}
    }
});