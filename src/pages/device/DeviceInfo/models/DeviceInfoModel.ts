import {useCallback, useState} from "react";
import {DeviceInfoEntity, DeviceInfoQuery} from "@/pages/device/DeviceInfo/data";
import {
  deleteDevice,
  deviceToDeploy,
  deviceToFinish,
  deviceToRemove,
  deviceToStop, getDeviceInfoForPublic,
  getDeviceInfoList
} from "@/pages/device/DeviceInfo/service";


export default function DeviceInfoModel() {
  const [deviceInfoList, setDeviceInfoList] = useState<DeviceInfoEntity[]>([]);
  const [number, setNumber] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [first, setFirst] = useState<boolean>(true);
  const [last, setLast] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [alertTipsShow, setAlertTipsShow] = useState<boolean>(false);
  const [alertTipsMessage, setAlertTipsMessage] = useState<string>('');
  const [alertTipsType, setAlertTipsType] = useState<'info'|'warning'|'success'|'error'|undefined>('info');


  // 查询
  const getDeviceInfoListFromServer = useCallback((queryParams: DeviceInfoQuery) => {
    setLoading(true);
    getDeviceInfoList(queryParams).then((res) => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        setDeviceInfoList(res.data?.content || []);
        setNumber(res.data?.number || 1);
        setTotalElements(res.data?.totalElements || 0);
        setTotalPages(res.data?.totalPages || 1);
        setFirst(res.data?.first || false);
        setLast(res.data?.last || false);
      }else{
        setHasError(true);
        setErrorMessage(res.message);
      }
    }).catch(e => {
      setHasError(true);
      setErrorMessage("执行查询时发生了错误");
    });
  }, []);

  // 删除记录
  const delRecord = useCallback(async (deviceId: string): Promise<boolean> => {
    setLoading(true);
    return await deleteDevice(deviceId).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '删除成功', true, 3000);
        return true;
      }
      alertTipsHandle('warning', '删除失败:' + res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '删除文件发生错误，删除失败', true);
      return false;
    });
  }, []);

  // updateToDeploy
  const updateToDeployToServer = useCallback(async (deviceId: string): Promise<boolean> => {
    setLoading(true);
    return await deviceToDeploy(deviceId).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '部署成功', true, 3000);
        return true;
      }
      alertTipsHandle('warning', res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '变更设备状态时发生错误，请稍后再试', true);
      return false;
    });
  }, []);

  // deviceToFinish
  const deviceToFinishToServer = useCallback(async (deviceId: string): Promise<boolean> => {
    setLoading(true);
    return await deviceToFinish(deviceId).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '部署完成', true, 3000);
        return true;
      }
      alertTipsHandle('warning', res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '变更设备状态时发生错误，请稍后再试', true);
      return false;
    });
  }, []);

  // deviceToRemove
  const deviceToRemoveToServer = useCallback(async (deviceId: string): Promise<boolean> => {
    setLoading(true);
    return await deviceToRemove(deviceId).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '拆机完成', true, 3000);
        return true;
      }
      alertTipsHandle('warning', res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '变更设备状态时发生错误，请稍后再试', true);
      return false;
    });
  }, []);

  // deviceToStop
  const deviceToStopToServer = useCallback(async (deviceId: string): Promise<boolean> => {
    setLoading(true);
    return await deviceToStop(deviceId).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '停机完成', true, 3000);
        return true;
      }
      alertTipsHandle('warning', res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '变更设备状态时发生错误，请稍后再试', true);
      return false;
    });
  }, []);

  // deviceToStop
  const getDeviceInfoForPublicFromServer = useCallback(async (deviceId: string): Promise<any> => {
    setLoading(true);
    return await getDeviceInfoForPublic(deviceId).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        return res.data;
      }
      alertTipsHandle('warning', res.message, true, 3000);
      return undefined;
    }).catch(e => {
      setLoading(false);
      alertTipsHandle('error', '获取设备详细信息出错，请稍后再试', true);
      return undefined;
    });
  }, []);


  // 显示处理提示信息
  const alertTipsHandle = useCallback((type: 'info'|'warning'|'success'|'error'|undefined, message: string, show: boolean, autoClose?: number) => {
    setAlertTipsMessage(message);
    setAlertTipsType(type);
    setAlertTipsShow(show);
    if(autoClose){
      setTimeout(() => {
        setAlertTipsShow(false);
      }, autoClose);
    }
  }, []);

  return {
    deviceInfoList,
    totalElements,
    totalPages,
    number,
    first,
    last,
    loading,
    hasError,
    errorMessage,
    alertTipsShow,
    alertTipsMessage,
    alertTipsType,
    getDeviceInfoListFromServer,
    delRecord,
    updateToDeployToServer,
    deviceToFinishToServer,
    deviceToRemoveToServer,
    deviceToStopToServer,
    getDeviceInfoForPublicFromServer,
    alertTipsHandle
  }
}
