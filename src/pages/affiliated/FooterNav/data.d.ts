import {PageRequest} from "@/services/PublicInterface";

export interface FooterNavGroupInfo {
  id: number;
  delFlag: number;
  needRedirect: boolean;
  redirectUrl: string;
  iconName: string;
  groupName: string;
  groupTips: string;
  createBy: string;
  createDate: string;
  updateBy: string;
  updateDate: string;
  remarkTips: string;
}

export interface QueryFooterNavGroupInfo extends PageRequest{
  groupName?: string;
  needRedirect?: number;
}

