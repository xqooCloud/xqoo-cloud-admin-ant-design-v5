import React, {useState} from "react";
import {Button, message, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {doUploadFile, getUploadSign} from "@/pages/fileManager/service";
import {SignBodyServer} from "@/pages/fileManager/data";

const ImageUpload: React.FC<{}> = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const uploadProps = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: any) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const getSign = async (): Promise<SignBodyServer|undefined> => {
    return getUploadSign({path: 'img/', accessType: 'public'}).then(res => {
      if (res.code === 200) {
        return res.data;
      } else {
        message.warning('获取上传签名发生错误:' + res.message);
        return undefined;
      }
    }).catch(e => {
      console.log('[upload error!]', e);
      message.error('获取上传签名发生错误，上传失败');
      return undefined;
    });
  };

  const handleUpload = async () => {
    const signObj = await getSign();
    if(!signObj){
      return;
    }
    console.log(signObj);
    setUploading(true);
    for (const file of fileList) {
      const formData = new FormData();
      formData.append("key", signObj.dir + file.name);
      formData.append("policy", signObj.policy);
      formData.append("OSSAccessKeyId", signObj.accessid);
      formData.append("success_action_status", '200');
      formData.append("signature", signObj.signature);
      // formData.append("callback", signObj.callback);
      formData.append("file", file);
      const res: any = await doUploadFile(signObj.host, formData);
      console.log(res);
    }
  };

  return (
    <>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? 'Uploading' : 'Start Upload'}
      </Button>
    </>
  );
};
export default ImageUpload;
