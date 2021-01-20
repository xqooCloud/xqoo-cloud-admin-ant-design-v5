import {request} from "@@/plugin-request/request";
import {ResponseData} from "@/services/PublicInterface";
import {FileConfigProperties, FileManagerConfig} from "@/pages/fileManager/FileConfig/data";


export async function getAllActiveFileManager() {
  return request<ResponseData<FileManagerConfig[]>>(`/api/fileHandle/fileManagerConfigHandle/getAllActiveFileManager`);
}

export async function getAllPropertiesByParentId(parentId: number) {
  return request<ResponseData<FileConfigProperties[]>>(`/api/fileHandle/fileConfigPropertiesHandle/getAllPropertiesByParentId?parentId=${parentId}`);
}

export async function updatePropertiesInfo(data: FileConfigProperties) {
  return request<ResponseData<FileConfigProperties>>(`/api/fileHandle/fileConfigPropertiesHandle/updatePropertiesInfo`, {
    method: "POST",
    data
  });
}

export async function getNowServerConfigProperties(uploadType?: string) {
  return request<ResponseData<any>>(`/api/fileHandle/fileConfigPropertiesHandle/getNowConfigProperties?uploadType=${uploadType}`);
}

export async function updateConfig(refreshPlat: string) {
  return request<ResponseData<string>>(`/api/fileHandle/fileConfigPropertiesHandle/refreshFileConfig?refreshPlat=${refreshPlat}`);
}
