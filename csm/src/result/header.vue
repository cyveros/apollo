<template>
  <thead>
    <tr>
      <td></td>
      <td><span v-for="(value, index) in ruler" v-bind:title="index + 1">&nbsp;{{ value ? '■' : '□' }}</span></td>
    </tr>
  </thead>
</template>

<script>
export default {
  name: 'result-header',
  props: ['size', 'fill'],
  computed: {
    ruler: function() {
      let ruler = Array(parseInt(this.size || 70)).fill(this.fill || false);

      return ruler.map((value, index) => {
        return (index + 1) % 5 == 0;
      });
    }
  }
}
</script>

<style lang="scss">
</style>