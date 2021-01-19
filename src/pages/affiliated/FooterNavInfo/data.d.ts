import {PageRequest} from "@/services/PublicInterface";

export interface FooterNavDetailInfo {
  id: number;
  delFlag: number;
  groupId: number;
  groupName: string;
  redirectUrl: boolean;
  labelTitle: string;
  labelText: string;
  sortNo: string;
  iconName: string;
  createBy: string;
  createDate: string;
  updateBy: string;
  updateDate: string;
  remarkTips: string;
}

export interface QueryFooterNavDetailInfo extends PageRequest{
  labelText?: string;
  redirectUrl?: number;
  groupId?: number;
}

