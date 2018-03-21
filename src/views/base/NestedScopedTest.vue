<template>
  <div class="nestedscopedtest">
    <nestedscoped></nestedscoped>
  </div>
</template>

<script>
import NestedScoped from '@/components/nestedscoped/NestedScoped'
export default {
  name: 'nestedscopedtest',
  data () {
    return {
    }
  },
  components: {
    'nestedscoped': NestedScoped
  }
}
</script>
<style lang="scss">
.nestedscopedtest  .v-button {
  width: 100px;
}
</style>
