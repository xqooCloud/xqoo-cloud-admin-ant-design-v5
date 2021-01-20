import { EmailTemplateInfo} from "@/pages/email/EmailTemplate/data";
import {useModel} from "@@/plugin-model/useModel";
import {Button, Col, Form, Input,  Modal, Row, Tooltip} from "antd";
import React, { useEffect, useState} from "react";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import {SaveOutlined} from "@ant-design/icons";
import FormValueDiffOrigin from "@/utils/forms/FormValueDiffOrigin";
import {assign as _assign} from 'lodash';


export interface EmailTemplateDetailProps {
  emailTemplateInfo?: EmailTemplateInfo;
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

const EmailTemplateInfoDetail: React.FC<EmailTemplateDetailProps> = (props) => {
  const {emailTemplateInfo, titleText, showModal, modalWidth, footer, maskClosable, onCloseModal} = props;
  const { loading,  updateEmailTemplateToServer} = useModel('email.EmailTemplate.EmailTemplateModel');
  const [updateForm] = Form.useForm();
  const [hasChange, setHasChange] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);

  const initFormInfoValue = () => {
    if(emailTemplateInfo){
      updateForm.setFieldsValue(emailTemplateInfo);
      setIsAdd(false);
    }else{
      updateForm.resetFields();
      setIsAdd(true);
    }
  };

  useEffect(() => {
    initFormInfoValue();
  }, [emailTemplateInfo]);


  // 表单字段变动
  const onValuesChange = (changedValues: any, allValues: any) => {
    if(!emailTemplateInfo){
      setHasChange(true);
      return;
    }
    if(FormValueDiffOrigin(changedValues, allValues, emailTemplateInfo)){
      setHasChange(false);
    }else{
      setHasChange(true);
    }
  };

  // 表单提交
  const onFinish = (values: EmailTemplateInfo) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '是否确认提交数据？',
      onOk: async () => {
        const obj: EmailTemplateInfo = _assign({}, emailTemplateInfo, values);
        const success = await updateEmailTemplateToServer(obj);
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
      title={titleText || (isAdd ? '新增邮件模板': '编辑邮件模板')}
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
          name="templateName"
          label='邮件模板名称'
          hasFeedback
          wrapperCol={{span: 8}}
          tooltip={<Tooltip title=''>
            此值邮件模板名称，最大不可超过64字
          </Tooltip>}
          rules={[
            { required: true, min: 2, max: 64}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="emailSubject"
          label='邮件名称'
          hasFeedback
          wrapperCol={{span: 8}}
          tooltip={<Tooltip title=''>
            此值邮件名称，最大不可超过64字
          </Tooltip>}
          rules={[
            { required: true, min: 2, max: 64}]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="emailText"
          label='邮件内容'
          hasFeedback
          wrapperCol={{span: 8}}
          tooltip={<Tooltip title=''>
            此值邮件内容,可变内容请用$[]占位符替代，如手机号码：$[phone]
          </Tooltip>}
        >
          <Input.TextArea />
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

export default EmailTemplateInfoDetail;
