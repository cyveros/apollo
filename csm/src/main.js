import Vue from 'vue';
import App from './App.vue';
import ResultStatsButton from './result/stats-button.vue';
import ResultHeader from './result/header.vue';
import ResultBody from './result/body.vue';
import Definition from './presence/definition';
import axios from 'axios';

Vue.component('ResultStatsButton', ResultStatsButton);
Vue.component('ResultHeader', ResultHeader);
Vue.component('ResultBody', ResultBody);

new Vue({
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
        resolvePresence(definition, numbers) {
        	for (let i = 0; i < numbers.length - definition.base + 1; i++) {
                if (numbers.slice(i, i + 4).reduce((matched, presence) => matched && presence)) {
                    return true;
                }
            }
        },
        presence4seq: function(numbers) {
        	let definition = new Definition({
        		base: 4,
        		index: {
        			normal: [[0, 3]],
        			gap: []
        		}
        	});

            return definition.match(numbers);
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
