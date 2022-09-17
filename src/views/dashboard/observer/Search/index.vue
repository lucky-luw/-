<template>
  <el-card>
    <div slot="header">
      <div class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <i class="el-icon-more"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item disabled>双皮奶</el-dropdown-item>
            <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <el-row :gutter="5">
        <el-col :span="6">
          <LineCharts title="搜索用户数" num="12321"/>
        </el-col>
        <el-col :span="6">
          <LineCharts title="人均搜索次数" num="2.7"/>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import LineCharts from "./linecharts";
export default {
  name: "Search",
  components: { LineCharts },
};
</script>

<style>
.search-header {
  display: flex;
  justify-content: space-between;
}
</style>