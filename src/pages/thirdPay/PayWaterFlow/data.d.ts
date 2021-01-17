import {PayDeviceEnum, PayPlatEnum} from "@/pages/thirdPay/PayConfig/enums";
import {PageRequest} from "@/services/PublicInterface";

export interface PayWaterFlowEntity{
  payTransactionId: string;
  payPlat: PayPlatEnum;
  payStatus: number;
  transactionId: string;
  clientPayId: string;
  refundStatus: number;
  payDevice: PayDeviceEnum;
  payPlatName: string;
  payDeviceName: string;
  payAmount: number;
  refundAmount: number;
  payUserId: string;
  payUserName: string;
  payComment: string;
  payTime: string;
  createBy: string;
  createDate: string;
  updateDate: string;
}

export interface QueryPayWaterFlow extends PageRequest{
  payTransactionId?: string;
  transactionId?: string;
  clientPayId?: string;
  refundStatus?: number;
  payDevice?: PayDeviceEnum;
  payStatus?: number;
  payPlat?: PayPlatEnum;
  startDate?: string;
  endDate?: string;
}
