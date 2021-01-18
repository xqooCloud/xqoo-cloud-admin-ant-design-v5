import {useModel} from "@@/plugin-model/useModel";
import {Button, Col, Form, Input, Modal, Row, Switch, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import {SaveOutlined} from "@ant-design/icons";
import FormValueDiffOrigin from "@/utils/forms/FormValueDiffOrigin";
import {assign as _assign} from 'lodash';
import {FooterNavGroupInfo} from "@/pages/affiliated/FooterNav/data";


export interface FooterNavGroupInfoDetailProps {
  footerNavGroupInfo?: FooterNavGroupInfo;
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

const FooterNavGroup: React.FC<FooterNavGroupInfoDetailProps> = (props) => {
  const {footerNavGroupInfo, titleText, showModal, modalWidth, footer, maskClosable, onCloseModal} = props;
  const {footerNavGroupInfoList, updateFooterNavGroupInfoToServer, addFooterNavGroupInfoToServer, loading} = useModel('affiliated.FooterNav.FooterNavGroupInfoModel');
  const [updateForm] = Form.useForm();
  const [hasChange, setHasChange] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);

  const initFormInfoValue = () => {
    if (footerNavGroupInfo) {
      updateForm.setFieldsValue(footerNavGroupInfo);
      setIsAdd(false);
    } else {
      updateForm.resetFields();
      setIsAdd(true);
    }
  };

  useEffect(() => {
    initFormInfoValue();
  }, [footerNavGroupInfoList]);
  useEffect(() => {
    initFormInfoValue();
  }, [footerNavGroupInfo]);


  // 表单字段变动
  const onValuesChange = (changedValues: any, allValues: any) => {
    if (!footerNavGroupInfo) {
      setHasChange(true);
      return;
    }
    if (FormValueDiffOrigin(changedValues, allValues, footerNavGroupInfo)) {
      setHasChange(false);
    } else {
      setHasChange(true);
    }
  };

  // 表单提交
  const onFinish = (values: any) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '是否确认提交数据？',
      onOk: async () => {
        const obj: FooterNavGroupInfo = _assign({}, footerNavGroupInfo, values);
        debugger
        let success = false;
        if (isAdd) {
          success = await addFooterNavGroupInfoToServer(obj);
        } else {
          success = await updateFooterNavGroupInfoToServer(obj);
        }
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
      key='userInfo111'
      visible={showModal}
      title={titleText || (isAdd ? '新增脚页分组' : '编辑脚页分组')}
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
        name="footerNavGroupInfoDetail"
        validateMessages={ValidateMessages}
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
        <Form.Item
          name="groupName"
          label='脚页分组名称'
          hasFeedback
          wrapperCol={{span: 6}}
          tooltip={<Tooltip title=''>
            输入分组名称
          </Tooltip>}
          rules={[
            {required: true}
          ]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          name="needRedirect"
          label='是否可以跳转'
          valuePropName="checked"
          wrapperCol={{span: 8}}
          tooltip={<Tooltip title=''>
            是否可以跳转
          </Tooltip>}
        >
          <Switch checkedChildren="是" unCheckedChildren="否"/>
        </Form.Item>

        <Form.Item
          name="redirectUrl"
          label='跳转URL'
          hasFeedback
          wrapperCol={{span: 7}}
          tooltip={<Tooltip title=''>
            分组跳转URL
          </Tooltip>}
          rules={[
            {required: true, min: 2, max: 128},

            ({getFieldValue}) => ({
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
          <Input/>
        </Form.Item>

        <Form.Item
          name="iconName"
          label='图标'
          hasFeedback
          wrapperCol={{span: 4}}
          tooltip={<Tooltip title=''>
            选择图标
          </Tooltip>}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          name="groupTips"
          label='分组脚页提示'
          hasFeedback
          wrapperCol={{span: 7}}
          tooltip={<Tooltip title=''>
            分组脚页提示
          </Tooltip>}
          rules={[
            {required: true, min: 2, max: 32}
          ]}
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
    </Modal>
  );
};

export default FooterNavGroup;
