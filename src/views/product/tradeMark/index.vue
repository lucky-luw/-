<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px" @click="showdialog"
      >添加</el-button
    >
    <!-- 表格组件 data:显示的数据,border添加边框，label显示的标题，width对应列的宽度，align对齐方式,以一列展示数据,prop设置这一列字段名-->
    <el-table :data="list" style="width: 100%" border>
      <el-table-column  type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo" width="width" align="center">
          <template slot-scope="{row}">
             <img :src="row.logoUrl" style="width:100px;height:100px">
          </template>
      </el-table-column>
      <el-table-column  label="操作" width="width" align="center" >
          <!-- row是回传数据中结构出来的，固定叫法，里面还有index属性 -->
          <template slot-scope="{row}" >
                <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row,$event)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件   
            ,->是为了向右-->

    <el-pagination
      style="margin-top: 20px; textAlign: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :page-count="7"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total"
      @current-change="getPageList"
      @size-change="handelSizeChange"
    >
    </el-pagination>

    <!-- 对话框 -->
    <el-dialog
        :title="targetText"
        :visible.sync="dialogVisible"
        width="width"
        :before-close="dialogBeforeClose">
        <!-- v-model作用：把表单数据收集到对象上，将来表单验证，也需要这个属性 -->
        <el-form :model="tmForm" style="width:80%" v-model="tmForm" :rules="rules" ref="ruleForm">
            <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                <el-input v-model="tmForm.tmName"></el-input>
            </el-form-item>
            <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
                <!-- action为上传图片的路径 -->
                <el-upload
                    class="avatar-uploader"
                    action="/dev-api/admin/product/fileUpload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUpdateTradeMark">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
<script>
export default {
  name: "tradeMark",
  data() {
      return {
      page: 1,//当前页数
      limit: 3,//当前页数展示数据条数
      total: 0,//总共数据条数，服务器返回的
      list: [],//展示的数据，服务器返回
      dialogVisible:false,//对话框显示和隐藏
      targetText:"",
      //v-model收集表单中信息
      tmForm:{
          tmName:'',
          logoUrl:''
      },
      //验证规则:表单验证请查看elementui文档，trigger用户行为的设置change文本发生变化时触发
      rules:{
          tmName:[
             { required: true, message: '请输入品牌名称', trigger: 'blur' },
             { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          logoUrl:[
              {required:true,message:"请输入品牌图片"}
          ]
      }
      };
  },
  mounted() {
     this.getPageList();
  },
  methods: {
        //获取品牌列表,参数默认
        async getPageList(page=1) {
            this.page=page
            const result = await this.$API.tradeMark.reqTradeMarkList(
            this.page,
            this.limit
        ); //这是个异步操作所以用await
        if (result.code === 200) {
            this.total = result.data.total
            this.list=result.data.records
            console.log(this.list);
        }
            },
        handelSizeChange(limit){
            this.limit=limit;
            this.getPageList()
        },
        //点击添加按钮
        showdialog(e){
            this.dialogVisible=true;
            this.targetText=e.target.innerText
                //清空之前的数据
                this.tmForm.tmName=""
                this.tmForm.logoUrl=""
        },
    //图片上传成功时会执行一次
        handleAvatarSuccess(res, file) {
            //res file是上传成功之后向前台返回的数据
            this.tmForm.logoUrl=res.data
        },
        //在上传图片之前执行，返回false则不上传
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        //点击确定后
        addUpdateTradeMark(){
            //判断当全部验证字段通过后，再进行业务逻辑，参考文档
            this.$refs.ruleForm.validate(async (success)=>{
                if(success){
                    this.dialogVisible=false;
                    let result=await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
                    if(result.code==200){
                        this.$message({
                            type:'success',
                            message:this.tmForm.id?"修改品牌成功":"添加品牌成功"
                        })//message弹出提示
                        this.getPageList(this.tmForm.id? this.page:1)//获取新的列表 ,修改的话停留在当前页数
                    }
                }else{
                    this.$message({type:'error',message:'请按要求输入'})
                    return false
                }
            })
        },
        //点击修改按钮
        updateTradeMark(row,$event){
        this.dialogVisible=true;
        this.targetText=$event.target.innerText
        //    this.tmForm=row//将服务器返回的信息赋值，可是这样写是把地址拷贝给this.tmForm,当表单改变时，页面数据也会随之改变
            this.tmForm={...row}//浅拷贝：返回的数据进行展示
         },
        //点击删除按钮
        deleteTradeMark(row) {
            this.$confirm(`确定要删除${row.tmName}`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async () => {
                //如果点击确定
                let result=await this.$API.tradeMark.reqDeleteTradeMark(row.id)
                if (result.code==200){
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getPageList(this.list.length>1 ? this.page:this.page-1)
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
      }
    },
  
};
</script>

<style>
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>