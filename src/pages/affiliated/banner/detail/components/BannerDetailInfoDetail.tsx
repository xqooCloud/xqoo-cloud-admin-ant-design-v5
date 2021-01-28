import {BannerDetailInfo} from "@/pages/affiliated/banner/detail/data";
import {useModel} from "@@/plugin-model/useModel";
import {Button, Col, Form, Input, Modal, Row, Select, Tooltip, Switch} from "antd";
import React, {ReactNode, useEffect, useState} from "react";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import {SaveOutlined} from "@ant-design/icons";
import FormValueDiffOrigin from "@/utils/forms/FormValueDiffOrigin";
import {assign as _assign} from 'lodash';
import ImageUpload from "@/pages/fileManager/components/ImageUpload";


export interface BannerDetailInfoProps {
  bannerDetailInfo?: BannerDetailInfo;
  titleText?: string;
  showModal: boolean;
  modalWidth?: string | number;
  footer?: any;
  maskClosable: boolean;
  onCloseModal: (success: boolean) => void;
}

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8},
    md: {span: 6},
  },
  wrapperCol: {
    xs: {span: 10},
    sm: {span: 10},
    md: {span: 13},
  },
};

const BannerDetailInfoDetail: React.FC<BannerDetailInfoProps> = (props) => {
  const {bannerDetailInfo, titleText, showModal, modalWidth, footer, maskClosable, onCloseModal} = props;
  const {bannerGroup, loading, updateBannerDetailInfoToServer} = useModel('affiliated.banner.detail.BannerDetailInfoModel');
  const [updateForm] = Form.useForm();
  const [hasChange, setHasChange] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [initImageArr, setInitImageArr] = useState<any[]>([]);
  const [uploadArr, setUploadArr] = useState<any[]>([]);

  const initFormInfoValue = () => {
    if (bannerDetailInfo) {
      updateForm.setFieldsValue(bannerDetailInfo);
      const newFileList: any[] = [];
      let obj = {
        id: bannerDetailInfo.id,
        url: bannerDetailInfo.mediaUrl,
        status: 'done',
        percent: 100
      }
      newFileList.push(obj);
      setInitImageArr(newFileList);
    } else {
      updateForm.resetFields();
      setIsAdd(true);
    }
  };

  useEffect(() => {
    initFormInfoValue();
  }, [bannerDetailInfo]);

  const resetForm = () => {
    if (bannerDetailInfo) {
      updateForm.setFieldsValue(bannerDetailInfo);
      setIsAdd(false);
    } else {
      updateForm.resetFields();
      setIsAdd(true);
    }
    setHasChange(false);
  };

  // 表单字段变动
  const onValuesChange = (changedValues: any, allValues: any) => {
    if (!bannerDetailInfo) {
      setHasChange(true);
      return;
    }
    if (FormValueDiffOrigin(changedValues, allValues, bannerDetailInfo)) {
      setHasChange(false);
    } else {
      setHasChange(true);
    }
  };

  // 表单提交
  const onFinish = (values: BannerDetailInfo) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '是否确认提交数据？',
      onOk: async () => {
        if (uploadArr.length > 0) {
            values.mediaUrl=uploadArr[0].url;
        }
        const obj: BannerDetailInfo = _assign({}, bannerDetailInfo, values);
        const success = await updateBannerDetailInfoToServer(obj);
        if (success) {
          updateForm.resetFields();

          onCloseModal(true);
        } else {
          onCloseModal(false);
        }
      },
    });
  };

  const bannerGroupTypeGen = (): ReactNode[] => {
    const arr: ReactNode[] = [];
    bannerGroup.forEach(item => {
      arr.push(
        <Select.Option key={item.id} value={item.id}>{item.groupName}</Select.Option>
      );
    })
    return arr;
  };
  const uploaded = (arr: any[]) => {
    if (arr.length > 0) {
      setUploadArr(arr);
      setHasChange(true);
    }
  };

  return (
    <Modal
      key='bannerDetailInfo'
      visible={showModal}
      title={titleText || (isAdd ? '新增轮播图' : '编辑轮播图')}
      maskClosable={maskClosable}
      width={modalWidth || '40%'}
      footer={footer || null}
      onCancel={() => {
        onCloseModal(false);
      }}
    >
      <Form
        {...formItemLayout}
        form={updateForm}
        name="dataSourceDetail"
        validateMessages={ValidateMessages}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <Form.Item
          name="groupId"
          label='分组类型'
          hasFeedback
          wrapperCol={{span: 7}}
          tooltip={<Tooltip title=''>
            选择一个数据源类型
          </Tooltip>}
          rules={[
            {required: true}
          ]}
        >
          <Select allowClear placeholder="请选择类型">
            {bannerGroupTypeGen()}
          </Select>
        </Form.Item>
        <Form.Item
          name="groupId"
          label='分组类型'
          hasFeedback
          wrapperCol={{span: 7}}
          tooltip={<Tooltip title=''>
            选择一个数据源类型
          </Tooltip>}
          rules={[
            {required: true}
          ]}
        >
          <Select allowClear placeholder="请选择类型">
            {bannerGroupTypeGen()}
          </Select>
        </Form.Item>
        <Form.Item
          label='上传图片'
          hasFeedback
          wrapperCol={{span: 7}}
          tooltip={<Tooltip title=''>
            选择一个数据源类型
          </Tooltip>}
        >
          <ImageUpload maxImageNumber={1}
                       initImageArr={initImageArr}
                       uploadedCallback={uploaded} accessType="public"/>
        </Form.Item>
        <Form.Item
          name="redirectValue"
          label='重定向值'
          hasFeedback
          wrapperCol={{span: 10}}
          tooltip={<Tooltip title=''>
            点击事件重定向的值，最长512字符
          </Tooltip>}
          rules={[
            {required: true, min: 2, max: 512}]}
        >
          <Input/>
        </Form.Item>
        {/*<Form.Item*/}
        {/*  name="mediaUrl"*/}
        {/*  label='资源链接'*/}
        {/*  hasFeedback*/}
        {/*  wrapperCol={{span: 10}}*/}
        {/*  tooltip={<Tooltip title=''>*/}
        {/*    资源链接*/}
        {/*  </Tooltip>}*/}
        {/*  rules={[*/}
        {/*    {required: true, min: 2, max: 255}]}*/}
        {/*>*/}
        {/*  <Input/>*/}
        {/*</Form.Item>*/}
        <Form.Item
          name="bannerTips"
          label='图片提示'
          hasFeedback
          wrapperCol={{span: 10}}
          tooltip={<Tooltip title=''>
            前端tips或title展示语句，不超过64字
          </Tooltip>}
          rules={[
            {required: true, min: 2, max: 255}]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="sortNo"
          label='排序'
          hasFeedback
          wrapperCol={{span: 7}}
          tooltip={<Tooltip title=''>
            排序
          </Tooltip>}
        >
          <Input type={"number"}/>
        </Form.Item>
        <Form.Item name="activeCode" label="是否可用" valuePropName="checked">
          <Switch/>
        </Form.Item>
        <Row style={{marginTop: '10px'}}>
          <Col md={7} xs={3}/>
          <Col md={3} xs={8} style={{textAlign: 'right'}}>
            <Button shape="round" icon={<SaveOutlined/>} type="primary" htmlType="submit" disabled={!hasChange}
                    loading={loading}>{isAdd ? '添加' : '保存'}</Button>
          </Col>
          <Col md={3} xs={8} offset={1} style={{textAlign: 'left'}}>
            <Button shape="round" type="default" loading={loading} onClick={() => {
              resetForm();
              onCloseModal(false);
            }}>取消</Button>
          </Col>
          <Col md={3} xs={8} offset={1} style={{textAlign: 'left'}}>
            {
              hasChange ?
                <Button shape="round" danger loading={loading} onClick={resetForm}>还原更改</Button>
                :
                null
            }
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default BannerDetailInfoDetail;
