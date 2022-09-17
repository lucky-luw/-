<template>
  <div>
      <el-card>
        <CategorySelector @getCategoryID="getCategoryID" :show="scene!='showSpuRecords'"/>
      </el-card>
      <el-card style="marginTop:30px">
          <div v-show="scene=='showSpuRecords'">
            <el-button type="primary" icon="el-icon-plus" @click="addSpu" :disabled="!category3id">添加SPU</el-button>
            <el-table :data="records" style="width: 100%;margin:10px 0" border >
                <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
                <el-table-column prop="spuName"  label="spu名称" width="width"></el-table-column>
                <el-table-column prop="description" label="spu描述" width="width"></el-table-column>
                <el-table-column label="操作" width="width">
                    <template slot-scope="{row}">
                        <!-- 记得自定义组件.native -->
                       <HintButton type="seccess" size="mini" icon="el-icon-plus" title="添加sku" @click.native="addsku(row)" ></HintButton>
                       <HintButton type="warning" size="mini" icon="el-icon-edit" title="修改spu" @click.native="showAddOrUpdateSpuForm(row)" ></HintButton>
                       <HintButton type="info" size="mini" icon="el-icon-info" title="查看当前spu全部sku列表" @click="readSkuList(row)"></HintButton>
                       <!-- 展示sku列表的弹出框 -->
                        <el-dialog :title="showedspuName+'的sku列表'" :visible.sync="dialogTableVisible">
                        <el-table :data="skuInfoList" border v-loading="loading"
                        element-loading-text="拼命加载中"
                        element-loading-spinner="el-icon-loading"
                        element-loading-background="rgba(0, 0, 0, 0.5)" >
                            <el-table-column property="skuName" label="sku名称" width="150"></el-table-column>
                            <el-table-column property="price" label="价格" width="200"></el-table-column>
                            <el-table-column property="weight" label="重量"></el-table-column>
                            <el-table-column label="默认图片">
                                <template slot-scope="{row}">
                                   <img :src="row.skuDefaultImg" style="width:80px;height: 80px">
                                </template>
                            </el-table-column>
                        </el-table>
                        </el-dialog>
                        <el-popconfirm :title="`确定删除吗`" @onConfirm="deleteSpu(row.id)">
                            <HintButton type="danger" size="mini" icon="el-icon-delete" title="删除spu" slot="reference"></HintButton>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
           <el-pagination
                style="textAlign:center;"
               :current-page="page"
               :page-sizes="[3, 5, 10]"
               :page-size="limit"
               layout="total, sizes, prev, pager, next, jumper"
               :total="total"
               @current-change="handleCurrentChange"
               @size-change="handelSizeChange">
           </el-pagination>
          </div>
          <div v-show="scene=='addOrUpdateSpu'">
              <!-- 由于该部分内容较为复杂，所以拆分为组件 ,代码不会很复杂-->
            <SpuForm @changeScene="changeScene" ref="spuform"/>
          </div>
          <div v-show="scene=='addSku'">
            <SkuForm @changeScene="changeScene" ref="skuform"/>
          </div>
      </el-card>
  </div>
</template>

<script>
// import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
import SpuForm from './SpuForm'
export default {
    name:'spu',
    data(){
        return {
            loading: false,
            skuInfoList:[],
            showedspuName:'',
            dialogTableVisible:false,
            category1id:'',
            category2id:'',
            category3id:'',
            page:1,
            limit:3,
            total:'',
            records:[],//spu列表展示的数组
            scene:'showSpuRecords',
            flag:1,//标识是添加或者修改spu
        }
    },
    methods:{
        //获得子组件传来的数据，自定义事件回调
        getCategoryID({category1id,category2id,category3id}){
            this.category1id=category1id;
            this.category2id=category2id;
            this.category3id=category3id;
            if(this.category3id!='') this.getSpuList()
        },
        //获取spu列表
       async getSpuList(){
            let {page,limit,category3id}=this
            let result=await this.$API.spu.reqSpuList(page,limit,category3id)
            if(result.code==200){
                this.total=result.data.total
                this.records=result.data.records
            }
        },
        //点击分页器按钮的回调，参数elementui分装好，为点击的页数
        handleCurrentChange(page){
            this.page=page
            this.getSpuList()
        },//这里也可以和getSpulist写成同一个回调
        //调整每一页多少size的自定义事件的回调
        handelSizeChange(limit){
            this.limit=limit
            this.getSpuList()
        },
        //修改spu按钮回调
        showAddOrUpdateSpuForm(row){
            this.flag=1
            this.scene='addOrUpdateSpu'
            this.$refs.spuform.init(row)//通过ref将row数据传递给子组件，也可以用全局事件总线
        },
        //自定义事件的回调
        changeScene({scene}){
            this.scene=scene
            if(this.flag==0){
                this.page=1;
                this.getSpuList()
            }else{
                this.getSpuList()
            }
        },
        addSpu(){
            this.flag=0
            this.scene='addOrUpdateSpu'
            //通知子组件发请求两个
            this.$refs.spuform.addspudata(this.category3id)
        },
        async deleteSpu(id){
           let result= await this.$API.spu.reqDeleteSpu(id)
           if(result.code==200){
               this.$message({type:'success',message:'删除成功'})
               this.page=this.records.length>1?this.page:this.page-1
               this.getSpuList()
           }
        },
        //点击添加sku实例的按钮
        addsku(row){
            console.log(row)
            this.scene="addSku"
            let {category1id,category2id}=this
            this.$refs.skuform.getDate(category1id,category2id,row)
        },
        //点击查看sku列表时
        async readSkuList(spu){
            this.skuInfoList=[]
            this.dialogTableVisible=true
            this.loading=true
            this.showedspuName=spu.spuName
            let result=await this.$API.sku.reqSkuList(spu.id)
            if(result.code==200){
                this.loading=false
               this.skuInfoList=result.data
            }
        }
    },
    components:{
        SpuForm,SkuForm
    },
}
</script>

<style>

</style>