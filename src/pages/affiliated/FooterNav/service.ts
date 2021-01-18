import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {FooterNavGroupInfo, QueryFooterNavGroupInfo} from "@/pages/affiliated/FooterNav/data";

export async function getFooterNavGroupInfo(data: QueryFooterNavGroupInfo) {
  return request<ResponseData<PageResponse<FooterNavGroupInfo>>>(`/api/annex/footerNavGroupHandle/pageGetList`, {
    method: 'POST',
    data
  });
}

export async function deleteFooterNavGroup(id: number) {
  return request<ResponseData<any>>(`/api/annex/footerNavGroupHandle/removeFooterNavGroup/${id}`);
}

export async function updateFooterNavGroup(data: FooterNavGroupInfo) {
  return request<ResponseData<any>>(`/api/annex/footerNavGroupHandle/updateFooterNavGroup`, {
    method: 'POST',
    data
  });
}
export async function addFooterNavGroup(data: FooterNavGroupInfo) {
  return request<ResponseData<any>>(`/api/annex/footerNavGroupHandle/addFooterNavGroup`, {
    method: 'POST',
    data
  });
}
