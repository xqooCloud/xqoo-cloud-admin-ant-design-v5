import {PayDeviceEnum, PayPlatEnum} from "@/pages/thirdPay/PayConfig/enums";
import {PageRequest} from "@/services/PublicInterface";

export interface RefundWaterFlowEntity{
  refundCode
  refundStatus
  payTransactionId
  refundOrderDetailId
  refundPlat
  refundUserId
  tradeId
  refundAmount
  refundReason
  refundTime
  refundLaunch
  createBy: string;
  createDate: string;
  updateDate: string;
  updateBy: string;
  remarkTips: string;
}

export interface QueryRefundWaterFlow extends PageRequest{
  endDate?: string,
  payTransactionId?: string,
  refundCode?: string,
  refundPlat?: PayPlatEnum,
  refundStatus?: number,
  refundUserId?: string,
  startDate?: string,
  tradeId?: string
}
