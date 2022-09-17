<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <i class="el-icon-info"></i>
    </div>
    <div class="card-content">
      <span>{{ num }}</span>
    </div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "detail",
  props: {
    num:String,
    title:String
  }
};
</script>

<style scoped lang='less'>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #9d9d9d;
  margin-bottom: 10px;
  font-size: 14px;
}
.card-content {
  font-size: 24px;
  margin-bottom: 10px;
}
</style>