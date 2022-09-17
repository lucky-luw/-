<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 头部左侧区域 -->
        <el-tabs @tab-click="handleClick" class="tab" v-model="activeName">
            <el-tab-pane label="用户管理" name="销售额">
            </el-tab-pane>
            <el-tab-pane label="配置管理" name="访问量"></el-tab-pane>
        </el-tabs>
        <!-- 头部右侧区域 -->
        <div class="right">
           <div class="data">
                <span @click="setday()">今日</span>
                <span @click="setweek()">本周</span>
                <span @click="setmonth()">本月</span>
                <span @click="setyear()">今年</span>
           </div>
             <div class="block">
                <el-date-picker
                size="mini"
                v-model="date"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
            </div>
        </div>
        <!--  -->
        
            <div>
                <el-row :gutter="2">
                    <el-col :span="18">
                        <div class="charts" ref="charts"></div>
                    </el-col>
                    <el-col :span="6">
                        <div class="top"> 
                            <h3>门店<span>{{activeName}}</span>排名</h3>
                        </div>
                        <div class="body">
                            <ul >
                                <li>
                                    <span class="index">肯德基</span>
                                    <span class="num">123456</span>
                                </li>
                                <li>
                                    <span class="index">肯德基</span>
                                    <span class="num">123456</span>
                                </li>
                                <li>
                                    <span class="index">肯德基</span>
                                    <span class="num">123456</span>
                                </li>
                                <li>
                                    <span class="index">肯德基</span>
                                    <span class="num">123456</span>
                                </li>
                                <li>
                                    <span class="index">肯德基</span>
                                    <span class="num">123456</span>
                                </li>
                                <li>
                                    <span class="index">肯德基</span>
                                    <span class="num">123456</span>
                                </li>
                                <li>
                                    <span class="index">肯德基</span>
                                    <span class="num">123456</span>
                                </li>
                                <li>
                                    <span class="index">肯德基</span>
                                    <span class="num">123456</span>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                </el-row>
            </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import * as dayjs from 'dayjs'
export default {
  name: "Sale",
  data() {
      return {
          activeName :'销售额',
          date:[],//数据双向绑定才有显示
      };
  },
   methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      setday(){
          const date=dayjs().format('YYYY-MM-DD')
          this.date=[date,date]
      },
      setweek(){
          const startdate=dayjs().day(0).format('YYYY-MM-DD')
          const enddate=dayjs().day(6).format('YYYY-MM-DD')
          this.date=[startdate,enddate]
      },
      
    },
    mounted() {
        this.mycharts=echarts.init(this.$refs.charts)
        this.mycharts.setOption({
            title:{
                text:this.activeName
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisTick: {
                    alignWithLabel: true
                }
                }
            ],
            yAxis: [
                {
                type: 'value'
                }
            ],
            series: [
                {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data: [10, 52, 200, 334, 390, 330, 220,300,200,450,230,320]
                }
            ]
        })

    },
    watch:{
        //监视状态的改变，改变标题
        activeName(){
            this.mycharts.setOption({
                title:{
                    text:this.activeName
                }
            })
        }
    }

};
</script>

<style>
.clearfix{
    
    position: relative;
}
.tab {
    width: 100%;
}
.right {
    position: absolute;

    display: flex;
    justify-content: space-between;
    top: 0px;
    right: 0px;
  
}
.data {
    padding-right: 20px;
    padding-top: 10px;
}
.data span {
    margin: 0 10px;
    cursor: pointer;
}
.block {
    float: right;
}
.charts {
    width: 100%;
    height: 300px;
}
.body ul {
    margin: 0;
    padding: 0;
    list-style: none;
    /* 属性设置某个选择器出现次数的计数器的值。默认为 0。 */
     counter-reset: letters;  
}
.body ul li {
   /* 属性设置某个选取器每次出现的计数器增量。默认增量是 1。 */
    counter-increment: letters;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
}

.body ul li .index::before {
    display: inline-block;
    /*  插入生成内容。 */
    content:counter(letters);
    text-align: center;
    line-height: 20px;
    background-color: #ccc;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    margin-right: 30px;
}
.num {
    display:flex;
    float: right;
}
</style>