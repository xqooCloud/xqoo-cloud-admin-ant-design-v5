import React, {ReactNode, ReactNodeArray, useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {useModel} from "@@/plugin-model/useModel";
import {FileManagerConfig} from "@/pages/fileManager/FileConfig/data";
import {AliyunOutlined, CloudUploadOutlined, HddFilled, QqOutlined} from "@ant-design/icons";
import {UploadPlatEnum} from "@/pages/fileManager/FileConfig/enums";
import {Avatar, Button, Card, Col, Divider, List, Result, Row, Skeleton, Space} from "antd";
import QueueAnim from "rc-queue-anim";
import styles from "@/pages/fileManager/FileConfig/FileConfig.less";
import FileConfigProperties from "@/pages/fileManager/FileConfig/components/FileConfigProperties";

const fakeLis = [
  {
    title: 1,
  },
  {
    title: 2,
  },
  {
    title: 3,
  }
];

const FileConfig: React.FC<{}> = () => {
  const {fileManagerConfig, loading, hasError, errorMessage, getAllActiveFileManagerFromServer} = useModel('fileManager.FileConfig.FileManagerConfigModel');
  const [localFileManagerConfigData, setLocalFileManagerConfigData] = useState<FileManagerConfig[]>([]);
  const [fileManagerConfigItem, setFileManagerConfigItem] = useState<ReactNodeArray>([]);
  const [checkedConfigId, setCheckedConfigId] = useState<number>(0);
  const [checkedConfigType, setCheckedConfigType] = useState<string>('');
  const [checkedConfigName, setCheckedConfigName] = useState<string>('');
  const [checkedRefreshCommand, setCheckedRefreshCommand] = useState<string>('');

  useEffect(() => {
    getAllActiveFileManagerFromServer();
  }, []);

  useEffect(() => {
    if(fileManagerConfig.length > 0){
      setLocalFileManagerConfigData(fileManagerConfig);
    }
  }, [fileManagerConfig]);

  useEffect(() => {
    if(localFileManagerConfigData.length > 0){
      initListRender(localFileManagerConfigData);
    }
  }, [localFileManagerConfigData]);

  // 构建列表对象
  const initListRender = (tmpArr: FileManagerConfig[]): void => {
    const arr: any[] = [];
    tmpArr.forEach(item => {
      arr.push(generatorRenderItem(item));
    });
    setFileManagerConfigItem(arr);
  };

  // 点击卡片执行的逻辑
  const checkNowLiItem = (checkConfigId: number, checkConfigName: string, checkConfigType: string, checkRefreshCommand: string) => {
    if(checkConfigId === checkedConfigId){
      return;
    }
    setCheckedConfigId(checkConfigId);
    setCheckedConfigName(checkConfigName);
    setCheckedConfigType(checkConfigType);
    setCheckedRefreshCommand(checkRefreshCommand);
    handleRenderCheckLi(checkConfigId);
  };

  // 更改渲染上的样式
  const handleRenderCheckLi = (checkConfigId: number) => {
    const tmpArr: FileManagerConfig[] = [];
    localFileManagerConfigData.forEach(item => {
      if(checkConfigId && item.id === checkConfigId){
        item.checked = true;
      }else{
        item.checked = false;
      }
      tmpArr.push(item);
    });
    setLocalFileManagerConfigData(tmpArr);
  };

  // 渲染图标
  const renderUploadPlatIconAndText = (plat: string): ReactNode => {
    let node: ReactNode = <></>;
    switch (plat) {
      case UploadPlatEnum.ALI:
        node = <span className={styles.payGroupIcon}><AliyunOutlined /></span>;
        break;
      case UploadPlatEnum.TENCENT:
        node = <span className={styles.payGroupIcon}><QqOutlined /></span>;
        break;
      case UploadPlatEnum.QINIU:
        node = <span className={styles.payGroupIcon}><CloudUploadOutlined /></span>;
        break;
      case UploadPlatEnum.LOCAL:
        node = <span className={styles.payGroupIcon}><HddFilled /></span>;
        break;
      default:
        node = <span className={styles.payGroupIcon}><CloudUploadOutlined /></span>;
    }
    return node;
  };

  const generatorRenderItem = (itemData: FileManagerConfig) => {
    return <li key={itemData.id}>
      <Card
        hoverable={!itemData.checked}
        className={itemData.checked ? styles.hoverOnLi : ''}
      >
        <Row justify="space-around" align="middle">
          <Col span={21} className={styles.pointer} onClick={() => {checkNowLiItem(itemData.id, itemData.uploadPlatName, itemData.uploadPlat, itemData.refreshCommand)}}>
            <Space key={'space' + itemData.id} size="large">
              {renderUploadPlatIconAndText(itemData.uploadPlat)}
              <span className={styles.payGroupNameText}>{itemData.uploadPlatName}</span>
            </Space>
          </Col>
        </Row>
      </Card>
    </li>
  };

  return (
    <PageContainer fixedHeader>
      <Row gutter={[24,24]}>
        <Col md={6} xs={24}>
          <div className={styles.backGroundDiv}>
            <Divider orientation="left">支付环境</Divider>
            <div className={styles.payGroupDiv}>
              {
                loading ?
                  <List
                    itemLayout="vertical"
                    size="large"
                    dataSource={fakeLis}
                    renderItem={item => (
                      <List.Item
                        key={item.title}
                      >
                        <Skeleton active avatar>
                          <List.Item.Meta
                            avatar={<Avatar />}
                            title={<a>{item.title}</a>}
                            description="none"
                          />
                          {item.title}
                        </Skeleton>
                      </List.Item>
                    )}
                  >
                  </List>
                  :
                  <>
                    {
                      hasError ?
                        <Result
                          key='PayGroupErrorKey'
                          status="error"
                          title="查出出错"
                          subTitle={errorMessage}
                          extra={
                            <Button
                              type="primary"
                              shape="round"
                              loading={loading}
                              onClick={getAllActiveFileManagerFromServer}>
                              重试
                            </Button>
                          }
                        />
                        :
                        <>
                          {
                            fileManagerConfigItem.length > 0 ?
                              <QueueAnim className={[`${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')} component="ul" type={['left', 'right']} leaveReverse>
                                {
                                  fileManagerConfigItem
                                }
                              </QueueAnim>
                              :
                              <Result
                                key='PayGroupKey'
                                status="info"
                                title="没有相关数据"
                                subTitle="当前没有可用的支付参数数据"
                                extra={
                                  <Button
                                    type="primary"
                                    shape="round"
                                    loading={loading}
                                    onClick={getAllActiveFileManagerFromServer}>
                                    刷新
                                  </Button>
                                }
                              />
                          }
                        </>
                    }
                  </>
              }
            </div>
          </div>
        </Col>

        <Col md={18} xs={24}>
          <FileConfigProperties
            parentConfigId={checkedConfigId}
            parentConfigName={checkedConfigName}
            parentConfigType={checkedConfigType}
            refreshCommand={checkedRefreshCommand}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};
export default FileConfig;
