Vue.component('ResultHeader', {
    template: `
		<thead>
			<tr>
				<td></td>
				<td><span v-for="(value, index) in ruler" v-bind:title="index + 1">&nbsp;{{ (index + 1) % 5 == 0 ? '■' : '□' }}</span></td>
			</tr>
		</thead>
	`,
    props: ['size', 'fill'],
    computed: {
        ruler: function() {
            return Array(parseInt(this.size || 70)).fill(this.fill || false);
        }
    }
});

Vue.component('ResultBody', {
    template: `
		<tbody>
			<tr v-for="result in results" v-bind:class="{'bg-warning': result.highlight}">
				<td><small>{{ result.date }}</small></td>
				<td><span v-for="(num, index) in result.numbers" v-bind:class="{'text-muted': !num}" v-bind:title="index + 1">&nbsp;{{ num ? '■' : '□' }}</span></td>
			</tr>
		</tbody>
	`,
    props: ['results']
});

Vue.component('ResultStatsButton', {
    template: `
		<div class="row">
            <div class="col-sm-2">
                <span class="btn-group btn-group-xs" role="group">
                    <a class="btn btn-default" v-on:click="alter('year', 2016)" v-bind:class="{active: year == 2016}">2016</a>
                    <a class="btn btn-default" v-on:click="alter('year', 2017)" v-bind:class="{active: year == 2017}">2017</a>
                </span>
            </div>
			<div class="col-sm-7">
                <span class="btn-group btn-group-xs" role="group">
                    <a class="btn btn-default" v-on:click="alter('order', 'left')" v-bind:class="{active: order == 'left'}"><i class="glyphicon glyphicon-arrow-left"></i></a>
                    <a class="btn btn-default" v-on:click="alter('order', 'any')" v-bind:class="{active: order == 'any'}">both</a>
                    <a class="btn btn-default" v-on:click="alter('order', 'right')" v-bind:class="{active: order == 'right'}"><i class="glyphicon glyphicon-arrow-right"></i></a>
                </span>
                &nbsp;
				<span class="btn-group btn-group-xs" role="group">
					<a class="btn btn-default" title="5, 6, 7, 8" v-on:click="alter('presence', 'fourseq')" v-bind:class="{active: filters.fourseq}">4-Seq</a>
					<a class="btn btn-default" title="5, 6, 7,[jump,] 9" v-on:click="alter('presence', 'threeplusone')" v-bind:class="{active: filters.threeplusone}">3-Seq N 1</a>
					<a class="btn btn-default" title="5, 6,[jump,] 8, 9" v-on:click="alter('presence', 'twoplustwo')" v-bind:class="{active: filters.twoplustwo}">2-Seq N 2-Seq</a>
					<a class="btn btn-default" title="5, 7, 9,[jump,] 12" v-on:click="alter('presence', 'threescatterplusone')" v-bind:class="{active: filters.threescatterplusone}">3-JSeq N 1</a>
				</span>
                &nbsp;
                <span class="btn-group btn-group-xs" role="group">
                    <a class="btn btn-default" v-on:click="alter('jump', '+')"><i class="glyphicon glyphicon-plus-sign"></i></a>
                    <a class="btn btn-default" disabled>Jump: {{ jump }}</a>
                    <a class="btn btn-default" v-on:click="alter('jump', '-')"><i class="glyphicon glyphicon-minus-sign"></i></a>
                    <a class="btn btn-default" v-on:click="alter('jump', 'reset')">reset</a>
                </span>
			</div>
			<div class="col-sm-3 text-right">
				<span>{{ stats.occurrence }} / {{ stats.total }} - {{ (stats.ratio * 100).toFixed(2) }} % - {{ (stats.risk * 100).toFixed(2) }} %</span>
			</div>
		</div>
	`,
    props: ['stats', 'filters', 'jump', 'order', 'year'],
    methods: {
        presence: function(filter) {
            this.$emit('presence', {
                toggle: filter
            });
        },
        alterJump: function(action) {
            this.$emit('jump', {
                value: (action == 'reset' ? 1 : action)
            });
        },
        alter: function(type, value) {
            this.$emit('alter', {
                value: value,
                type: type
            });
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
			<div class="panel-body">
                <ResultStatsButton 
                    v-bind:stats="stats" 
                    v-bind:filters="filters" 
                    v-bind:jump="jump"
                    v-bind:order="order"
                    v-bind:year="year"
                    v-on:alter="alter">
                </ResultStatsButton>
				<table class="table table-condensed">
					<thead is="ResultHeader" v-bind:size="70" v-bind:fill="false"></thead>
					<tbody is="ResultBody" v-bind:results="results"></tbody>
				</table>
			</div>
		</div>
	</div>
	`,
    data: {
        results: [],
        filters: {
            fourseq: false,
            threeplusone: false,
            twoplustwo: false,
            threescatterplusone: false
        },
        jump: 1,
        order: 'left',
        year: 2017
    },
    computed: {
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
        retrieveResults() {
            let _this = this;

            axios.get('/reception?year=' + this.year).then(response => {
                _this.results = response.data.map(result => {
                    let numbers = Array(70).fill(false);

                    for (let number of result.number) {
                        numbers[number - 1] = true;
                    }

                    result.numbers = numbers;
                    result.highlight = false;

                    return result;
                });
            });
        },
        applyResultFilters(rfs) {
            let stats = {
                occurrence: 0,
                total: this.results.length,
                ratio: 0,
                risk: 1
            };

            for (let index in this.results) {
                let result = this.results[index];

                result.highlight = false;

                for (let rf of rfs) {
                    if (this[rf](result.numbers)) {
                        stats.occurrence++;
                        result.highlight = true;
                    }
                }
            }

            stats.ratio = stats.occurrence / stats.total;
            stats.risk = 1 - stats.occurrence * 100 / ((66 - this.jump) * stats.total);

            return stats;
        },
        alter(change) {
            switch (change.type) {
                case 'year':
                    this.year = change.value;
                    this.retrieveResults();
                    break;
                case 'order':
                    this.order = change.value;
                    break;
                case 'presence':
                    this.filters[change.value] = !this.filters[change.value];
                    break;
                case 'jump':
                    if (change.value == 'reset') {
                        this.jump = 1;
                    } else if ((this.jump += (change.value == '+' ? 1 : -1)) < 0) {
                        this.jump = 0;
                    }
                    break;
            }
        },
        presence4seq: function(numbers) {
            for (let i = 0; i < numbers.length - 3; i++) {
                if (numbers.slice(i, i + 4).reduce((matched, presence) => matched && presence)) {
                    return true;
                }
            }

            return false;
        },
        presence31: function(numbers) {
        	let definition = {
        		base: 4,
        		index:[0],
        		jump: [[1, 3]],
        		reverse: true
        	};

            for (let i = 0; i < 67 - this.jump; i++) {
                let left = numbers[i] && this.assertTrue(numbers, i + 1 + this.jump, i + 3 + this.jump) && this.order != 'right';
                let right = this.assertTrue(numbers, i, i + 2) && numbers[i + 3 + this.jump] && this.order != 'left';

                if (this.order == 'left' && left) {
                    return true;
                }

                if (this.order == 'right' && right) {
                    return true;
                }

                if (left || right) {
                    return true;
                }
            }

            return false;
        },
        presence22: function(numbers) {
        	let definition = {
        		base: 4,
        		index: {
        			normal: [[0, 1]],
        			jump: [[2, 3]]
        		}
        	};
            for (let i = 0; i < 67 - this.jump; i++) {
                if (this.assertTrue(numbers, i, i + 1) && this.assertTrue(numbers, i + 2 + this.jump, i + 3 + this.jump)) {
                    return true;
                }
            }

            return false;
        },
        presence3scatter1: function(numbers) {
            for (let i = 0; i < 65 - this.jump; i++) {
                if (numbers[i] && numbers[i + 2] && numbers[i + 4] && numbers[i + 5 + this.jump]) {
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