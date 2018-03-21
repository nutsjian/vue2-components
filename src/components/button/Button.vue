<template>
  <div class="v-button__wrap">
    <button class="v-button">确定</button>
  </div>
</template>

<script>
export default {
  name: 'v-button',
  data () {
    return {
    }
  }
}
</script>
<style scoped lang="scss">
.v-button__wrap {
  display: inline-block;
    .v-button {
      padding: 5px 10px;
      font-size: 12px;
      border-radius: 2px;
    }
}
</style>
