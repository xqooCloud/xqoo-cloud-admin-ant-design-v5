import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {PayWaterFlowEntity, QueryPayWaterFlow} from "@/pages/thirdPay/PayWaterFlow/data";

export async function queryPayWaterFlow(data: QueryPayWaterFlow) {
  return request<ResponseData<PageResponse<PayWaterFlowEntity>>>(`/api/thirdPay/console/queryPayWaterFlow`, {
    method: 'POST',
    data
  });
}
