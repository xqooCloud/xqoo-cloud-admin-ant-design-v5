import {useCallback, useState} from "react";
import {DeviceConfigProperties, DeviceDetailEntity} from "@/pages/device/DeviceInfo/data";
import {getRecordByPrimaryKey, getScreenConfigProperties, updateDeviceInfo} from "@/pages/device/DeviceInfo/service";

export default function DeviceInfoDetailModel() {
  const [deviceInfoDetail, setDeviceInfoDetail] = useState<DeviceDetailEntity>();
  const [screenConfig, setScreenConfig] = useState<DeviceConfigProperties>();
  const [loading, setLoading] = useState<boolean>(false);
  const [queryLoading, setQueryLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [alertTipsShow, setAlertTipsShow] = useState<boolean>(false);
  const [alertTipsMessage, setAlertTipsMessage] = useState<string>('');
  const [alertTipsType, setAlertTipsType] = useState<'info'|'warning'|'success'|'error'|undefined>('info');

  // 查询
  const getRecordByPrimaryKeyFromServer = useCallback((routeId: string) => {
    setQueryLoading(true);
    getRecordByPrimaryKey(routeId).then((res) => {
      setQueryLoading(false);
      if(res.code === 200){
        setHasError(false);
        setDeviceInfoDetail(res.data);
      }else{
        setHasError(true);
        setErrorMessage(res.message);
      }
    }).catch(e => {
      setQueryLoading(false);
      setHasError(true);
      setErrorMessage("执行查询时发生了错误");
    });
  }, []);

  // 查询配置参数
  const getScreenConfigPropertiesFromServer = useCallback(() => {
    getScreenConfigProperties().then((res) => {
      if(res.code === 200){
        setScreenConfig(res.data);
      }else{
        alertTipsHandle('warning', '获取配置参数失败，建议返回重新进入', true, 3000);
      }
    }).catch(e => {
      alertTipsHandle('warning', '获取配置参数失败，建议返回重新进入', true, 3000);
    });
  }, []);

  // 推送更改路由信息
  const updateDeviceInfoToServer = useCallback(async (data: DeviceDetailEntity): Promise<boolean> => {
    setLoading(true);
    return await updateDeviceInfo(data).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '保存成功,即将跳转...', true, 3000);
        return true;
      }
      alertTipsHandle('error', '保存失败:' + res.message, true);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '保存路由发生错误，保存失败', true);
      return false;
    });
  }, []);

  const clearInfo = useCallback(() => {
    setDeviceInfoDetail(undefined);
  }, []);

  const initModelInfo = useCallback(() => {
    setHasError(false);
    setAlertTipsShow(false);
    setLoading(false);
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
    deviceInfoDetail,
    screenConfig,
    loading,
    queryLoading,
    hasError,
    errorMessage,
    alertTipsShow,
    alertTipsMessage,
    alertTipsType,
    alertTipsHandle,
    clearInfo,
    initModelInfo,
    updateDeviceInfoToServer,
    getScreenConfigPropertiesFromServer,
    getRecordByPrimaryKeyFromServer
  }
}
