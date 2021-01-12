import { EmailConfigInfo} from "@/pages/email/EmailConfig/data";
import {useModel} from "@@/plugin-model/useModel";
import {Button, Col, Form, Input,  Modal, Row, Tooltip} from "antd";
import React, { useEffect, useState} from "react";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import {SaveOutlined} from "@ant-design/icons";
import FormValueDiffOrigin from "@/utils/forms/FormValueDiffOrigin";
import {assign as _assign} from 'lodash';


export interface EmailConfInfoDetailProps {
  emailConfigInfo?: EmailConfigInfo;
  titleText?: string;
  showModal: boolean;
  modalWidth?: string | number;
  footer?: any;
  maskClosable: boolean;
  onCloseModal: (success: boolean) => void;
}

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

const EmailConfigInfoDetail: React.FC<EmailConfInfoDetailProps> = (props) => {
  const {emailConfigInfo, titleText, showModal, modalWidth, footer, maskClosable, onCloseModal} = props;
  const { loading,  updateEmailConfigToServer} = useModel('email.EmailConfig.EmailConfigModel');
  const [updateForm] = Form.useForm();
  const [hasChange, setHasChange] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);

  const initFormInfoValue = () => {
    if(emailConfigInfo){
      updateForm.setFieldsValue(emailConfigInfo);
      setIsAdd(false);
    }else{
      updateForm.resetFields();
      setIsAdd(true);
    }
  };

  useEffect(() => {
    initFormInfoValue();
  }, [emailConfigInfo]);


  // 表单字段变动
  const onValuesChange = (changedValues: any, allValues: any) => {
    if(!emailConfigInfo){
      setHasChange(true);
      return;
    }
    if(FormValueDiffOrigin(changedValues, allValues, emailConfigInfo)){
      setHasChange(false);
    }else{
      setHasChange(true);
    }
  };

  // 表单提交
  const onFinish = (values: EmailConfigInfo) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '是否确认提交数据？',
      onOk: async () => {
        const obj: EmailConfigInfo = _assign({}, emailConfigInfo, values);
        const success = await updateEmailConfigToServer(obj);
        if(success){
          updateForm.resetFields();
          onCloseModal(true);
        }else{
          onCloseModal(false);
        }
      },
    });
  };


  return (
    <Modal
      key='userInfo'
      visible={showModal}
      title={titleText || (isAdd ? '新增邮件配置': '编辑邮件配置')}
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
          name="configKey"
          label='邮件配置key'
          hasFeedback
          wrapperCol={{span: 8}}
          tooltip={<Tooltip title=''>
            此值邮件配置key，最大不可超过64字
          </Tooltip>}
          rules={[
            { required: true, min: 2, max: 64}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="configValue"
          label='邮件配置值'
          hasFeedback
          wrapperCol={{span: 8}}
          tooltip={<Tooltip title=''>
            邮件配置值，不能输入一些特殊符号
          </Tooltip>}
          rules={[
            { required: true, min: 2, max: 128},
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
          name="emailGroup"
          label='邮件配置所属组'
          hasFeedback
          wrapperCol={{span: 8}}
          tooltip={<Tooltip title=''>
            配置所属组
          </Tooltip>}
        >
          <Input />
        </Form.Item>
        <Row style={{marginTop: '10px'}}>
          <Col md={7} xs={3}/>
          <Col md={3} xs={8} style={{textAlign: 'right'}}>
            <Button shape="round" icon={<SaveOutlined />} type="primary" htmlType="submit" disabled={!hasChange} loading={loading}>{isAdd ? '添加': '保存'}</Button>
          </Col>
          <Col md={3} xs={8} offset={1} style={{textAlign: 'left'}}>
            <Button shape="round" type="default" loading={loading} onClick={() => {
              onCloseModal(false);
            }}>取消</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EmailConfigInfoDetail;
