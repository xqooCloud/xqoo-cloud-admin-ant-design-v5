import {useCallback, useState} from "react";
import {ResponseData} from "@/services/PublicInterface";
import {getAllActiveFileManager} from "@/pages/fileManager/FileConfig/service";
import {FileManagerConfig} from "@/pages/fileManager/FileConfig/data";


export default function FileManagerConfigModel() {
  const [fileManagerConfig, setFileManagerConfig] = useState<FileManagerConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 查询表
  const getAllActiveFileManagerFromServer = useCallback(() => {
    setLoading(true);
    getAllActiveFileManager().then((res: ResponseData<FileManagerConfig[]>) => {
      setLoading(false);
      if(res.code === 200){
        setHasError(false);
        setFileManagerConfig(res.data || []);
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
    fileManagerConfig,
    loading,
    hasError,
    errorMessage,
    getAllActiveFileManagerFromServer
  }
};
