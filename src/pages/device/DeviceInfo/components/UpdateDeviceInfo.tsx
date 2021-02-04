import React, {ReactNodeArray, useEffect, useState} from "react";
import {history} from "@@/core/history";
import {PageContainer} from "@ant-design/pro-layout";
import {useModel} from "@@/plugin-model/useModel";
import DeviceInfoDetailClass from "@/pages/device/DeviceInfo/DeviceInfoDetailClass";
import {DeviceDetailEntity} from "@/pages/device/DeviceInfo/data";
import FormValueDiffOrigin from "@/utils/forms/FormValueDiffOrigin";
import {
  Alert,
  Badge,
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popover,
  Result,
  Row,
  Select,
  Space,
  Tooltip,
  Upload
} from "antd";
import QueueAnim from "rc-queue-anim";
import {
  EnvironmentOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  RollbackOutlined,
  SaveOutlined
} from "@ant-design/icons";
import ProSkeleton from "@ant-design/pro-skeleton";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import {SignBodyServer} from "@/pages/fileManager/data";
import {getUploadSign, removeAliFileToServer} from "@/pages/fileManager/service";
import {assign as _assign, filter as _filter} from "lodash";
import styles from "@/pages/device/DeviceInfo/DeviceInfo.less";
import AmapComponments from "@/components/amap/AmapComponments";
import {MapData} from "@/services/PublicInterface";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
    md: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 11 },
    md: { span: 10 },
  },
};

const UpdateDeviceInfo: React.FC<{}> = () => {
  const {deviceInfoDetail,
    screenConfig,
    loading,
    queryLoading,
    hasError,
    errorMessage,
    alertTipsShow,
    alertTipsMessage,
    alertTipsType,
    alertTipsHandle,
    clearInfo,
    initModelInfo,
    getScreenConfigPropertiesFromServer,
    updateDeviceInfoToServer,
    getRecordByPrimaryKeyFromServer} = useModel("device.DeviceInfo.DeviceInfoDetailModel");
  const [localDeviceDetailInfo, setLocalDeviceDetailInfo] = useState<DeviceDetailEntity|undefined>();
  const [hasChange, setHasChange] = useState<boolean>(false);
  const [deviceInfoForm] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string>();
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [actionHost, setActionHost] = useState<string>('');
  const [picFileList, setPicFileList] = useState<any[]>([]);
  const [extraData, setExtraData] = useState<any>();
  const [tipsShowState, setTipsShowState] = useState<boolean>(false);
  const [tipsTitleState, setTipsTitleState] = useState<string>('无法更改');
  const [tipsContentState, setTipsContentState] = useState<any>(<div>出现错误无法保存</div>);
  const [tipsTypeState, setTipsTypeState] = useState<'success' | 'info' | 'warning' | 'error' | undefined>('error');
  const [defaultLabelList, setDefaultLabelList] = useState<ReactNodeArray>([]);

  const pathHash = history.location;
  // 初始化地址栏参数查询
  const initQuery = () => {
    const { query } = pathHash
    const deviceId: any = query?.deviceId;
    getScreenConfigPropertiesFromServer();
    if(deviceId && deviceId.trim() !== ''){
      getRecordByPrimaryKeyFromServer(deviceId);
    }else{
      clearInfo();
    }
  };

  const initFormInfo = (info: DeviceDetailEntity|undefined) => {
    initModelInfo();
    if(!info){
      info = new DeviceInfoDetailClass(undefined).initDeviceInfo();
    }else{
      info.screenMaxSourceCount = screenConfig?.screenMaxSourceCount || 20
      deviceInfoForm.setFieldsValue(info);
      setPicFileList(info.pictureList);
      setHasChange(false);
    }
  };

  const generatorDefaultLabelOption = () => {
    const arr: ReactNodeArray = [];
    screenConfig?.labelList.forEach(item => {
      arr.push(<Select.Option key={item.key} value={item.key}>{item.value}</Select.Option>);
    });
    setDefaultLabelList(arr);
  };

  useEffect(() => {
    initQuery();
  },[]);

  useEffect(() => {
    if(deviceInfoDetail){
      setLocalDeviceDetailInfo(new DeviceInfoDetailClass(deviceInfoDetail).initDeviceInfo());
    }else{
      setLocalDeviceDetailInfo(new DeviceInfoDetailClass(undefined).initDeviceInfo());
    }
  }, [deviceInfoDetail]);

  useEffect(() => {
    initFormInfo(localDeviceDetailInfo);
  }, [localDeviceDetailInfo]);

  useEffect(() => {
    if(screenConfig && screenConfig.labelList){
      generatorDefaultLabelOption();
    }
  }, [screenConfig]);

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

  // 表单字段变动
  const onValuesChange = (changedValues: any, allValues: any) => {
    if(!localDeviceDetailInfo){
      setHasChange(true);
      return;
    }
    if(FormValueDiffOrigin(changedValues, allValues, localDeviceDetailInfo)){
      setHasChange(false);
    }else{
      setHasChange(true);
    }
  };

  // 查询表单提交
  const onFinish = (values: any) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '确定提交信息？',
      onOk: async () => {
        setTipsShowState(false);
        const success = await updateDeviceInfoToServer(_assign({}, values));
        if(success){
          setHasChange(false);
          setTimeout(() => {
            clearInfo();
            history.push("/device/deviceInfo");
          }, 3000);
        }else{
          scrollToAnchor('deviceTipsTop');
        }
      },
    });
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

  const generatorStatusLabel = (status: number) => {
    if(status === 1) {
      return <Badge color='blue' text="正在部署" />
    }else if(status === 2){
      return <Badge color='green' text="已部署使用" />
    }else if(status === 3){
      return <Badge color='red' text="故障停机" />
    }else if(status === 4){
      return <Badge color='black' text="拆机移除" />
    }else{
      return <Badge color='yellow' text="计划部署" />
    }
  };

  const normFile = (e: any) => {
    if (e.file.status) {
      if (e.file.status === 'done') {
        e.fileList = e.fileList.map((file: any) => {
          if (file.response) {
            file = _assign({} , {
              id: 0,
              url: file.response.url,
              sortNo: 1,
              fileObjectKey: file.response.filename,
              bucketName: file.response.bucket,
              fileId: file.response.fileId,
              filePath: file.response.url,
              fileName: file.name,
              status: 'done',
              percent: 100,
              key: file.uid,
              uid: file.uid
            });
          }
          return file;
        });
        return e && e.fileList;
      } else if(e.file.status === 'error'){
        const newFileList = _filter(e.fileList, (item: any) => { return item.status === 'done'; });
        return e && newFileList;
      }else if(e.file.status === 'removed'){
        if(!e.file.id || e.file.id === 0){
          removeAliFileToServer({
            fileId: e.file.fileId
          }).then(res => {
            if (res.code === 200) {
            } else {
              console.warn('file remove error,please confirm')
            }
          }).catch(e => {
            console.error('file remove error,please confirm');
          });
        }
        return e && e.fileList;
      }
    }
  };

  const handlePreview = async (file: any) => {
    setPreviewImage("");
    setPreviewImage(file.url);    //这个图片路径根据自己的情况而定
    setPreviewVisible(true);
  };

  const getSign = async (): Promise<SignBodyServer | undefined> => {
    let path = 'img/goodsImg/';
    return await getUploadSign({path: path, accessType: 'public'}).then(res => {
      if (res.code === 200) {
        setActionHost(res.data?.host || '');
        return res.data;
      } else {
        message.warning('获取上传签名发生错误:' + res.message);
        return undefined;
      }
    }).catch(e => {
      console.error('[upload error!]', e);
      message.error('获取上传签名发生错误，上传失败');
      return undefined;
    });
  };

  const judgeIllegal = (file: any): boolean => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error({key: 'checkFileTips', content: '只能上传jpg和png格式的图片'});
      return false;
    }
    const maxSize = file.size / 1024 > (screenConfig?.maxImageSize || 512);
    if (maxSize) {
      message.error({key: 'checkFileTips', content: `单张图片大小不得超过 ${screenConfig?.maxImageSize || 512} Kb`});
      return false;
    }
    return true;
  };

  const beforeUpload = async (file: any) => {
    setActionHost("http://nononono");
    if (!judgeIllegal(file)) {
      return false;
    }
    const existsFile = picFileList.find(item => {
      return item.fileName === file.name;
    })
    if(existsFile){
      message.error({key: 'checkFileTips', content: `文件【${file.name}】已存在，请勿重复选取`});
      return false;
    }
    const signObj = await getSign();
    if (!signObj) {
      message.error({key: 'checkFileTips', content: '获取上传签名失败，无法上传'});
      return false;
    }
    const tmpData = {
      'x:access_type': 'public',
      'x:file_part_type': 'ALL',
      'x:file_part_no': '1',
      'x:file_part_last': 'YES',
      'x:cache_var': 'max-age=604800',
      'x:uid_var': file.uid,
      'x:file_id_var': signObj.fileId,
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
    setPicFileList([...picFileList, file]);
    return file;
  };

  const getMapData = (mapData: MapData) => {
    const address = mapData.province
      + '|' + mapData.city + '|'
      + mapData.district + '|'
      + mapData.township + (mapData.street ? ('|' + mapData.street) : '');
    deviceInfoForm.setFieldsValue({
      screenPositionLong: mapData.lng,
      screenPositionLati: mapData.lat,
      screenAddress: address
    });
    if(FormValueDiffOrigin(null, deviceInfoForm.getFieldsValue(), localDeviceDetailInfo)){
      setHasChange(false);
    }else{
      setHasChange(true);
    }
  };

  const mapContent = (
    <div key="mapDiv" style={{ width: '800px', height: '400px'}}>
      <AmapComponments
        lng={deviceInfoForm.getFieldValue('screenPositionLong') || 0}
        lat={deviceInfoForm.getFieldValue('screenPositionLati') || 0}
        backData={getMapData}
        zoom={15}
      />
    </div>
  );

  return (
    <PageContainer fixedHeader>
      <a href="#" id="deviceTipsTop" />
      <QueueAnim style={{ marginTop: '20px'}}
                 animConfig={[
                   { opacity: [1, 0], translateY: [0, 50] },
                   { opacity: [1, 0], translateY: [0, -50] }
                 ]}>
        {
          alertTipsShow ? <Alert
            key='tipsShow'
            message={alertTipsMessage}
            showIcon
            type={alertTipsType}
            closeText={<div
              onClick={() => {alertTipsHandle('info', '', false)}}>
              我知道了
            </div>
            }
          /> : null
        }
      </QueueAnim>
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
                    clearInfo();
                    history.push("/device/deviceInfo");
                  }}>返回</Button>
                  <Button type="primary" icon={<ReloadOutlined />} danger loading={queryLoading} onClick={initQuery}>重试</Button>
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
                      localDeviceDetailInfo?.id ? '编辑屏幕信息' : '新增屏幕信息'
                    }
                  </Divider>
                  <Form
                    {...formItemLayout}
                    form={deviceInfoForm}
                    name="deviceInfoFormMain"
                    validateMessages={ValidateMessages}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    onValuesChange={onValuesChange}
                  >
                    <Row gutter={[16, 16]}>
                      <Col md={12} xs={24} style={{ padding: '20px'}}>
                        <Form.Item
                          name="id"
                          label='id'
                          hidden
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label='状态'
                          tooltip={<Tooltip title=''>
                            屏幕当前的状态值
                          </Tooltip>}
                        >
                          {generatorStatusLabel(deviceInfoForm.getFieldValue("screenStatus"))}
                        </Form.Item>
                        <Form.Item
                          name="screenName"
                          label='屏幕名称'
                          hasFeedback
                          tooltip={<Tooltip title=''>
                            屏幕的名称说明，不超过32字
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
                          <Input />
                        </Form.Item>

                        <Form.Item
                          name="screenInstaller"
                          label='安装人员'
                          hasFeedback
                          tooltip={<Tooltip title=''>
                            负责安装屏幕的人员姓名
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
                          <Input />
                        </Form.Item>

                        <Form.Item
                          name="screenInstallerPhone"
                          label='人员电话'
                          hasFeedback
                          tooltip={<Tooltip title=''>
                            负责安装屏幕的人员的电话号码
                          </Tooltip>}
                          rules={[
                            { required: true, min: 6, max: 16},
                            ({ getFieldValue }) => ({
                              validator(rule, value) {
                                const pattern = /^[0-9+]+[0-9\-]+[0-9]+$/g;
                                if (value && pattern.test(value)) {
                                  return Promise.resolve();
                                }
                                return Promise.reject('只能输入数字和 - ,开头和结尾不能为 -');
                              },
                            })
                          ]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label="尺寸"
                          name="screenSize"
                          tooltip={<Tooltip title=''>
                            安裝的屏幕的尺寸
                          </Tooltip>}
                          rules={[
                            { required: true },
                            { type: 'number', min: 0, max: 2000 }
                          ]}
                        >
                          <InputNumber
                            formatter={(value: any) => `${value}英寸`}
                            parser={(value: any) => value.replace('英寸', '')}
                            style={{ width: '50%' }}
                            max={2000}
                            min={1}
                            precision={1}
                          />
                        </Form.Item>

                        <Form.Item
                          label="资源数"
                          name="screenMaxSourceCount"
                          tooltip={<Tooltip title=''>
                            当前设备所能承载的资源数，超过之后将不可购买和添加任务
                          </Tooltip>}
                          rules={[
                            { required: true },
                            { type: 'number', min: 0, max: 2000 }
                          ]}
                        >
                          <InputNumber
                            style={{ width: '50%' }}
                            max={2000}
                            min={1}
                            precision={0}
                          />
                        </Form.Item>

                        <Form.Item
                          name="screenLabel"
                          label='标签'
                          hasFeedback
                          tooltip={<Tooltip title=''>
                            负责安装屏幕的人员的电话号码
                          </Tooltip>}
                          rules={[
                            { required: true }
                          ]}
                        >
                          <Select mode="tags" style={{ width: '100%' }} placeholder="请输入或选择标签">
                            {
                              defaultLabelList
                            }
                          </Select>
                        </Form.Item>
                        <Form.Item required label="屏幕地址">
                          <Row>
                            <Col span={20}>
                              <Form.Item
                                name="screenAddress"
                                hasFeedback
                                tooltip={<Tooltip title=''>
                                  线下实体屏幕所存放的位置
                                </Tooltip>}
                                noStyle
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
                                <Input readOnly disabled />
                              </Form.Item>
                            </Col>
                            <Col span={4}>
                              <div>
                                <Popover destroyTooltipOnHide={true} placement="right" title="选择地址" content={mapContent} trigger="click">
                                  <EnvironmentOutlined style={{ color: 'red', fontSize: '30px'}} />
                                </Popover>
                              </div>
                            </Col>
                          </Row>
                        </Form.Item>

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

                        <Form.Item
                          name="screenTips"
                          label='说明'
                          hasFeedback
                          tooltip={<Tooltip title=''>
                            简要的说明信息和备注信息，不超过512字
                          </Tooltip>}
                          rules={[
                            { required: true, min: 4, max: 512},
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
                          <Input.TextArea allowClear showCount maxLength={512} rows={3} />
                        </Form.Item>
                      </Col>

                      <Col md={12} xs={24} style={{ padding: '20px'}}>
                        <Row>
                          <Col span={24}>
                            <Divider orientation="left">屏幕参数</Divider>
                            <Form.List
                              name="propertiesList"
                              rules={[
                                {
                                  validator: async (rule, value) => {
                                    const limit = screenConfig?.minPropertiesCount || 3;
                                    const max = screenConfig?.maxPropertiesCount || 10;
                                    if(limit > 0){
                                      if (!value || value.length < limit) {
                                        return Promise.reject(new Error(`至少要存在${limit}个参数`));
                                      }
                                    }
                                    if(max > 0){
                                      if (!value || value.length > max) {
                                        return Promise.reject(new Error(`最多填写${max}个参数`));
                                      }
                                    }
                                    return Promise.resolve();
                                  },
                                },
                              ]}
                            >
                              {(fields, { add, remove }, {errors}) => (
                                <>
                                  <Form.Item>
                                    <Space>
                                      <Button type="dashed" onClick={() => add({sortNo: 1}, fields.length)} block icon={<PlusOutlined />}>
                                        增加参数
                                      </Button>
                                      <span>总计 {fields.length} 条</span>
                                      <Form.ErrorList errors={errors} />
                                    </Space>
                                  </Form.Item>
                                  <div className={[`${styles.propertiesDiv}`, `${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')}>
                                  {
                                    fields.map(field => (
                                      <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                          {...field}
                                          labelCol={{
                                            span: 5
                                          }}
                                          wrapperCol={{
                                            span: 19
                                          }}
                                          validateTrigger={['onChange', 'onBlur']}
                                          label="标签"
                                          name={[field.name, 'propertiesLabel']}
                                          fieldKey={[field.fieldKey, 'propertiesLabel']}
                                          rules={[{ required: true, message: '参数名不能为空' }]}
                                        >
                                          <Input placeholder="请输入参数名称" />
                                        </Form.Item>
                                        <Form.Item
                                          {...field}
                                          labelCol={{
                                            span: 5
                                          }}
                                          wrapperCol={{
                                            span: 19
                                          }}
                                          validateTrigger={['onChange', 'onBlur']}
                                          label="值"
                                          name={[field.name, 'propertiesValue']}
                                          fieldKey={[field.fieldKey, 'propertiesValue']}
                                          rules={[{ required: true, message: '参数值必须输入' }]}
                                        >
                                          <Input placeholder="请输入参数值" />
                                        </Form.Item>
                                        <Form.Item
                                          {...field}
                                          labelCol={{
                                            span: 8
                                          }}
                                          wrapperCol={{
                                            span: 16
                                          }}
                                          validateTrigger={['onChange', 'onBlur']}
                                          label="顺序"
                                          name={[field.name, 'sortNo']}
                                          fieldKey={[field.fieldKey, 'sortNo']}
                                          rules={[{ required: true, message: '排序不能为空' }]}
                                        >
                                          <InputNumber min={0} max={999} precision={0} />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                                      </Space>
                                    ))
                                  }
                                  </div>
                                </>
                              )}
                            </Form.List>
                          </Col>
                          <Col span={24}>
                            <Divider orientation="left">图片信息</Divider>
                            <Form.Item
                              labelCol={{
                                span: 2
                              }}
                              wrapperCol={{
                                span: 22
                              }}
                              name="pictureList"
                              label="图片"
                              valuePropName="fileList"
                              getValueFromEvent={normFile}
                              rules={[
                                { required: true },
                                ({ getFieldValue }) => ({
                                  validator(rule, value) {
                                    if(value && value.length < 1){
                                      return Promise.reject(`图片至少上传1张`);
                                    }
                                    if(value && value.length > (screenConfig?.maxImageCount || 5)){
                                      return Promise.reject(`图片数量不能超过${screenConfig?.maxImageCount || 5}张`);
                                    }
                                    return Promise.resolve();
                                  },
                                })
                              ]}
                            >
                              <Upload
                                name="file"
                                action={actionHost}
                                beforeUpload={beforeUpload}
                                onPreview={handlePreview}
                                fileList={picFileList}
                                data={extraData}
                                multiple
                                listType="picture-card"
                              >
                                {picFileList.length < (screenConfig?.maxImageCount || 10) && '+ 选择文件图片'}
                              </Upload>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <div>
                      <Space size="large">
                        <Button shape="round" icon={<SaveOutlined />} type="primary" htmlType="submit" disabled={!hasChange} loading={loading}>
                          {
                            localDeviceDetailInfo?.id ? '保存' : '新增'
                          }
                        </Button>
                        <Button shape="round" icon={<RollbackOutlined />} type="default" loading={loading} onClick={() => {
                          clearInfo();
                          history.push("/device/deviceInfo");
                        }}>返回</Button>
                        {
                          hasChange && localDeviceDetailInfo?.id && localDeviceDetailInfo.id.trim() !== '' ? <Button
                            type="link"
                            icon={<RollbackOutlined />}
                            onClick={() => {
                              initFormInfo(localDeviceDetailInfo);
                            }}
                          >
                            还原更改
                          </Button> : null
                        }
                      </Space>
                    </div>
                  </Form>
                </div>
            }
          </>
      }
      <Modal
        visible={previewVisible}
        title='预览照片'
        width='80%'
        footer={null}
        onCancel={() => {
          setPreviewVisible(false);
        }}
      >
        <img alt="example" style={{width: '100%', objectFit: 'contain'}} src={previewImage}/>
      </Modal>
    </PageContainer>
  );
};

export default UpdateDeviceInfo;
