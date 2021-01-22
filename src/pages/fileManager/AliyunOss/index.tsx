import React from "react";
import {PageContainer} from "@ant-design/pro-layout";
import ImageUpload from "@/pages/fileManager/components/ImageUpload";

const AliyunOss: React.FC<{}> = () => {

  return (
    <PageContainer fixedHeader>
      <ImageUpload maxImageNumber={1} />
    </PageContainer>
  );
};
export default AliyunOss;
