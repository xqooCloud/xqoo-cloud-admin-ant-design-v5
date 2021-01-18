import {PageRequest} from "@/services/PublicInterface";

export interface AgreementInfo {
  agreementKey: string;
  agreementContent: string;
  createBy: string;
  createDate: string;
  updateBy: string;
  updateDate: string;
  remarkTips: string;
  checked: boolean;
}

export interface QueryAgreementInfo extends PageRequest{
  agreementKey?: string;
}
