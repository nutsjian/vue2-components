<template>
  <div class="scoped01">
    scoped01
    xxxxx
    <v-button></v-button>
  </div>
</template>

<script>
import VButton from '@/components/button/Button'
export default {
  name: 'scoped01',
  data () {
    return {
    }
  },
  components: { VButton },
  mounted () {
    console.log('scoped01')
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.v-button__wrap .v-button {
  width: 100px;
}
</style>
