import React, {useState} from "react";
import {message, Modal, Upload} from "antd";
import {getUploadSign} from "@/pages/fileManager/service";
import {SignBodyServer} from "@/pages/fileManager/data";
import * as dayjs from 'dayjs';

export interface ImageUploadProps {
  maxImageNumber: number;
  singlePicSize?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = (props) => {
  const {maxImageNumber, singlePicSize} = props;
  const [fileList, setFileList] = useState<any[]>([]);
  const [actionHost, setActionHost] = useState<string>('');
  const [extraData, setExtraData] = useState<any>();
  const [previewImage, setPreviewImage] = useState<string>();
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);

  const judgeIllegal = (file: any): boolean => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传jpg和png格式的图片');
      return false;
    }
    const maxSize = file.size / 1024 < (singlePicSize || 1024 * 1024);
    if (!maxSize) {
      message.error(`单张图片大小不得超过 ${singlePicSize} Kb`);
      return false;
    }
    return true;
  };

  const onRemove = (file: any) => {
    const newFileList: any[] = [];
    fileList.forEach((item, tmpIndex) => {
      if(file.uid !== item.uid){
        newFileList.push(item);
      }
    });
    setFileList(newFileList);
  };

  const beforeUpload = async (file: any) => {
    setActionHost("http://nononono");
    if (!judgeIllegal(file)) {
      return false;
    }
    const signObj = await getSign();
    if (!signObj) {
      message.error('获取上传签名失败，无法上传');
      return false;
    }
    const tmpData = {
      'x:uid_var': file.uid,
      'key': signObj.dir + file.name,
      'policy': signObj.policy,
      'OSSAccessKeyId': signObj.accessid,
      'success_action_status': '200',
      'callback': signObj.callback,
      'signature': signObj.signature
    }
    setExtraData(tmpData);
    file.status = 'uploading';
    file.percent = 10;
    setFileList([...fileList, file]);
    return file;
  };
  const onChange = ({ file, fileList }: any) => {
    console.log(fileList);
    if (file.status) {
      if (file.status === 'done') {
        console.log('上传成功');
        fileList = fileList.map((file: any) => {
          if (file.response) {
            file.id = file.uid;
            file.url = file.response.url;
          }
          return file;
        });
        setFileList([...fileList]);
      } else if (file.status === 'error') {
        console.error('上传失败')
      } else if (file.status === 'removed') {
        if (typeof file.uid === 'number') {
          //请求接口，删除已经保存过的图片，并且成功之后triggerChange
        } else {
          //只是上传到了服务器，并没有保存，直接riggerChange
        }
      }
    }
  };
  const getSign = async (): Promise<SignBodyServer|undefined> => {
    return await getUploadSign({path: 'img/' + dayjs().format('YYYYMMDD') + '/', accessType: 'public'}).then(res => {
      if (res.code === 200) {
        setActionHost(res.data?.host || '');
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

  const handlePreview = async (file: any) => {
    setPreviewImage("");
    setPreviewImage(file.url);    //这个图片路径根据自己的情况而定
    setPreviewVisible(true);
  };

  return (
    <>
      <Upload
        action={actionHost}
        beforeUpload={beforeUpload}
        onPreview={handlePreview}
        onRemove={onRemove}
        onChange={onChange}
        fileList={fileList}
        listType={"picture-card"}
        data={extraData}
      >
        {fileList.length < maxImageNumber && '+ 选择文件图片'}
      </Upload>
      <Modal
        visible={previewVisible}
        title='预览照片'
        width='80%'
        footer={null}
        onCancel={() => {
          setPreviewVisible(false);
        }}
      >
        <img alt="example" style={{ width: '100%', objectFit: 'contain' }} src={previewImage} />
      </Modal>
    </>
  );
};
export default ImageUpload;
