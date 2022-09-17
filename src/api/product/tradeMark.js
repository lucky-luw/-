//获取品牌数据管理的模块
import request from '@/utils/request.js'
//获取品牌列表的接口
export const reqTradeMarkList=(page,limit)=>request({
    url:`/admin/product/baseTrademark/${page}/${limit}`,
    method:'get'
})
//添加品牌
//修改品牌,修改品牌要带上品牌id，告诉修改哪个品牌
export const reqAddOrUpdateTradeMark = tradeMark => {
    if(tradeMark.id) { return request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark})}
    else {return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark})}
}
//删除品牌
export const reqDeleteTradeMark=id=>request({
    url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'
})

