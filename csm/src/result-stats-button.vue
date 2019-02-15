<template>
  <div class="row">
    <div class="col-sm-2">
      <span class="btn-group btn-group-xs" role="group">
        <a class="btn btn-default" v-on:click="alter('year', 2016)" v-bind:class="{active: year == 2016}">2016</a>
        <a class="btn btn-default" v-on:click="alter('year', 2017)" v-bind:class="{active: year == 2017}">2017</a>
      </span>
      &nbsp;
      <span class="btn-group btn-group-xs" role="group">
        <a class="btn btn-default" v-on:click="alter('year', 2016)" v-bind:class="{active: year == 2016}"><i class="glyphicon glyphicon-th-large"></i></a>
        <a class="btn btn-default" v-on:click="alter('year', 2017)" v-bind:class="{active: year == 2017}"><i class="glyphicon glyphicon-th-list"></i></a>
      </span>
    </div>
    <div class="col-sm-7">
      <span class="btn-group btn-group-xs" role="group">
          <a class="btn btn-default" v-on:click="alter('order', 'left')" v-bind:class="{active: order == 'left'}"><i class="glyphicon glyphicon-arrow-left"></i></a>
          <a class="btn btn-default" v-on:click="alter('order', 'any')" v-bind:class="{active: order == 'any'}">any</a>
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
      <span title="occurrence - hit ratio - chance of lost">occurrence - hit ratio - chance of lost: {{ stats.occurrence }} / {{ stats.total }} - {{ (stats.ratio * 100).toFixed(2) }} % - {{ (stats.risk * 100).toFixed(2) }} %</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'result-stats-button',
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
}
</script>

<style lang="scss">
</style>