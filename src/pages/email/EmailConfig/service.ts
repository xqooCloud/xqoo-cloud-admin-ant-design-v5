import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {EmailConfigInfo, QueryEmailConfigInfo} from "@/pages/email/EmailConfig/data";

export async function getEmailConfigInfo(data: QueryEmailConfigInfo) {
  return request<ResponseData<PageResponse<EmailConfigInfo>>>(`/api/email/emailConfigHandle/pageGetList`, {
    method: 'POST',
    data
  });
}
export async function deleteEmailConfig(id: number) {
  return request<ResponseData<any>>(`/api/email/emailConfigHandle/deleteEmailConfig?id=${id}`);
}

export async function updateEmailConfig(data: EmailConfigInfo) {
  return request<ResponseData<any>>(`/api/email/emailConfigHandle/updateEmailConfig`, {
    method: 'POST',
    data
  });
}
