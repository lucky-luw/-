<template>
  <div>
    <el-table :data="skuAllList" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="width">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="weight" label="重量（kg）" width="width">
      </el-table-column>
      <el-table-column prop="price" label="价格（元）" width="width">
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="{ row }">
          <HintButton
            title="下架sku"
            size="mini"
            type="success"
            icon="el-icon-sort-down"
            v-if="row.isSale == 1"
            @click.native="changeSale(0, row.id)"
          ></HintButton>
          <HintButton
            title="上架sku"
            size="mini"
            type="success"
            icon="el-icon-sort-up"
            v-else
            @click.native="changeSale(1, row.id)"
          ></HintButton>
          <HintButton
            title=""
            size="mini"
            type="primary"
            icon="el-icon-edit"
          ></HintButton>
          <HintButton
            title="查看详情"
            size="mini"
            type="info"
            icon="el-icon-info"
            @click.native="skuMore(row.id)"
          ></HintButton>
          <HintButton
            title=""
            size="mini"
            type="danger"
            icon="el-icon-delete"
          ></HintButton>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handelSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      style="textAlign: center; marginTop: 20px"
    >
    </el-pagination>
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      :destroy-on-close="true"
      size="50%"
      custom-class="el-drawer"
    >
    <el-empty description="无数据" v-if="skuImageList==[]"></el-empty>
    <div v-else>
      <el-row justify="center">
        <el-col :span="4" ><div class="grid-content">名称</div></el-col>
        <el-col :span="20"><div class="grid-content">{{ skuInfo.skuName }}</div></el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="4"><div class="grid-content">描述</div></el-col>
        <el-col :span="20"
          ><div class="grid-content">{{ skuInfo.skuDesc }}</div></el-col
        >
      </el-row>
      <el-row justify="center">
        <el-col :span="4"><div class="grid-content">价格</div></el-col>
        <el-col :span="20"
          ><div class="grid-content">{{ skuInfo.price }}</div></el-col
        >
      </el-row>
      <el-row justify="center">
        <el-col :span="4"><div class="grid-content">平台属性</div></el-col>
        <el-col :span="20"
          ><div class="grid-content">
            <el-tag
              type="success"
              v-for="item in skuInfo.skuAttrValueList"
              :key="item.id"
              style="margin: 0 10px"
              >{{ item.valueName }}</el-tag
            >
          </div></el-col
        >
      </el-row>
      <el-row justify="center">
        <el-col :span="4"><div class="grid-content">商品图片</div></el-col>
        <el-col :span="20"><div class="grid-content">
            <div class="demo-image__preview">
                <el-image 
                    style="width: 100px; height: 100px;margin:0 10px"
                    :src="img.imgUrl" 
                    v-for="img in skuInfo.skuImageList"
                    :key="img.id"
                    :preview-src-list="skuImageList"
                >
                </el-image>
            </div>
            </div>
        </el-col>
      </el-row>
    </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "sku",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      pages: 0,
      drawer: false,
      skuAllList: [],
      skuInfo: {},
    };
  },
  mounted() {
    this.getSkuAList();
  },
  methods: {
    async getSkuAList() {
      const { page, limit } = this;
      const result = await this.$API.sku.reqSkuAllList(page, limit);
      if (result.code == 200) {
        this.skuAllList = result.data.records;
        this.total = result.data.total;
        this.pages = result.data.pages;
      }
    },
    handelSizeChange(size) {
      this.limit = size;
      this.getSkuAList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getSkuAList();
    },
    async changeSale(isSale, skuId) {
      if (isSale == 1) {
        let result = await this.$API.sku.reqOnSale(skuId);
        if (result.code == 200) {
          this.getSkuAList();
          this.$message({ type: "success", message: "上架成功" });
        }
      } else {
        let result = await this.$API.sku.reqCancelSale(skuId);
        if (result.code == 200) {
          this.getSkuAList();
          this.$message({ type: "success", message: "下架成功" });
        }
      }
    },
    //展示sku详情
    async skuMore(skuId) {
      this.skuInfo = {};
      this.drawer = true;
      let result = await this.$API.sku.reqGetSkuById(skuId);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
  computed:{
      //sku的图像
      skuImageList:function(){
          let imgurl=[]
          if(this.skuInfo!={} && this.skuInfo.skuImageList!=null){
              this.skuInfo.skuImageList.forEach(item=>{
              imgurl.push(item.imgUrl)
          })
          }
          return imgurl
      }
  }
};
</script>

<style lang="less">
.el-drawer{
    padding: 20px;
    background-color:#f0f0f0;
}
.el-row {
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 0;
  }
 
}
.el-col{
   &:first-child {
      font-size: 22px;
      text-align: right;
      font-weight: 700;
  }
  &:last-child{
      padding-left: 20px;
      font-size: 20px;
      text-align: left;
      font-weight: 400;
  }
}

</style>