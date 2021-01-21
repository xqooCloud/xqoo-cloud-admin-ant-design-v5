import {request} from "@@/plugin-request/request";
import {ResponseData} from "@/services/PublicInterface";
import {GetUploadSignParam, SignBodyServer} from "@/pages/fileManager/data";

export async function getUploadSign(params: GetUploadSignParam) {
  return request<ResponseData<SignBodyServer>>(`/api/fileHandle/aliOssHandle/getUploadSign`, {
    method: 'GET',
    params
  });
}

export async function doUploadFile(url: string, data: any){
  return request<any>(url, {
    method: 'POST',
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}
