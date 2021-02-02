import {PageRequest} from "@/services/PublicInterface";

export interface SaleGoodsInfoEntity{
  goodsId: string;
  screenId?: string;
  status?: number;
  salePrice?: number;
  saleOrgPrice?: number;
  screenPositionLong?: number,
  screenPositionLati?: number,
  overPeople?: number;
  saleTitle?: string;
  createDate?: string;
  createBy?: string;
  updateDate?: string;
  updateBy?: string;
  remarkTips?: string;
}

export interface QuerySaleGoods extends PageRequest{
  goodsId?: string;
  screenId?: string;
  status?: number;
  saleTitle?: string;
}
