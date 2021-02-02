import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {QuerySaleGoods, SaleGoodsInfoEntity} from "@/pages/saleCenter/SaleGoods/data";


export async function saleInfoPageGetList(data: QuerySaleGoods) {
  return request<ResponseData<PageResponse<SaleGoodsInfoEntity>>>(`/api/saleCenter/saleGoodsInfoHandle/pageGetList`, {
    method: 'POST',
    data
  });
}

export async function sendAudit(goodsId: string) {
  return request<ResponseData<String>>(`/api/saleCenter/saleGoodsInfoHandle/sendAudit?goodsId=${goodsId}`);
}

export async function auditPass(goodsId: string) {
  return request<ResponseData<String>>(`/api/saleCenter/saleGoodsInfoHandle/auditPass?goodsId=${goodsId}`);
}

export async function aboardGoods(goodsId: string) {
  return request<ResponseData<String>>(`/api/saleCenter/saleGoodsInfoHandle/aboardGoods?goodsId=${goodsId}`);
}

export async function publishGoods(data: string[]) {
  return request<ResponseData<string>>(`/api/saleCenter/saleGoodsInfoHandle/publishGoods`, {
    method: 'POST',
    data
  });
}

export async function undercarriageGoods(data: string[]) {
  return request<ResponseData<string>>(`/api/saleCenter/saleGoodsInfoHandle/undercarriageGoods`, {
    method: 'POST',
    data
  });
}
