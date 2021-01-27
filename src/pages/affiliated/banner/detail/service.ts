import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {BannerDetailInfo, BannerGroup, QueryBannerDetailInfo} from "@/pages/affiliated/banner/detail/data";

export async function getBannerDetailInfo(data: QueryBannerDetailInfo) {
  return request<ResponseData<PageResponse<BannerDetailInfo>>>(`/api/annex/bannerDetailInfoHandle/pageGetList`, {
    method: 'POST',
    data
  });
}
export async function getGroupList() {
  return request<ResponseData<BannerGroup[]>>(`/api/annex/bannerDetailInfoHandle/getGroupList`);
}

export async function deleteBannerDetail(id: number) {
  return request<ResponseData<any>>(`/api/annex/bannerDetailInfoHandle/deleteBannerDetailInfo?id=${id}`);
}

export async function updateBannerDetail(data: BannerDetailInfo) {
  return request<ResponseData<any>>(`/api/annex/bannerDetailInfoHandle/updateBannerDetailInfo`, {
    method: 'POST',
    data
  });
}

