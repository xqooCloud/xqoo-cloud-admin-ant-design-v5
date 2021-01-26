import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {FileRecordEntity, QueryFileRecord} from "@/pages/fileManager/FileRecord/data";

export async function fileRecordPageGetList(data: QueryFileRecord) {
  return request<ResponseData<PageResponse<FileRecordEntity>>>(`/api/fileHandle/fileRecordHandle/pageGetList`, {
    method: 'POST',
    data
  });
}

export async function removeFile(fileId: string) {
  return request<ResponseData<string>>(`/api/fileHandle/fileRecordHandle/removeFile?fileId=${fileId}`);
}
