<template>
  <div class="v-nestedscoped">
    <div class="v-nestedscoped__title">title</div>
    <div class="v-nestedscoped__content">content</div>
    <v-button></v-button>
  </div>
</template>
<script>
import VButton from '@/components/button/Button'
export default {
  name: 'v-nestedscoped',
  data () {
    return {
    }
  },
  components: { VButton }
}
</script>
<style scoped lang="scss">
.v-nestedscoped {
  width: 300px;
  height: 200px;
  background-color: #ccc;
  font-size: 14px;

  .v-nestedscoped__title {
    font-weight: bold;
    font-size: 20px;
  }
  .v-nestedscoped__content {
    font-size: 12px;
    color: red;
  }
}
</style>
