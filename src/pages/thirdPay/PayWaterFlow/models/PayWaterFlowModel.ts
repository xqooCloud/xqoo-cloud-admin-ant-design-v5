import {useCallback, useState} from "react";
import {PayWaterFlowEntity, QueryPayWaterFlow} from "@/pages/thirdPay/PayWaterFlow/data";
import {queryPayWaterFlow} from "@/pages/thirdPay/PayWaterFlow/service";

export default function PayWaterFlowModel() {
  const [payWaterFlowList, setPayWaterFlowList] = useState<PayWaterFlowEntity[]>([]);
  const [number, setNumber] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [first, setFirst] = useState<boolean>(true);
  const [last, setLast] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 查询
  const getPayWaterFlowFromServer = useCallback((queryParams: QueryPayWaterFlow) => {
    setLoading(true);
    queryPayWaterFlow(queryParams).then((res) => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        setPayWaterFlowList(res.data?.content || []);
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
    payWaterFlowList,
    totalElements,
    totalPages,
    number,
    first,
    last,
    loading,
    hasError,
    errorMessage,
    getPayWaterFlowFromServer
  }
}
