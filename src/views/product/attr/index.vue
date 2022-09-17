<template>
    <div>
        <el-card style="marginBottom:10px">
            <CategorySelector @getCategoryID="getCategoryID" :show="!isShowTable" />
        </el-card>
        <el-card>
            <div v-show="isShowTable">
                <el-button type="primary" icon="el-icon-plus" style="marginBottom:10px" :disabled="!category3id" @click="addAttr">添加属性</el-button>
                <el-table :data="attrList" style="width: 100%" border>
                    <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
                    <el-table-column prop="attrName" label="属性名称" width="300"></el-table-column>
                    <el-table-column  label="属性值列表" >
                        <!-- 再这一列中套用其它组件，作用域插槽 -->
                        <template slot-scope="{row}">
                            <el-tag type="success" v-for="attr in row.attrValueList" :key="attr.id" style="margin:0px 20px">{{attr.valueName}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作" width="300">
                        <template slot-scope="{row}">
                            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 添加修改属性时 -->
            <div v-show="!isShowTable">
                <el-form ref="form" :model="form" label-width="80px" :medel="attrInfo">
                    <el-form-item label="属性名" style="marginTop:20px"> 
                        <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                    </el-form-item>
                    <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
                    <el-button @click="isShowTable=true">取消</el-button>
                    <el-table :data="attrInfo.attrValueList" style="width: 100%;margin:20px 0" border>
                        <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
                        <el-table-column label="属性值名称" width="width">
                            <template slot-scope="{row,$index}">
                               <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" autofocus="true" @blur="tospan(row)" @keyup.native.enter="tospan(row)" :ref="$index"></el-input>
                               <span v-else style="display:block" @click="toInput(row,$index)">{{row.valueName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="300">
                            <template slot-scope="{row,$index}">
                                <el-popconfirm :title="`确定删除${row.valueName}吗`" @onConfirm="deleteAttrValue($index)">
                                   <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference" ></el-button>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button type="primary" :disabled="attrInfo.attrValueList.length<1" @click="addOrUptdateAttr">保存</el-button>
                    <el-button @click="isShowTable=true">取消</el-button>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
//按需引入lodash中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
    name:'attr',
    data(){
        return {
            category1id:'',
            category2id:'',
            category3id:'',
            attrList:[],//接受attrlist
            isShowTable:true,//控制tabel显示与隐藏
            attrInfo:{
                attrName:'',//属性名
                attrValueList:[
                    // {
                    //     attrId:0,
                    //     valueName:''//属性值
                    // }
                ],
                categoryId:0,
                categoryLevel:3,
            }
        }
    },
    methods:{
        //将子组件中选中的id传给父组件
        getCategoryID({category1id,category2id,category3id}){
            this.category1id=category1id
            this.category2id=category2id
            this.category3id=category3id
            if(this.category3id!=''){
                this.getAttrList()
            }
        },
        //向服务器发请求获取属性列表
       async getAttrList(){
           const {category1id ,category2id,category3id}=this
            let result=await this.$API.attr.reqAllList(category1id,category2id,category3id)
            if(result.code==200){
                this.attrList=result.data
            }
        },
        //点击添加属性值时，向数组push
        addAttrValue(){
            //此时还没有相应的id，如果修改已有属性添加属性值，给新加的属性值加上id，否则带给服务器为undefined
            this.attrInfo.attrValueList.push({attrId:this.attrInfo.id,valueName:'',flag:true})
            //flag控制每个属性input框是否显示，每个属性都添加，flag控制该属性，写在data中flag控制全部属性
        },
        //点击添加属性按钮时
        addAttr(){
            this.isShowTable=false
            //再每一次添加属性时清除数据中已有的属性数据
            this.attrInfo={
                attrName:'',
                attrValueList:[
                ],
                categoryId:this.category3id,
                categoryLevel:3,
            }
                    },
        //点击属性修改按钮时
        updateAttr(row){
            this.isShowTable=false
            //由于attrInfo对象中有数组，数组中又有对象，不能浅拷贝实现数据同步（浅拷贝时里面的对象同一个引用），所以用深拷贝（lodash插件）
            // row.attrValueList.forEach(element => {
            //     element.flag=false//注意添加的flag并不是响应式的
            // });第一种写法
            this.attrInfo=cloneDeep(row)
            this.attrInfo.attrValueList.forEach(item=>{
                 this.$set(item,'flag',false)//用$set添加响应式数据，第二种写法
            })
        },
        //属性值编辑模式与查看模式的切换
        tospan(row){
            //如果属性值为空不能作为新的属性值，给用户提示，输入一个属性值
            if(row.valueName.trim()=='') {
                this.$message("请输入正常的属性值")
                return false
            }
            //新增的属性值不能与已有的属性值重复
            let isSame=this.attrInfo.attrValueList.some(item=>{
                //important记得将当前row在属性值数组中排除
                if(item!==row){
                    return row.valueName==item.valueName
                }
            })//some一真即真，every一假即假，es6数组
            if(!isSame){row.flag=false}
            else{
                this.$message("请勿输入重复值")
            }
            console.log(row)
        },
        //点击span，回到编辑
        toInput(row,index){
            row.flag=true
            //切换为input时，自动让input框获取焦点，但是此时input不能立马获取到并获得焦点，页面重绘需要时间,$nextTick
            //点击span时用ref获取input的节点
            this.$nextTick(()=>{
                //此时已经有该节点了才执行,此时$refs中才有该节点
                this.$refs[index].focus()
            })
        },
        //气泡确认框确认按钮--删除某一属性值
        deleteAttrValue(index){
            this.attrInfo.attrValueList.splice(index,1)
        },
        //添加属性或修改属性保存按钮时
        async addOrUptdateAttr(){
            //发请求，整理参数 ，清除flag，空属性值没有提交给服务器
            //filter返回新数组
            this.attrInfo.attrValueList=this.attrInfo.attrValueList.filter((item)=>{
                if(item.valueName!='') {
                    delete item.flag
                    return true
                }//vue中forEach方法没有被重写
            })
            let result= await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
            if(result.code==200){
                this.$message({message:'保存成功',type:'success'})
                this.getAttrList()
                this.isShowTable=true
            }
        }
    }
}
</script>

<style>

</style>