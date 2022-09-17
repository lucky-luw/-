<template>
  <div class="dashboard-container">
    <card></card>
    <Sale></Sale>
    <observer></observer>
  </div>
</template>

<script>
import card from './card'
import Sale from './Sale'
import observer from './observer'
export default {
  name: 'Dashboard',
  components:{
    card,Sale,observer
  },
 
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
