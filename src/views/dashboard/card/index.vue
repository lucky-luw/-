<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <detail title="总销售量" num="$12650">
            <div slot="charts" style="lineHeight: 60px" >周同比 56.67% 日同比 19.96%</div>
            <div slot="footer" style="lineHeight: 30px">日销售额￥12423 </div>
          </detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <detail title="访问量" num="88460">
             <div slot="charts">
               <lineChart></lineChart>
             </div>
            <div slot="footer" style="lineHeight: 30px">日访问量</div>
          </detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <detail title="支付笔数" num="88450">
            <div slot="charts" ref="charts" style="width:100%;height:60px;"></div>
            <div slot="footer" style="lineHeight: 30px">日访问量</div>
          </detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <detail title="运营活动效果" num="78%">
            <div slot="charts" ref="progresscharts" style="width:100%;height:60px;"></div>
            <div slot="footer" style="lineHeight: 30px">日访问量</div>

          </detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import detail from "./detail";
import lineChart from "./lineChart";
import * as echarts from 'echarts';
export default {
  name: "card",
  components:{detail,lineChart},
  mounted(){
    let barcharts=echarts.init(this.$refs.charts)
    barcharts.setOption({
       xAxis:{
                show: false,
                type:'category'
            },
            yAxis:{
                show: false
            },
            series:[{
                type:'bar',
                data:[77,4,29,61,43],
                barStyle:{
                    color: "purple"
                }
            }],
            grid:{
                left:0,
                right: 0,
                top: 0,
                bottom: 0
            },
            // 提示
            tooltip:{

            }
      
    })
    let progresscharts=echarts.init(this.$refs.progresscharts)
    progresscharts.setOption({
      xAxis:{
        show:false,
        min: 0,
        max: 100,
      },
      yAxis:{
        show:false,
        type:'category'
      },
      series:[{
        type:'bar',
        data:[30],
        color:'blue',
        barWidth: 10,
        backgroundStyle: '#ccc',
        showBackground:true,
        // 文本标签
        label:{
          show: true,
          formatter:'|',
          position: 'right',
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
};
</script>

<style>
</style>