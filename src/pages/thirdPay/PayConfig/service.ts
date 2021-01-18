import {request} from "@@/plugin-request/request";
import {ResponseData} from "@/services/PublicInterface";
import {
  PayConfigGroup,
  PayConfigProperties,
  PayConfigPropertiesQuery,
  QueryPayConfigGroup
} from "@/pages/thirdPay/PayConfig/data";

export async function queryPayConfigGroup(data: QueryPayConfigGroup) {
  return request<ResponseData<PayConfigGroup[]>>(`/api/thirdPay/console/queryPayConfig`, {
    method: 'POST',
    data
  });
}

export async function queryPayConfigProperties(data: PayConfigPropertiesQuery) {
  return request<ResponseData<PayConfigProperties[]>>(`/api/thirdPay/console/queryConfigProperties`, {
    method: 'POST',
    data
  });
}

export async function updatePropertiesInfo(data: PayConfigProperties) {
  return request<ResponseData<PayConfigProperties>>(`/api/thirdPay/console/updatePropertiesInfo`, {
    method: 'POST',
    data
  });
}

export async function updateConfig(refreshPlat: string) {
  return request<ResponseData<string>>(`/api/thirdPay/console/updateConfig?refreshPlat=${refreshPlat}`);
}
