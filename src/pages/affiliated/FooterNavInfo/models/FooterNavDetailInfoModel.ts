import {useCallback, useState} from "react";
import {FooterNavDetailInfo, QueryFooterNavDetailInfo} from "@/pages/affiliated/FooterNavInfo/data";
import {
  deleteFooterNavDetail,
  updateFooterNavDetail,
  addFooterNavDetail,
  getFooterNavDetailInfo
} from "@/pages/affiliated/FooterNavInfo/service";


export default function UserLoginHistoryModel() {
  const [footerNavDetailInfoList, setFooterNavDetailInfoList] = useState<FooterNavDetailInfo[]>([]);
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


  // 查询用户
  const getFooterNavDetailInfoFromServer = useCallback((queryParams: QueryFooterNavDetailInfo) => {
    setLoading(true);
    getFooterNavDetailInfo(queryParams).then((res) => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        setFooterNavDetailInfoList(res.data?.content || []);
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

  // 删除数据源
  const deleteFooterNavDetailInfoToServer = useCallback(async (id: number) => {
    setLoading(true);
    return await deleteFooterNavDetail(id).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '删除成功', true, 3000);
        return true;
      }
      alertTipsHandle('warning', '删除失败:' + res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '删除用户发生错误，删除失败', true);
      return false;
    });
  },[]);

  // 新增/修改数据源
  const updateFooterNavDetailInfoToServer = useCallback(async (data: FooterNavDetailInfo) => {
    setLoading(true);
    return await updateFooterNavDetail(data).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '操作成功', true, 3000);
        return true;
      }
      alertTipsHandle('warning', '操作失败:' + res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '操作发生错误，删除失败', true);
      return false;
    });
  },[]);
//新增
  const addFooterNavDetailInfoToServer = useCallback(async (data: FooterNavDetailInfo) => {
    setLoading(true);
    return await addFooterNavDetail(data).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        alertTipsHandle('success', '操作成功', true, 3000);
        return true;
      }
      alertTipsHandle('warning', '操作失败:' + res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '操作发生错误，删除失败', true);
      return false;
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
    footerNavDetailInfoList,
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
    getFooterNavDetailInfoFromServer,
    deleteFooterNavDetailInfoToServer,
    updateFooterNavDetailInfoToServer,
    addFooterNavDetailInfoToServer,
    alertTipsHandle
  }
}
