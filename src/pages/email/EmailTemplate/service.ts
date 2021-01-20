import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {EmailTemplateInfo, QueryEmailTemplateInfo} from "@/pages/email/EmailTemplate/data";

export async function getList(data: QueryEmailTemplateInfo) {
  return request<ResponseData<PageResponse<EmailTemplateInfo>>>(`/api/email/emailTemplateHandle/pageGetList`, {
    method: 'POST',
    data
  });
}
export async function deleteData(id: number) {
  return request<ResponseData<any>>(`/api/email/emailTemplateHandle/deleteEmailTemplate?id=${id}`);
}

export async function updateData(data: EmailTemplateInfo) {
  return request<ResponseData<any>>(`/api/email/emailTemplateHandle/updateEmailTemplate`, {
    method: 'POST',
    data
  });
}
