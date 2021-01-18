import {useCallback, useState} from "react";
import {
  PayConfigProperties,
  PayConfigPropertiesQuery
} from "@/pages/thirdPay/PayConfig/data";
import {ResponseData} from "@/services/PublicInterface";
import {queryPayConfigProperties, updateConfig, updatePropertiesInfo} from "@/pages/thirdPay/PayConfig/service";


export default function PayConfigPropertiesModel() {
  const [payConfigProperties, setPayConfigProperties] = useState<PayConfigProperties[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [handleLoading, setHandleLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [alertTipsShow, setAlertTipsShow] = useState<boolean>(false);
  const [alertTipsMessage, setAlertTipsMessage] = useState<string>('');
  const [alertTipsType, setAlertTipsType] = useState<'info'|'warning'|'success'|'error'|undefined>('info');

  // 查询表
  const getPayConfigProperties= useCallback((queryBO: PayConfigPropertiesQuery) => {
    setLoading(true);
    queryPayConfigProperties(queryBO).then((res: ResponseData<PayConfigProperties[]>) => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        setPayConfigProperties(res.data || []);
      }else{
        setHasError(true);
        setErrorMessage(res.message);
      }
    }).catch(e => {
      setLoading(false);
      setHasError(true);
      setErrorMessage("执行查询时发生了错误");
    });
  }, []);

  // 刷新服务器配置参数
  const refreshConfigToServer = useCallback(async (data: string): Promise<boolean> => {
    setHandleLoading(true);
    return await updateConfig(data).then(res => {
      setHandleLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '操作成功', true, 3000);
        return true;
      }
      alertTipsHandle('warning', '操作失败:' + res.message, true, 10000);
      return false;
    }).catch(e => {
      setHandleLoading(false);
      alertTipsHandle('error', '操作发生错误，删除失败', true);
      return false;
    });
  },[]);

  // 新增/修改信息
  const updateConfigPropertiesToServer = useCallback(async (data: PayConfigProperties): Promise<PayConfigProperties|undefined> => {
    setHandleLoading(true);
    return await updatePropertiesInfo(data).then(res => {
      setHandleLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '操作成功', true, 3000);
        return res.data;
      }
      alertTipsHandle('warning', '操作失败:' + res.message, true, 10000);
      return undefined;
    }).catch(e => {
      setHandleLoading(false);
      alertTipsHandle('error', '操作发生错误，变更失败', true);
      return undefined;
    });
  },[]);

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
    payConfigProperties,
    loading,
    handleLoading,
    hasError,
    errorMessage,
    alertTipsShow,
    alertTipsMessage,
    alertTipsType,
    getPayConfigProperties,
    updateConfigPropertiesToServer,
    refreshConfigToServer,
    alertTipsHandle
  }
};
