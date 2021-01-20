import {PageContainer} from "@ant-design/pro-layout";
import React, {ReactNode, ReactNodeArray, useEffect, useState} from "react";
import {Avatar, Button, Card, Col, Divider, List, Result, Row, Skeleton, Space} from "antd";
import {useModel} from "@@/plugin-model/useModel";
import {PayConfigGroup, QueryPayConfigGroup} from "@/pages/thirdPay/PayConfig/data";
import QueueAnim from "rc-queue-anim";
import {PayPlatEnum} from "@/pages/thirdPay/PayConfig/enums";
import {AlipayCircleOutlined, AppleOutlined, PropertySafetyOutlined, WechatOutlined} from "@ant-design/icons";
import PayConfigProperties from "@/pages/thirdPay/PayConfig/components/PayConfigProperties";
import styles from "@/pages/thirdPay/PayConfig/PayConfig.less";

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

const PayConfig:React.FC<{}> = () => {
  const {payConfigGroup, loading, hasError, errorMessage, getPayConfigGroup} = useModel('thirdPay.PayConfig.PayConfigModel');
  const [localPayGroupData, setLocalPayGroupData] = useState<PayConfigGroup[]>([]);
  const [payConfigGroupItem, setPayConfigGroupItem] = useState<ReactNodeArray>([]);
  const [queryPayConfigGroup] = useState<QueryPayConfigGroup>({ activeState: 1, configStatus:1, payPlat: undefined });
  const [checkedGroupId, setCheckedGroupId] = useState<number>(0);
  const [checkedGroupVersion, setCheckedGroupVersion] = useState<number>(0);
  const [checkedGroupPlatName, setCheckedGroupPlatName] = useState<string>('');
  const [checkedRefreshCommand, setCheckedRefreshCommand] = useState<string>('');

  useEffect(() => {
    getPayConfigGroup(queryPayConfigGroup);
  }, []);

  useEffect(() => {
    if(payConfigGroup.length > 0){
      setLocalPayGroupData(payConfigGroup);
    }
  }, [payConfigGroup]);

  useEffect(() => {
    if(localPayGroupData.length > 0){
      initListRender(localPayGroupData);
    }
  }, [localPayGroupData]);

  // 构建列表对象
  const initListRender = (tmpArr: PayConfigGroup[]): void => {
    const arr: any[] = [];
    tmpArr.forEach(item => {
      arr.push(generatorRenderItem(item));
    });
    setPayConfigGroupItem(arr);
  };

  // 点击卡片执行的逻辑
  const checkNowLiItem = (checkGroupId: number, checkGroupVersion: number, checkGroupPlayName: string, checkRefreshCommand: string) => {
    if(checkGroupId === checkedGroupId){
      return;
    }
    setCheckedGroupId(checkGroupId);
    setCheckedGroupVersion(checkGroupVersion);
    setCheckedGroupPlatName(checkGroupPlayName);
    setCheckedRefreshCommand(checkRefreshCommand);
    handleRenderCheckLi(checkGroupId);
  };

  // 更改渲染上的样式
  const handleRenderCheckLi = (checkGroupId: number) => {
    const tmpArr: PayConfigGroup[] = [];
    localPayGroupData.forEach(item => {
      if(checkGroupId && item.id === checkGroupId){
        item.checked = true;
      }else{
        item.checked = false;
      }
      tmpArr.push(item);
    });
    setLocalPayGroupData(tmpArr);
  };

  // 渲染图标
  const renderPayPlatIconAndText = (plat: string): ReactNode => {
    let node: ReactNode = <></>;
    switch (plat) {
      case PayPlatEnum.WX_PAY:
        node = <span className={styles.payGroupIcon}><WechatOutlined /></span>;
        break;
      case PayPlatEnum.IOS_APP:
        node = <span className={styles.payGroupIcon}><AppleOutlined /></span>;
        break;
      case PayPlatEnum.ALI_PAY:
        node = <span className={styles.payGroupIcon}><AlipayCircleOutlined /></span>;
        break;
      default:
        node = <span className={styles.payGroupIcon}><PropertySafetyOutlined /></span>;
    }
    return node;
  };

  const generatorRenderItem = (itemData: PayConfigGroup) => {
    return <li key={itemData.id}>
      <Card
        hoverable={!itemData.checked}
        className={itemData.checked ? styles.hoverOnLi : ''}
      >
        <Row justify="space-around" align="middle">
          <Col span={21} className={styles.pointer} onClick={() => {checkNowLiItem(itemData.id, itemData.configVersion, itemData.payPlatName, itemData.refreshCommand)}}>
            <Space key={'space' + itemData.id} size="large">
              {renderPayPlatIconAndText(itemData.payPlat)}
              <span className={styles.payGroupNameText}>{itemData.payPlatName}</span>
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
                            onClick={() => {getPayConfigGroup(queryPayConfigGroup)}}>
                            重试
                          </Button>
                        }
                      />
                      :
                      <>
                        {
                          payConfigGroupItem.length > 0 ?
                            <QueueAnim className={[`${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')} component="ul" type={['left', 'right']} leaveReverse>
                              {
                                payConfigGroupItem
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
                                  onClick={() => {getPayConfigGroup(queryPayConfigGroup)}}>
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
          <PayConfigProperties
            parentPayGroupId={checkedGroupId}
            parentPayGroupName={checkedGroupPlatName}
            parentPayGroupVersion={checkedGroupVersion}
            refreshCommand={checkedRefreshCommand}
          />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default PayConfig;
