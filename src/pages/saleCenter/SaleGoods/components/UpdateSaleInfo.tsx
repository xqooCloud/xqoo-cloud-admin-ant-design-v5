import React, {ReactNodeArray, useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {history} from "@@/core/history";
import {GoodsDetailVo, GoodsPicture} from "@/pages/saleCenter/SaleGoods/data";
import {getSaleInfoDetail, updateSaleInfo} from "@/pages/saleCenter/SaleGoods/service";
import {
  Button,
  Col,
  Descriptions,
  Divider,
  Result,
  Row,
  Space,
  Table,
  Image,
  Alert,
  InputNumber,
  Form,
  Input, Tooltip, Modal
} from "antd";
import {ReloadOutlined, RetweetOutlined, RollbackOutlined, SaveOutlined} from "@ant-design/icons";
import ProSkeleton from "@ant-design/pro-skeleton";
import AmapComponments from "@/components/amap/AmapComponments";
import {assign as _assign, sortBy as _sortBy} from 'lodash';
import QueueAnim from "rc-queue-anim";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import FormValueDiffOrigin from "@/utils/forms/FormValueDiffOrigin";
import styles from "@/pages/saleCenter/SaleGoods/SaleGoods.less";
import CheckScreenInfo from "@/pages/device/DeviceInfo/components/CheckScreenInfo";

const fallbackImage = 'data:image/png;base64,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';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    md: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 10 },
    sm: { span: 10 },
    md: { span: 13 },
  },
};

const UpdateSaleInfo:React.FC<{}> = () => {
  const [localDetailInfo, setLocalDetailInfo] = useState<GoodsDetailVo|undefined>(undefined);
  const [saleDetailInfoForm] = Form.useForm();
  const [hasChange, setHasChange] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [queryLoading, setQueryLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('发生错误，请稍后重试');
  const [tipsShowState, setTipsShowState] = useState<boolean>(false);
  const [tipsTitleState, setTipsTitleState] = useState<string>('无法更改');
  const [tipsContentState, setTipsContentState] = useState<any>(<div>出现错误无法保存</div>);
  const [tipsTypeState, setTipsTypeState] = useState<'success' | 'info' | 'warning' | 'error' | undefined>('error');
  const [updateData, setUpdateData] = useState<boolean>(false);
  const [picListData, setPicListData] = useState<GoodsPicture[]>([]);
  const [picListItem, setPicListItem] = useState<ReactNodeArray>([]);

  const pathHash = history.location;

  // 初始化地址栏参数查询
  const initQuery = () => {
    const { query } = pathHash
    const goodsId: any = query?.goodsId;
    if(goodsId && goodsId.trim() !== ''){
      setUpdateData(true);
      setQueryLoading(true);
      setHasError(false)
      getSaleInfoDetail(goodsId).then(res => {
        setQueryLoading(false);
        if(res.code === 200){
          setLocalDetailInfo(_assign({}, res.data));
          const picArr: GoodsPicture[] = res.data?.pictureList || [];
          setPicListData(picArr.slice());
          initFormInfo(_assign({}, res.data));
        }else{
          setHasError(true);
          setErrorMessage(res.message);
        }
      }).catch(e => {
        setHasError(true);
        setErrorMessage('查询发生异常，请稍后再试');
        setQueryLoading(false);
      });
    }else{
      setUpdateData(false);
    }
  };

  const initFormInfo = (data: GoodsDetailVo|undefined) => {
    setHasChange(false);
    setHasError(false);
    setTipsShowState(false);
    if(data){
      saleDetailInfoForm.setFieldsValue(data);
      setPicListData(data?.pictureList || []);
    }
  };

  useEffect(() => {
    if(picListData){
      generatorScreePic();
    }
  }, [picListData]);

  useEffect(() => {
    initQuery();
  },[]);

  // 滚动到指定位置
  const scrollToAnchor = (anchorName: string) => {
    if (anchorName) {
      let anchorElement = document.getElementById(anchorName);
      if(anchorElement) {
        anchorElement.scrollIntoView(
          {behavior: 'smooth'}
        );
      }
    }
  };

  const sortNoChange = (picId: number, sortValue: any) => {
    const pictureList: GoodsPicture[] = [];
    picListData.forEach(item => {
      if(item.id === picId){
        item.sortNo = sortValue;
      }
      pictureList.push(item);
    });
    setPicListData(pictureList);
    setHasChange(true);
  };

  const generatorScreePic = () => {
    const picList = _sortBy(picListData, (item) => { return item.sortNo });
    if(picList){
      const arr: ReactNodeArray = [];
      picList.forEach(item => {
        arr.push(<li key={item.id}>
          <Image
            key={item.fileId}
            width={100}
            height={100}
            src={item.filePath}
            alt={item.fileName}
            fallback={fallbackImage}
          />
          <div className={styles.imageSort}>
            <InputNumber
              key={item.id}
              style={{ width: '100%', textAlign: 'center'}}
              size="small"
              min={0}
              max={999}
              precision={0}
              value={item.sortNo}
              onChange={(value) => {
                sortNoChange(item.id, value);
              }}
            />
          </div>
        </li>);
      });
      setPicListItem(arr);
    }else{
      setPicListItem([]);
    }
  };

  // 表单字段变动
  const onValuesChange = (changedValues: any, allValues: any) => {
    if(!localDetailInfo){
      setHasChange(true);
      return;
    }
    if(FormValueDiffOrigin(changedValues, allValues, localDetailInfo)){
      setHasChange(false);
    }else{
      setHasChange(true);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    setTipsShowState(true);
    setTipsTypeState('error');
    setTipsTitleState('请完善表单');
    new Promise((resolve) => {
      const msg: ReactNodeArray = [];
      errorInfo.errorFields.forEach((item: { name: any[]; errors: any[]; })=> {
        msg.push(<div>{item.errors.join(',')}<br /></div>);
      })
      resolve(msg);
    }).then(res => {
      setTipsContentState(<div>表单校验有误：{res}</div>);
    }).catch(e => {
      console.warn('表单校验不通过', e)
      setTipsContentState(`表单校验有误：校验不通过无法提交`);
    })
  };

  // 查询表单提交
  const onFinish = (values: any) => {
    const submitData: GoodsDetailVo = _assign({}, localDetailInfo, values);
    if(!submitData.screenId){
      setTipsShowState(true);
      setTipsTypeState('error');
      setTipsTitleState('没有选择对应的屏幕信息，请选择后保存');
      return;
    }
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '确定提交信息？',
      onOk: () => {
        setLoading(true);
        updateSaleInfo(submitData).then(res => {
          setLoading(false);
          if(res.code === 200){
            setHasChange(false);
            setTipsShowState(true);
            setTipsTypeState('success');
            setTipsTitleState('保存成功，即将跳转...');
            setTipsContentState('将加在3秒后跳转至列表页面');
            setTimeout(() => {
              history.push("/saleCenter/saleGoods");
            }, 3000);
          }else{
            setTipsShowState(true);
            setTipsTypeState('error');
            setTipsTitleState('保存失败');
            setTipsContentState(res.message);
            scrollToAnchor('saleTipsTop');
          }
        }).catch(e => {
          setLoading(false);
          setTipsShowState(true);
          setTipsTypeState('error');
          setTipsTitleState('保存失败');
          setTipsContentState('执行过程发生错误，请重试');
          scrollToAnchor('saleTipsTop');
        });
      },
    });
  };

  const recheckScreen = () => {
    setLocalDetailInfo(undefined);
    setUpdateData(false);
    setPicListData([]);
    saleDetailInfoForm.resetFields();
    setHasChange(false);
  };

  const checkedScreenData = (data: any) => {
    setLocalDetailInfo(_assign({}, localDetailInfo, data));
    setUpdateData(true);
    initFormInfo(_assign({}, data));
    if(data.pictureList && data.pictureList.length > 0){
      setPicListData(data.pictureList.slice());
    }
  };

  return (
    <PageContainer fixedHeader>
      <a href="#" id="saleTipsTop" />
      <div>
        {
          tipsShowState ? <Alert
            key='tipsShow'
            message={tipsTitleState}
            description={tipsContentState}
            type={tipsTypeState}
            showIcon
            closable
            closeText={<div
              onClick={() => { setTipsShowState(false);}}>
              我知道了
            </div>
            }
          /> : null
        }
        {
          hasError ?
            <div className={styles.operationDiv} style={{minHeight: '350px'}}>
              <Result
                status="error"
                title="查询发生了错误"
                subTitle={errorMessage}
                extra={
                  <Space size='large'>
                    <Button type="default" icon={<RollbackOutlined />} loading={loading} onClick={() => {
                      history.push("/saleCenter/saleGoods");
                    }}>返回</Button>
                    <Button type="primary" icon={<ReloadOutlined />} danger loading={loading} onClick={initQuery}>重试</Button>
                  </Space>
                }
              />
            </div>
            :
            <>
              {
                queryLoading ?
                  <div className={styles.operationDiv} style={{minHeight: '500px'}}>
                    <ProSkeleton type="descriptions" />
                  </div>
                  :
                  <div className={styles.operationDiv}>
                    <Divider orientation="left">
                      {
                        localDetailInfo ? '编辑商品信息' : '新增商品信息'
                      }
                    </Divider>
                    {
                      updateData ?
                        <div>
                          <Row>
                            {
                              !localDetailInfo?.goodsId ?
                                <Col span={24}>
                                  <div style={{ width: '100%', textAlign: 'center'}}>
                                    <Button type="primary" danger icon={<RetweetOutlined />} onClick={recheckScreen}>重新选择屏幕</Button>
                                  </div>
                                  <Divider />
                                </Col>
                                : null
                            }
                            <Col md={12} xs={24}>
                              <Descriptions title="屏幕信息">
                                <Descriptions.Item span={2} label="屏幕名字">{localDetailInfo?.screenName}</Descriptions.Item>
                                <Descriptions.Item label="屏幕尺寸">{localDetailInfo?.screenSize} 寸</Descriptions.Item>
                                <Descriptions.Item span={3} label="屏幕所处地址">{localDetailInfo?.screenAddress}</Descriptions.Item>
                                <Descriptions.Item span={3} label="屏幕参数">
                                  <Table
                                    size="small"
                                    pagination={false}
                                    dataSource={localDetailInfo?.propertiesList}
                                    scroll={{ y: 230, scrollToFirstRowOnChange: true }}
                                    rowKey={record => record.id}
                                  >
                                    <Table.Column align="center" title="参数名" width={200} dataIndex="propertiesLabel" key="propertiesLabel" />
                                    <Table.Column align="center"  title="参数值" width={200} dataIndex="propertiesValue" key="propertiesValue" />
                                  </Table>
                                </Descriptions.Item>
                              </Descriptions>
                            </Col>
                            <Col md={12} xs={24}>
                              <div>
                                <AmapComponments zoom={15} readonly lat={localDetailInfo?.screenPositionLati} lng={localDetailInfo?.screenPositionLong}/>
                              </div>
                            </Col>
                          </Row>
                          {
                            picListItem.length > 0 ?
                              <div key="picListDiv">
                                <Divider orientation="left">
                                  屏幕图片
                                </Divider>
                                <Alert showIcon message="排序第一的则为封面" type="info" />
                                <Image.PreviewGroup>
                                  <QueueAnim key="picQueueKey" className={styles.imageUl} component="ul" type={['left', 'right']} leaveReverse>
                                    {
                                      picListItem
                                    }
                                    <br style={{ clear: 'both'}}/>
                                  </QueueAnim>
                                </Image.PreviewGroup>
                              </div>
                              :
                              <div key="noPicListDiv">
                                <Result
                                  status="info"
                                  title="暂无图片"
                                />
                              </div>
                          }
                        </div>
                        :
                        <div>
                          <Alert showIcon type="info" message="请先选择一块可用的屏幕信息"/>
                          <CheckScreenInfo backData={checkedScreenData} />
                        </div>
                    }
                    <Divider orientation="left">
                      填写商品信息
                    </Divider>
                    <div>
                      <Form
                        {...formItemLayout}
                        form={saleDetailInfoForm}
                        name="saleDetailInfoForm"
                        validateMessages={ValidateMessages}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        onValuesChange={onValuesChange}
                      >
                        <Row justify="space-around" align="middle">
                          <Col md={6} xs={24}>
                            <Form.Item
                              label="商品名字"
                              name="saleTitle"
                              hasFeedback
                              tooltip={<Tooltip title=''>
                                商品的展示标题，不超过32字
                              </Tooltip>}
                              rules={[
                                { required: true, min: 2, max: 32},
                                ({ getFieldValue }) => ({
                                  validator(rule, value) {
                                    const pattern = new RegExp("[$%^&+=\\[\\]~！￥…*（）—{}【】‘；：”“’。，、？]")
                                    if (!value || !pattern.test(value)) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject('不可输入特殊字符');
                                  },
                                })
                              ]}
                            >
                              <Input placeholder="请输入商品标题" />
                            </Form.Item>
                          </Col>
                          <Col md={6} xs={24}>
                            <Form.Item
                              label="覆盖范围"
                              name="overPeople"
                              tooltip={<Tooltip title=''>
                                覆盖的人群基数范围
                              </Tooltip>}
                              rules={[
                                { required: true },
                                { type: 'number', min: 0, max: 2000 }
                              ]}
                            >
                              <InputNumber
                                formatter={(value: any) => `${value}百人`}
                                parser={(value: any) => value.replace('百人', '')}
                                style={{ width: '80%' }}
                                max={2000}
                                min={1}
                                precision={0}
                              />
                            </Form.Item>
                          </Col>
                          <Col md={6} xs={24}>
                            <Form.Item
                              label="售卖单价"
                              name="salePrice"
                              tooltip={<Tooltip title=''>
                                售卖的单价
                              </Tooltip>}
                              rules={[
                                { required: true },
                                { type: 'number', min: 0.1 }
                              ]}
                            >
                              <InputNumber
                                formatter={(value: any) => `${value}元`}
                                parser={(value: any) => value.replace('元', '')}
                                style={{ width: '80%' }}
                                min={0.1}
                                precision={2}
                              />
                            </Form.Item>
                          </Col>

                          <Col md={6} xs={0} />

                          <Col md={6} xs={24}>
                            <Form.Item
                              label="经度坐标"
                              name="screenPositionLong"
                              tooltip={<Tooltip title=''>
                                屏幕所在位置的经度坐标值
                              </Tooltip>}
                              rules={[
                                { required: true },
                                { type: 'number'}
                              ]}
                            >
                              <InputNumber
                                readOnly
                                disabled
                                formatter={(value: any) => `${value}°`}
                                parser={(value: any) => value.replace('°', '')}
                                style={{ width: '50%' }}
                                max={180}
                                min={-180}
                                precision={6}
                              />
                            </Form.Item>
                          </Col>

                          <Col md={6} xs={24}>
                            <Form.Item
                              label="纬度坐标"
                              name="screenPositionLati"
                              tooltip={<Tooltip title=''>
                                屏幕所在位置的纬度坐标值
                              </Tooltip>}
                              rules={[
                                { required: true },
                                { type: 'number'}
                              ]}
                            >
                              <InputNumber
                                readOnly
                                disabled
                                formatter={(value: any) => `${value}°`}
                                parser={(value: any) => value.replace('°', '')}
                                style={{ width: '50%' }}
                                max={90}
                                min={-90}
                                precision={6}
                              />
                            </Form.Item>
                          </Col>

                          <Col md={12} xs={0} />

                          <Col md={2} xs={8} style={{textAlign: 'left'}}>
                            <Space size="large">
                              <Button shape="round" icon={<SaveOutlined />} type="primary" htmlType="submit" disabled={!hasChange} loading={loading}>
                                {
                                  localDetailInfo ? '保存' : '新增'
                                }
                              </Button>
                              <Button shape="round" icon={<RollbackOutlined />} type="default" loading={loading} onClick={() => {
                                history.push("/saleCenter/saleGoods");
                              }}>返回</Button>
                              {
                                hasChange && localDetailInfo && localDetailInfo.goodsId ? <Button
                                  type="link"
                                  icon={<RollbackOutlined />}
                                  onClick={() => {
                                    initFormInfo(localDetailInfo);
                                  }}
                                >
                                  还原更改
                                </Button> : null
                              }
                            </Space>
                          </Col>
                          <Col md={17} xs={0} />
                        </Row>
                      </Form>
                    </div>
                  </div>
              }
            </>
        }
      </div>
    </PageContainer>
  );
};
export default UpdateSaleInfo;
