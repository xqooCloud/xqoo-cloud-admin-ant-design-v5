import React from "react";
import {PageContainer} from "@ant-design/pro-layout";
import ImageUpload from "@/pages/fileManager/components/ImageUpload";

const AliyunOss: React.FC<{}> = () => {

  const uploaded = (arr: any[]) => {
    console.log(arr);
  };

  return (
    <PageContainer fixedHeader>
      <ImageUpload maxImageNumber={2} uploadedCallback={uploaded} accessType="public"/>
      <img src="https://xqoo-public.oss-cn-shanghai.aliyuncs.com/tmp1d/20210126190741_1_qr.jpg" />
    </PageContainer>
  );
};
export default AliyunOss;
