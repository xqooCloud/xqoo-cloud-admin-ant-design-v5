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
      <img src="https://xqoo-public.oss-cn-shanghai.aliyuncs.com/img/20210122/school-project.jpg" />
    </PageContainer>
  );
};
export default AliyunOss;
