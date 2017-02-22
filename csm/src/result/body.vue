<template>
  <tbody>
    <tr v-for="result in results" v-bind:class="{'bg-warning': result.highlight}">
      <td><small>{{ result.date }}</small></td>
      <td><span v-for="(num, index) in result.numbers" v-bind:class="{'text-muted': !num}" v-bind:title="index + 1">&nbsp;{{ num ? '■' : '□' }}</span></td>
    </tr>
  </tbody>
</template>

<script>
export default {
  name: 'result-body',
  props: ['results']
}
</script>

<style lang="scss">
</style>