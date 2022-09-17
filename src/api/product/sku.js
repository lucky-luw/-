import request from '@/utils/request'
//获取spu图书数据
export const reqSpuImageList =(spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})
//获取销售属性的接口
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })
//获取平台属性的数组
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get'})
//添加sku
export const reqAddSku=(skuInfo)=>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo})
//获取某个spu的sku列表数据
export const reqSkuList=spuId=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})
//获取sku商品的数据
export const reqSkuAllList=(page,limit)=>request({url:`/admin/product/list/${page}/${limit}`,method:'get'})
//下架
export const reqCancelSale=skuId=>request({url:`/admin/product/cancelSale/${skuId}`,method:'get'})
//上架
export const reqOnSale = skuId => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })
//展示sku详情
export const reqGetSkuById = skuId => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })