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
			<div class="col-md-3">
				<div class="btn-group btn-group-xs" role="group">
					<button class="btn btn-default" v-on:click="retrieve"><i class="glyphicon glyphicon-refresh"></i></button>
				</div>
			</div>
			<div class="col-md-5">
				<div class="btn-group btn-group-justified btn-group-xs" role="group">
					<a class="btn btn-default" title="5, 6, 7, 8" v-on:click="presence('fourseq')" v-bind:class="{active: filters.fourseq}">4-Seq</a>
					<a class="btn btn-default" title="5, 6, 7,[jump,] 9" v-on:click="presence('threeplusone')" v-bind:class="{active: filters.threeplusone}">3 N 1</a>
					<a class="btn btn-default" title="5, 6,[jump,] 8, 9" v-on:click="presence('twoplustwo')" v-bind:class="{active: filters.twoplustwo}">2 N 2</a>
					<a class="btn btn-default" title="5, 7, 9,[jump,] 12" v-on:click="presence('threescatterplusone')" v-bind:class="{active: filters.threescatterplusone}">3S N 1</a>
				</div>
			</div>
			<div class="col-md-2">
				<div class="btn-group btn-group-xs" role="group">
					<a class="btn btn-default" v-on:click="alterJump('+')"><i class="glyphicon glyphicon-plus-sign"></i></a>
					<a class="btn btn-default" disabled>Jump: {{ jump }}</a>
					<a class="btn btn-default" v-on:click="alterJump('-')"><i class="glyphicon glyphicon-minus-sign"></i></a>
					<a class="btn btn-default" v-on:click="alterJump('reset')">reset</a>
				</div>
			</div>
			<div class="col-md-2 text-right">
				{{ stats.occurrence }} / {{ stats.total }} - {{ (stats.ratio * 100).toFixed(2) + ' %' }}
			</div>
		</div>
	`,
    props: ['stats', 'filters', 'jump'],
    methods: {
        presence: function(filter) {
            this.$emit('presence', {toggle: filter});
        },
        alterJump: function(action) {
        	this.$emit('jump', {value: (action == 'reset' ? 1 : action)});
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
					v-bind:jump="jump"
					v-on:presence="presence" 
					v-on:jump="alterJump"
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
            twoplustwo: false,
            threescatterplusone: false
        },
        jump: 1
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

            if (this.filters.twoplustwo) {
            	rfs.push('presence22');
            }

            if (this.filters.threescatterplusone) {
            	rfs.push('presence3scatter1');
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
        alterJump: function(change) {
			if (change.value == 1) {
				this.jump = 1;

				return;
			} 

        	if ((this.jump += (change.value == '+' ? 1 : -1)) < 0) {
        		this.jump = 0;
        	}
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
            for (let i = 0; i < numbers.length - 3 - this.jump; i++) {
            	if ((numbers[i] && this.assertTrue(numbers, i + 1 + this.jump, i + 3 + this.jump))
            		|| (this.assertTrue(numbers, i, i + 2) && numbers[i + 3 + this.jump])
            	) {
            		return true;
            	}
            }

            return false;
    	},
    	presence22: function(numbers) {
            for (let i = 0; i < numbers.length - 3 - this.jump; i++) {
            	if (this.assertTrue(numbers, i, i + 1) && this.assertTrue(numbers, i + 2 + this.jump, i + 3 + this.jump)) {
            		return true;
            	}
            }

            return false;
    	},
    	presence3scatter1: function(numbers) {
    		for (let i = 0; i < numbers.length - 6 - this.jump; i++) {
            	if (numbers[i] && numbers[i + 2] && numbers[i + 4] && numbers[i + 6 + this.jump]) {
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