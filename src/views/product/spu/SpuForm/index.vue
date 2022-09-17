<template>
  <div>
      <el-form label-width="80px" :model="spu">
          <el-form-item label="SPU名称">
              <el-input v-model="spu.spuName"></el-input>
          </el-form-item>
          <el-form-item label="品牌">
              <el-select v-model="spu.tmId" placeholder="请选择品牌">
                  <el-option
                      v-for="item in tradeMarkList"
                      :key="item.id"
                      :label="item.tmName"
                      :value="item.id">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="SPU描述">
            <el-input type="textarea" v-model="spu.description" rows="4"></el-input>
          </el-form-item>
          <!-- 照片墙 file-list-->
          <el-form-item label="SPU图片">
            <el-upload
                action="/dev-api/admin/product/fileUpload"
                list-type="picture-card"
                :file-list="spuImageList"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl">
            </el-dialog>
          </el-form-item>
          <el-form-item label="销售属性">
              <el-select v-model="addAttrId" :placeholder="`还有${unSelectSaleAttr.length}位选择`">
                  <el-option :label="item.name" :value="`${item.id}:${item.name}`" v-for="item in unSelectSaleAttr" :key="item.id"></el-option>
              </el-select>
              <el-button type="primary" icon="el-icon-plus" :disabled="!addAttrId" @click="addTttr">添加销售属性</el-button>
          </el-form-item>
          <el-table style="width: 100%" border :data="spu.spuSaleAttrList" >
              <el-table-column type="index" label="序号" width="100"></el-table-column>
              <el-table-column prop="saleAttrName" label="属性名" width="200"> </el-table-column>
              <el-table-column label="属性值名称列表" width="width">
                <template slot-scope="{row,$index}">
                  <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable
                    :disable-transitions="true"
                    @close="handleClose(row,index)">
                    {{tag.saleAttrValueName}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="row.inputVisible"
                    v-model="row.inputValue"
                    :ref="$index"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(row)"
                    @blur="handleInputConfirm(row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(row,$index)">+</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="width">
                <template slot-scope="{$index}">
                  <el-button icon="el-icon-delete" @click="deletespuSaleAttr($index)"></el-button>
                </template>
              </el-table-column>
          </el-table>
          <el-form-item style="marginTop:20px">
              <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
              <el-button @click="cancel">取消</el-button>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
    name:'SpuForm',
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        spu:{
          category3Id:0,
          description:'',
          spuName:'',
          tmId:'',//品牌id
          spuImageList:[
            {
              id:0,
              imgName:'',
              imgUrl:'',
              spuId:0
            }
          ],
          spuSaleAttrList:[
            // {
            //   baseSaleAttrId:0,
            //   id:0,
            //   spuId:0,
            //   saleAttrName:'',
            //   spuSaleAttrValueList:[
            //     {
            //       baseSaleAttrId:0,
            //       id:0,
            //       isChecked:'',
            //       saleAttrName:'',
            //       saleAttrValueName:''
            //     },
            //   ],
            //   inputVisible: false,
            //   inputValue: '',
            // }
          ]
        },//spu信息：因为添加时没有相应的字段，所以将spu初始化，看文档发送给服务器的参数
        tradeMarkList:[],//spu的品牌信息
        spuImageList:[],//spu图片信息
        saleAttrList:[],//全部的销售属性
        addAttrId:'',//同时收集销售属性的id和name
      };
    },
    methods: {
      //删除文件的钩子
      handleRemove(file, fileList) {
        //file是删除的那张图片，fileList剩余的图片
        this.spuImageList=fileList
        //因为带给服务器的数据没有name和url字段，在提交服务器的时候要除去
      },
      //点击图片列表中已上传文件的勾子,放大图片
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      //照片墙图片上传成功的回调
      handleSuccess(response,file,fileList){
        this.spuImageList=fileList
      },
      //当点击修改或添加按钮时,获取父组件传来的数据，发四个请求
      async init(row){
       let spuResult=await this.$API.spu.reqSpu(row.id)
       if (spuResult.code==200) this.spu=spuResult.data;//修改时替换spu
       this.spu.spuSaleAttrList.forEach(item=>{
          this.$set(item, "inputVisible", false);//唯一标识每行input框
          this.$set(item, "inputValue", '');
       })
       let tradeMarkResult=await this.$API.spu.reqTradeMarkList()
       if (tradeMarkResult.code==200) this.tradeMarkList=tradeMarkResult.data;

       let spuImageList=await this.$API.spu.reqSpuImageList(row.id)
       //因为照片墙数据又要求
       if (spuImageList.code==200) {
         spuImageList.data.forEach(item => {
           item.name=item.imgName
           item.url=item.imgUrl
         })
         this.spuImageList=spuImageList.data
        }
        let saleAttrList=await this.$API.spu.reqBaseSaleAttrList()
        if (saleAttrList.code==200) this.saleAttrList=saleAttrList.data;
      },
      //删除属性值
      handleClose(row,index) {
        row.spuSaleAttrValueList.splice(index, 1);
      },
      //添加属性值失去焦点后
      handleInputConfirm(row) {
        let saleAttrValueName = row.inputValue;
        let {baseSaleAttrId,saleAttrName}=row
        if (saleAttrValueName) {
          if(!row.spuSaleAttrValueList.some(item=>item.saleAttrValueName==baseSaleAttrId)){
            row.spuSaleAttrValueList.push({
            baseSaleAttrId,
            id:0,
            isChecked:'',
            saleAttrName,
            saleAttrValueName
          });
           row.inputVisible = false;
            row.inputValue = '';
          }else{
            this.$message("请勿输入重复值")
          }
        }else{
          this.$message("请输入相应的属性值")
        }
       
      },
      //点击添加属性值加号时
      showInput(row,index) {
        row.inputVisible = true;
        this.$nextTick(() => {
          this.$refs[index].focus();//注意这里要写成[]
        });
      },
      //删除spu属性的操作
      deletespuSaleAttr(index){
        this.spu.spuSaleAttrList.splice(index,1)
      },
      //点击添加属性按钮时
      addTttr(){
        let [baseSaleAttrId,saleAttrName]=this.addAttrId.split(":");
        let spuId=this.spu.id
        this.spu.spuSaleAttrList.push({
          baseSaleAttrId,
          id:0,
          spuId,
          saleAttrName,
          spuSaleAttrValueList:[],
          inputVisible: false,
          inputValue: '',
        })
         this.addAttrId=''
      },
      //保存按钮的回调
     async addOrUpdateSpu(){
       //整理带给服务器的参数
       //新增的图片没有相应的参数
       if(this.spuImageList.length>0){
          this.spu.spuImageList=this.spuImageList.map(item=>{
         return {
           imgName:item.name,
           //给新增的图片添加imgUrl时注意不能添加成本地的，添加response中的
           imgUrl:(item.response&&item.response.data)||item.imgUrl
         }
        })//map返回一个新的数组
       }
      let result= await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if(result.code=200){
        this.$message("保存成功")
        this.$emit('changeScene',{scene:'showSpuRecords'})
      }
       //将老的数据清空
       Object.assign(this._data,this.$options.data())
     },
     //当添加spu时
     async addspudata(category3Id){
        let saleAttrList=await this.$API.spu.reqBaseSaleAttrList()
        if (saleAttrList.code==200) this.saleAttrList=saleAttrList.data;
        let tradeMarkResult=await this.$API.spu.reqTradeMarkList()
        if (tradeMarkResult.code==200) this.tradeMarkList=tradeMarkResult.data;
        this.spu.category3Id=category3Id//注意从父组件的到3id,发给服务器
     },
     //取消保存spu时
     cancel(){
       this.$emit('changeScene',{scene:'showSpuRecords'})
       console.log(this.$options)
       //将老的数据清空
       Object.assign(this._data,this.$options.data())
       //this.$option是组件的配置对象，_data是组件的响应式数据，Object.assign是es6数组合并
       
     }
    },
    computed:{
      //还未选择的计算属性
      unSelectSaleAttr(){
        //数组的filter方法，可以从当前的数组中过滤出用户需要的元素，并返回一个新数组！！！
        return this.saleAttrList.filter((item)=>{
         return this.spu.spuSaleAttrList.every((element)=>{
           return element.saleAttrName!=item.name
         })//every一假即假
        })
      }
    }
}
</script>

<style>
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
</style>