import {useCallback, useState} from "react";
import {QuerySaleGoods, SaleGoodsInfoEntity} from "@/pages/saleCenter/SaleGoods/data";
import {
  aboardGoods,
  auditPass,
  publishGoods,
  saleInfoPageGetList,
  sendAudit,
  undercarriageGoods
} from "@/pages/saleCenter/SaleGoods/service";


export default function SaleGoodsInfoModel() {
  const [saleGoodsInfo, setSaleGoodsInfo] = useState<SaleGoodsInfoEntity[]>([]);
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
  const getSaleInfoPageGetList = useCallback((queryParams: QuerySaleGoods) => {
    setLoading(true);
    saleInfoPageGetList(queryParams).then((res) => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        setSaleGoodsInfo(res.data?.content || []);
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

  // 提交审核
  const sendAuditToServer = useCallback(async (goodsId: string): Promise<boolean> => {
    setLoading(true);
    return await sendAudit(goodsId).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        return true;
      }
      alertTipsHandle('warning', res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '提交审核时发生错误', true);
      return false;
    });
  }, []);

  // 审核通过
  const auditPassToServer = useCallback(async (goodsId: string): Promise<boolean> => {
    setLoading(true);
    return await auditPass(goodsId).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        return true;
      }
      alertTipsHandle('warning', res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '审核通过时发生错误', true);
      return false;
    });
  }, []);

  // 废除商品
  const aboardGoodsToServer = useCallback(async (goodsId: string): Promise<boolean> => {
    setLoading(true);
    return await aboardGoods(goodsId).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        return true;
      }
      alertTipsHandle('warning', res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '废弃商品时发生错误', true);
      return false;
    });
  }, []);

  // 上架商品
  const publishGoodsToServer = useCallback(async (goodsIds: string[]): Promise<boolean> => {
    setLoading(true);
    return await publishGoods(goodsIds).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        return true;
      }
      alertTipsHandle('warning', res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '上架商品时发生错误', true);
      return false;
    });
  }, []);

  // 下架商品
  const undercarriageGoodsToServer = useCallback(async (goodsIds: string[]): Promise<boolean> => {
    setLoading(true);
    return await undercarriageGoods(goodsIds).then(res => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        return true;
      }
      alertTipsHandle('warning', res.message, true, 3000);
      return false;
    }).catch(e => {
      alertTipsHandle('error', '下架商品时发生错误', true);
      return false;
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
    saleGoodsInfo,
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
    alertTipsHandle,
    getSaleInfoPageGetList,
    sendAuditToServer,
    auditPassToServer,
    aboardGoodsToServer,
    publishGoodsToServer,
    undercarriageGoodsToServer
  };

}
