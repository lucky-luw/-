<template>
    <div>
        <el-form ref="form" :model="skuInfo" label-width="80px">
            <el-form-item label="SPU名称">
                {{spuName}}
            </el-form-item>
            <el-form-item label="SKU名称">
                <el-input v-model="skuInfo.skuName"></el-input>
            </el-form-item>
             <el-form-item label="价格(元)">
                <el-input v-model="skuInfo.price" type="number"></el-input>
            </el-form-item>
             <el-form-item label="重量(千克)">
                <el-input v-model="skuInfo.weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="规格描述">
                <el-input type="textarea" v-model="skuInfo.skuDesc" rows="4"></el-input>
            </el-form-item>
            <el-form-item label="平台属性">
                <!-- 行内表单嵌套 -->
                <el-form ref="form" label-width="80px" :inline="true">
                    <el-form-item :label="attr.attrName" v-for="(attr) in attrInfoList" :key="attr.id">
                        <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
                            <el-option :label="attrValue.valueName" v-for="attrValue in attr.attrValueList" :key="attrValue.id" :value="`${attr.id}:${attrValue.id}`"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-form ref="form" label-width="80px" :inline="true">
                   <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id"> 
                        <el-select placeholder="请选择" v-model="saleAttr.SaleAttrIdAndValueId">
                            <el-option v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`"></el-option>
                        </el-select>
                   </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="图片列表" >
                <el-table  style="width: 100%" border :data="spuImageList" @selection-change="selectionChange">
                    <el-table-column type="selection" width="50"></el-table-column>
                    <el-table-column  label="图片" width="width">
                        <template slot-scope="{row}">
                           <img :src="row.imgUrl" style="width:100px; height: 100px;">
                        </template>
                    </el-table-column>
                    <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
                    <el-table-column label="操作" width="width">
                        <template slot-scope="{row}">
                           <el-button type="primary" @click="changeDefault(row)" v-if="row.isDefault==0">设为默认</el-button>
                           <el-tag v-if="row.isDefault==1" type="success">默认</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveSku">保存</el-button>
                <el-button @click="deleteAdd">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name:'SkuForm',
    data() {
        return {
            spuName:'',
            spuImageList:[],
            spuSaleAttrList:[],
            attrInfoList:[],//服务器返回的平台属性
            //收集sku的信息，发给服务器
            skuInfo:{
                category3Id:0,
                spuId:0,
                tmId:0,
                price:0,
                skuName:'',
                weight:0,
                skuDesc:'',
                skuDefaultImg:'',//默认图片
                //平台属性
                skuAttrValueList:[],
                //收集图片
                skuImageList:[],
                //销售属性
                skuSaleAttrValueList:[
                    // {
                    //     id:0,
                    //     saleAttrId:0,
                    //     saleAttrName:'',
                    //     saleAttrValueName:'',
                    //     skuId:0,
                    //     spuId:0
                    // }
                ]

            }
        }
    },
    methods: {
        async getDate(category1id,category2id,spu){
            this.skuInfo.tmId=spu.tmId
            this.skuInfo.category3Id=spu.category3Id
            this.skuInfo.spuId=spu.id
            this.spuName=spu.spuName
            let result1=await this.$API.sku.reqSpuImageList(spu.id)
            let result2=await this.$API.sku.reqSpuSaleAttrList(spu.id)
            let result3=await this.$API.sku.reqAttrInfoList(category1id,category2id,spu.category3Id)
            
            if(result1.code==200){
                let list=result1.data
                list.forEach(item=>item.isDefault=0)
                this.spuImageList=list
            } 
            if(result2.code==200) this.spuSaleAttrList=result2.data
            if(result3.code==200) this.attrInfoList=result3.data
        },
        async saveSku(){
            Object.assign(this._data,this.$options.data(this))
            //整理参数
            this.attrInfoList.forEach(element => {
            if(element.attrIdAndValueId){
                let [attrId,valueId]=element.attrIdAndValueId.split(":")
                this.skuInfo.skuAttrValueList.push(
                    {
                        attrId,
                        valueId
                    }
                )
                }
            });
            //使用reduce的写法
            this.skuInfo.skuSaleAttrValueList=this.spuSaleAttrList.reduce((prev,item)=>{
                if(item.SaleAttrIdAndValueId){
                    let [saleAttrId,saleValueId]=item.SaleAttrIdAndValueId.split(":")
                    prev.push({saleAttrId,saleValueId})
                }
                return prev
            },[])
            this.skuInfo.skuImageList=this.spuImageList.map(item=>{
                return {
                    imgName:item.imgName,
                    imgUrl:item.imgUrl,
                    isDefault:item.isDefault,
                    spuImgId:item.id
                }
            })//map数组映射，生成新数组
           let result=await this.$API.sku.reqAddSku(this.skuInfo)
           if(result.code==200){
               this.$message("保存成功")
               this.$emit('changeScene',{scene:'showSpuRecords'})
           }
       },
        //table表格复选框选中事件
       selectionChange(selection){
           this.skuInfo.skuImageList=selection
       },
       //设置为默认图片事件
       changeDefault(row){
           this.spuImageList.forEach(item=>{
               item.isDefault=0
           })
           row.isDefault=1
           this.skuInfo.skuDefaultImg=row.imgUrl
       },
       //点击取消按钮
       deleteAdd(){
           this.$emit('changeScene',{scene:'showSpuRecords'})
           //清除数据
           Object.assign(this._data,this.$options.data(this))
       }
    },
   


       
   
}
</script>

<style>

</style>