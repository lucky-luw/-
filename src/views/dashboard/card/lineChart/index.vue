<template>
  <div ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name:'linechart',
    mounted(){
        let lineChart=echarts.init(this.$refs.charts)//获取dom节点
        lineChart.setOption({
            xAxis:{
                show: false,
                type:'category'
            },
            yAxis:{
                show: false
            },
            series:[{
                type:'line',
                data:[77,4,29,61,43],
                lineStyle:{
                    color: "purple"
                }
            }],
            grid:{
                left:0,
                right: 0,
                top: 0,
                bottom: 0
            }
        })
    }
}
</script>

<style scoped>
    div {
        height: 60px;
        weight: 100%;
    }
</style>