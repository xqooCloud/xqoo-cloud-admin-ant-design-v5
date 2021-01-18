import {PayPlatEnum} from "@/pages/thirdPay/PayConfig/enums";

export interface QueryPayConfigGroup{
  payPlat: PayPlatEnum|undefined;
  activeState: 0|1|undefined;
  configStatus: 0|1|2|undefined;
}

export interface PayConfigGroup{
  id: number;
  payPlat: PayPlatEnum;
  configVersion: number;
  activeState: number;
  configStatus: number;
  payPlatName: string;
  refreshCommand: string;
  checked: boolean;
  createBy?: string;
  createDate?: null;
  updateBy?: null;
  updateDate?: null;
  remarkTips?: null;
}

export interface PayConfigPropertiesQuery{
  parentId: number;
  parentVersion: number;
  propertiesLabel?: string;
}

export interface PayConfigProperties{
  id: number;
  parentId: number;
  parentVersion: number;
  propertiesLabel: string;
  propertiesValue: string;
  propertiesPattern?: string;
  propertiesRemark: string;
  createBy?: string;
  createDate?: string;
  updateBy?: string;
  updateDate?: string;
  remarkTips?: string;
}
