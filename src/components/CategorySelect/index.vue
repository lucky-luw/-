<template>
  <!-- 下拉框公用组件 -->
  <div>
    <!-- inline代表行内表单 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm" style="textAlign:center">
      <el-form-item label="一级分类" style="margin-right:50px">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="list.name"
            :value="list.id"
            v-for="list in Category1List"
            :key="list.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" style="margin-right:50px">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2id"
          @change="handler2"
           :disabled="show"
        >
          <el-option
            :label="list.name"
            :value="list.id"
            v-for="list in Category2List"
            :key="list.id"
            
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3id"
          @change="handler3"
           :disabled="show"
        >
          <el-option
            :label="list.name"
            :value="list.id"
            v-for="list in Category3List"
            :key="list.id"
            
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelector",
  props:['show'],
  data() {
    return {
      Category1List: [],
      Category2List: [],
      Category3List: [],

      cForm: {
        category1id: "",
        category2id: "",
        category3id: "",
      },
    };
  },
  mounted() {
      this.getCategory1List()
  },
  methods: {
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.Category1List = result.data;
      }
    },
    //当一级分类的选项改变时,通过一级分类选择的id，获取二级分类的数据
    async handler1() {
        //把上一次数据清除
        this.Category3List=[]
        this.Category2List=[]
        this.cForm.category2id=''
        this.cForm.category3id=''
        const { category1id } = this.cForm;
        this.$emit('getCategoryID',this.cForm)
        let result = await this.$API.attr.reqCategory2List(category1id);
        if (result.code == 200) {
            this.Category2List = result.data;
        }
    },
    //当二级分类的选项改变时,通过二级分类选择的id，获取三级分类的数据
    async handler2() {
       this.Category3List=[]
       this.cForm.category3id=''
       const { category2id } = this.cForm;
       this.$emit('getCategoryID',this.cForm)
       let result = await this.$API.attr.reqCategory3List(category2id);
       if (result.code == 200) {
        this.Category3List = result.data;
       }
    },
    //三级分类的
    handler3() {
        this.$emit('getCategoryID',this.cForm)
    },
  },
};
</script>

<style>
</style>