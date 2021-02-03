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

export interface GoodsDetailVo extends SaleGoodsInfoEntity{
  pictureList?: GoodsPicture[];
  propertiesList?: ScreenPropertiesVo[];
  screenSize?: number;
  screenName?: string;
  screenAddress?: string;
  favoriteCount?: number;
}

export interface GoodsPicture {
  id: number;
  parentGoodsId?: string;
  fileName?: string;
  filePath?: string;
  fileId?: string;
  sortNo?: number;
}

export interface ScreenPropertiesVo{
  id: number;
  parentId?: string;
  propertiesLabel?: string;
  propertiesValue?: string;
  sortNo?: number;
}
