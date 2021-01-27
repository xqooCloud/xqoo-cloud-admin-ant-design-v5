import {PageRequest} from "@/services/PublicInterface";

export interface BannerDetailInfo {
  id: number;
  groupId: number;
  activeCode: number;
  mediaUrl: string;
  bannerTips: string;
  redirectType: string;
  redirectValue: string;
  sortNo: number;
  createBy: string;
  createDate: string;
  updateBy: string;
  updateDate: string;
  remarkTips: string;
  checked: boolean;
}

export interface QueryBannerDetailInfo extends PageRequest {
  groupId?: number;
}

export interface BannerGroup {
  id: number;
  groupName: string;
}
