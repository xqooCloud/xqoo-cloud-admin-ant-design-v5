import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {BannerGroupInfo, QueryBannerGroupInfo} from "@/pages/affiliated/banner/group/data";

export async function getBannerGroupInfo(data: QueryBannerGroupInfo) {
  return request<ResponseData<PageResponse<BannerGroupInfo>>>(`/api/annex/bannerGroupInfoHandle/pageGetList`, {
    method: 'POST',
    data
  });
}

export async function deleteBannerGroupInfo(id: number) {
  return request<ResponseData<any>>(`/api/annex/bannerGroupInfoHandle/deleteBannerGroupInfo?id=${id}`);
}

export async function updateBannerGroupInfo(data: BannerGroupInfo) {
  return request<ResponseData<any>>(`/api/annex/bannerGroupInfoHandle/updateBannerGroupInfo`, {
    method: 'POST',
    data
  });
}

