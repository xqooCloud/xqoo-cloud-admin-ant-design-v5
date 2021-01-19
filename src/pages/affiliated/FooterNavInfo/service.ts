import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {FooterNavDetailInfo, QueryFooterNavDetailInfo} from "@/pages/affiliated/FooterNavInfo/data";

export async function getFooterNavDetailInfo(data: QueryFooterNavDetailInfo) {
  return request<ResponseData<PageResponse<FooterNavDetailInfo>>>(`/api/annex/footerNavDetailHandle/pageGetList`, {
    method: 'POST',
    data
  });
}

export async function deleteFooterNavDetail(id: number) {
  return request<ResponseData<any>>(`/api/annex/footerNavDetailHandle/removeFooterNavDetail/${id}`);
}

export async function updateFooterNavDetail(data: FooterNavDetailInfo) {
  return request<ResponseData<any>>(`/api/annex/footerNavDetailHandle/updateFooterNavDetail`, {
    method: 'POST',
    data
  });
}
export async function addFooterNavDetail(data: FooterNavDetailInfo) {
  return request<ResponseData<any>>(`/api/annex/footerNavDetailHandle/addFooterNavDetail`, {
    method: 'POST',
    data
  });
}
