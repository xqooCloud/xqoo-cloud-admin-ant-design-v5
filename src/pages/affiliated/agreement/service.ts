import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {AgreementInfo, QueryAgreementInfo} from "@/pages/affiliated/agreement/data";

export async function getAgreementInfo(data: QueryAgreementInfo) {
  return request<ResponseData<PageResponse<AgreementInfo>>>(`/api/annex/agreementInfoHandle/pageGetList`, {
    method: 'POST',
    data
  });
}

export async function deleteAgreement(key: string) {
  return request<ResponseData<any>>(`/api/annex/agreementInfoHandle/deleteAgreement?agreementKey=${key}`);
}

export async function updateAgreement(data: AgreementInfo) {
  return request<ResponseData<any>>(`/api/annex/agreementInfoHandle/updateAgreement`, {
    method: 'POST',
    data
  });
}

