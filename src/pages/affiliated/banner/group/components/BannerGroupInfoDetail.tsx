import {BannerGroupInfo} from "@/pages/affiliated/banner/group/data";
import {useModel} from "@@/plugin-model/useModel";
import {Button, Col, Form, Input, Modal, Row, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import {SaveOutlined} from "@ant-design/icons";
import FormValueDiffOrigin from "@/utils/forms/FormValueDiffOrigin";
import {assign as _assign} from 'lodash';
import {RollbackOutlined} from "@ant-design/icons/lib";


export interface BannerGroupInfoDetailProps {
  bannerGroupInfo?: BannerGroupInfo;
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
const BannerGroupInfoDetail: React.FC<BannerGroupInfoDetailProps> = (props) => {
  const {bannerGroupInfo, titleText, showModal, modalWidth, footer, maskClosable, onCloseModal} = props;
  const {loading, updateBannerGroupInfoToServer} = useModel('affiliated.banner.group.BannerGroupInfoModel');
  const [updateForm] = Form.useForm();
  const [hasChange, setHasChange] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);

  const initFormInfoValue = () => {
    if (bannerGroupInfo) {
      updateForm.setFieldsValue(bannerGroupInfo);
      setIsAdd(false);
    } else {
      updateForm.resetFields();
      setIsAdd(true);
    }
  };

  useEffect(() => {
    initFormInfoValue();
  }, [bannerGroupInfo]);


  // 表单字段变动
  const onValuesChange = (changedValues: any, allValues: any) => {
    if (!bannerGroupInfo) {
      setHasChange(true);
      return;
    }
    if (FormValueDiffOrigin(changedValues, allValues, bannerGroupInfo)) {
      setHasChange(false);
    } else {
      setHasChange(true);
    }
  };

  // 表单提交
  const onFinish = (values: BannerGroupInfo) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '是否确认提交数据？',
      onOk: async () => {
        const obj: BannerGroupInfo = _assign({}, bannerGroupInfo, values);
        const success = await updateBannerGroupInfoToServer(obj);
        if (success) {
          updateForm.resetFields();
          onCloseModal(true);
        } else {
          onCloseModal(false);
        }
      },
    });
  };

  return (
    <Modal
      key='userInfo'
      visible={showModal}
      title={titleText || (isAdd ? '新增分組' : '编辑分組')}
      maskClosable={maskClosable}
      width={modalWidth || '40%'}
      footer={footer || null}
      onCancel={() => {
        setHasChange(false);
        onCloseModal(false);
      }}
    >
      <div>
        {
          hasChange ? <Button
            type="link"
            icon={<RollbackOutlined/>}
            onClick={() => {
              initFormInfoValue();
            }}
          >
            还原更改
          </Button> : null
        }
        <Form
          {...formItemLayout}
          form={updateForm}
          name="bannerGroupInfoDetail"
          validateMessages={ValidateMessages}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
        >
          <Form.Item
            name="groupName"
            label='分组名称'
            hasFeedback
            wrapperCol={{span: 8}}
            tooltip={<Tooltip title=''>
              分组名称
            </Tooltip>}
            rules={[
              {required: true, min: 2, max: 64}]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            name="remarkTips"
            label='备注说明'
            hasFeedback
            wrapperCol={{span: 8}}
            tooltip={<Tooltip title=''>
              备注说明
            </Tooltip>}
          >
            <Input/>
          </Form.Item>
          <Row style={{marginTop: '10px'}}>
            <Col md={7} xs={3}/>
            <Col md={3} xs={8} style={{textAlign: 'right'}}>
              <Button shape="round" icon={<SaveOutlined/>} type="primary" htmlType="submit" disabled={!hasChange}
                      loading={loading}>{isAdd ? '添加' : '保存'}</Button>
            </Col>
            <Col md={3} xs={8} offset={1} style={{textAlign: 'left'}}>
              <Button shape="round" type="default" loading={loading} onClick={() => {
                onCloseModal(false);
              }}>取消</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default BannerGroupInfoDetail;
