<template>
  <div class="scoped02">
    scoped02
    <v-button></v-button>
  </div>
</template>

<script>
import VButton from '@/components/button/Button'
export default {
  name: 'scoped02',
  data () {
    return {
    }
  },
  components: { VButton },
  mounted () {
    console.log('scoped02')
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
