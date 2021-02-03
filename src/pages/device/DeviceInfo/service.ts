import {request} from "@@/plugin-request/request";
import {PageResponse, ResponseData} from "@/services/PublicInterface";
import {
  DeviceConfigProperties,
  DeviceDetailEntity,
  DeviceInfoEntity,
  DeviceInfoQuery
} from "@/pages/device/DeviceInfo/data";

export async function getDeviceInfoList(data: DeviceInfoQuery) {
  return request<ResponseData<PageResponse<DeviceInfoEntity>>>(`/api/device/deviceInfoHandle/pageGetList`, {
    method: 'POST',
    data
  });
}

export async function updateDeviceInfo(data: DeviceDetailEntity) {
  return request<ResponseData<string>>(`/api/device/deviceInfoHandle/updateDeviceBaseInfo`, {
    method: 'POST',
    data
  });
}

export async function getDeviceInfoForPublic(deviceId: string) {
  return request<ResponseData<any>>(`/api/device/deviceInfoHandle/getDeviceInfoForPublic?id=${deviceId}`);
}

export async function getRecordByPrimaryKey(deviceId: string) {
  return request<ResponseData<DeviceDetailEntity>>(`/api/device/deviceInfoHandle/getRecordByPrimaryKey?id=${deviceId}`);
}

export async function deleteDevice(deviceId: string) {
  return request<ResponseData<string>>(`/api/device/deviceInfoHandle/deleteDevice?deviceId=${deviceId}`);
}

export async function deviceToDeploy(deviceId: string) {
  return request<ResponseData<string>>(`/api/device/deviceInfoHandle/deviceToDeploy?deviceId=${deviceId}`);
}

export async function deviceToFinish(deviceId: string) {
  return request<ResponseData<string>>(`/api/device/deviceInfoHandle/deviceToFinish?deviceId=${deviceId}`);
}

export async function deviceToRemove(deviceId: string) {
  return request<ResponseData<string>>(`/api/device/deviceInfoHandle/deviceToRemove?deviceId=${deviceId}`);
}

export async function deviceToStop(deviceId: string) {
  return request<ResponseData<string>>(`/api/device/deviceInfoHandle/deviceToStop?deviceId=${deviceId}`);
}

export async function getScreenConfigProperties() {
  return request<ResponseData<DeviceConfigProperties>>(`/api/device/deviceInfoHandle/getScreenConfigProperties`);
}
