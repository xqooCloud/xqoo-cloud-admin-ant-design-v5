import {PageRequest} from "@/services/PublicInterface";

export interface BannerGroupInfo {
  id: number;
  groupName: string;
  createBy: string;
  createDate: string;
  updateBy: string;
  updateDate: string;
  remarkTips: string;
  checked: boolean;
}

export interface QueryBannerGroupInfo extends PageRequest{
  groupName?: string;
}
