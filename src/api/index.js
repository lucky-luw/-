//统一暴露所有接口，方便租价使用，只需引入一个文件
import * as tradeMark from './product/tradeMark'
import * as attr from './product/attr'
import * as spu from './product/spu'
import * as sku from './product/sku'

export default{
    tradeMark, attr, spu, sku
}