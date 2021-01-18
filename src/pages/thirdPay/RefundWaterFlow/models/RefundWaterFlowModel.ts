import {useCallback, useState} from "react";
import {QueryRefundWaterFlow, RefundWaterFlowEntity} from "@/pages/thirdPay/RefundWaterFlow/data";
import {queryRefundWaterFlow} from "@/pages/thirdPay/RefundWaterFlow/service";

export default function RefundWaterFlowModel() {
  const [refundWaterFlowList, setRefundWaterFlowList] = useState<RefundWaterFlowEntity[]>([]);
  const [number, setNumber] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [first, setFirst] = useState<boolean>(true);
  const [last, setLast] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 查询
  const getRefundWaterFlowFromServer = useCallback((queryParams: QueryRefundWaterFlow) => {
    setLoading(true);
    queryRefundWaterFlow(queryParams).then((res) => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        setRefundWaterFlowList(res.data?.content || []);
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

  return {
    refundWaterFlowList,
    totalElements,
    totalPages,
    number,
    first,
    last,
    loading,
    hasError,
    errorMessage,
    getRefundWaterFlowFromServer
  }
}
