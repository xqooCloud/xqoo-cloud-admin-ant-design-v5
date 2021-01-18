import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {QueryRefundWaterFlow, RefundWaterFlowEntity} from "@/pages/thirdPay/RefundWaterFlow/data";

export async function queryRefundWaterFlow(data: QueryRefundWaterFlow) {
  return request<ResponseData<PageResponse<RefundWaterFlowEntity>>>(`/api/thirdPay/console/queryPayRefundWaterFlow`, {
    method: 'POST',
    data
  });
}
