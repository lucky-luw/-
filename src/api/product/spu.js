import request from '@/utils/request'
//获取spu列表数组的接口
export const reqSpuList=(page,limit,category3Id)=>request({url:`admin/product/${page}/${limit}`,params:{category3Id}})
//再添加spu或修改中，各个表单数据都要发请求获取到
//获取spu信息
export const reqSpu=spuId=>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})
//获取品牌信息展示信息
export const reqTradeMarkList= () => request({ url: "/admin/product/baseTrademark/getTrademarkList", method: 'get' });
//获取spu图标
export const reqSpuImageList = spuId => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })
//获取spu有的销售属性,最多有三个
export const reqBaseSaleAttrList = ()=> request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })
//修改spu或添加spu，参数区别在是否又id
export const reqAddOrUpdateSpu=spuInfo=>{
    if(spuInfo.id){
        //修改
        return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
    }else{
        //添加
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })

    }
}

//删除spu
export const reqDeleteSpu=spuId=>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})