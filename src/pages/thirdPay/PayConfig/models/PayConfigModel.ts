import {useCallback, useState} from "react";
import {PayConfigGroup, QueryPayConfigGroup} from "@/pages/thirdPay/PayConfig/data";
import {ResponseData} from "@/services/PublicInterface";
import {queryPayConfigGroup} from "@/pages/thirdPay/PayConfig/service";


export default function PayConfigModel() {
  const [payConfigGroup, setPayConfigGroup] = useState<PayConfigGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 查询表
  const getPayConfigGroup = useCallback((queryBO: QueryPayConfigGroup) => {
    setLoading(true);
    queryPayConfigGroup(queryBO).then((res: ResponseData<PayConfigGroup[]>) => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        setPayConfigGroup(res.data || []);
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

  return {
    payConfigGroup,
    loading,
    hasError,
    errorMessage,
    getPayConfigGroup
  }
};
