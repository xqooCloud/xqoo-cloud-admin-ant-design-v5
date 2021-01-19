import {useModel} from "@@/plugin-model/useModel";
import {Button, Col, Form, Input, Modal, Row, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import {SaveOutlined} from "@ant-design/icons";
import FormValueDiffOrigin from "@/utils/forms/FormValueDiffOrigin";
import {assign as _assign} from 'lodash';
import {FooterNavDetailInfo} from "@/pages/affiliated/FooterNavInfo/data";
import {CustomIconMap} from "@/maps/IconMaps/CustomIconMap";
import IconModal from "@/components/IconUtil/IconModal";


export interface FooterNavDetailInfoDetailProps {
  footerNavDetailInfo?: FooterNavDetailInfo;
  titleText?: string;
  showModal: boolean;
  groupName: string;
  groupId: number;
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

const FooterNavDetail: React.FC<FooterNavDetailInfoDetailProps> = (props) => {
  const {footerNavDetailInfo, titleText, showModal, modalWidth, footer, maskClosable, onCloseModal,groupName,groupId} = props;
  const {footerNavDetailInfoList, updateFooterNavDetailInfoToServer, addFooterNavDetailInfoToServer, loading} = useModel('affiliated.FooterNavInfo.FooterNavDetailInfoModel');
  const [updateForm] = Form.useForm();
  const [hasChange, setHasChange] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [iconPrefix, setIconPrefix] = useState('SmileOutlined');
  const [iconModalVisible, setIconModalVisible] = useState<boolean>(false);

  const initFormInfoValue = () => {
    if (footerNavDetailInfo) {
      updateForm.setFieldsValue(footerNavDetailInfo);
      setIsAdd(false);
    } else {
      updateForm.resetFields();
      setIsAdd(true);
    }
  };

  useEffect(() => {
    initFormInfoValue();
  }, [footerNavDetailInfoList]);
  useEffect(() => {
    initFormInfoValue();
  }, [footerNavDetailInfo]);


  // 表单字段变动
  const onValuesChange = (changedValues: any, allValues: any) => {
    if (!footerNavDetailInfo) {
      setHasChange(true);
      return;
    }
    if (FormValueDiffOrigin(changedValues, allValues, footerNavDetailInfo)) {
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
        const obj: FooterNavDetailInfo = _assign({}, footerNavDetailInfo, {groupName:groupName},{groupId: groupId}, values);
        debugger
        let success = false;
        if (isAdd) {
          success = await addFooterNavDetailInfoToServer(obj);
        } else {
          success = await updateFooterNavDetailInfoToServer(obj);
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
      title={titleText || (isAdd ? '新增脚页' : '编辑脚页')}
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
        name="footerNavDetailInfoDetail"
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
            脚页名称
          </Tooltip>}
          rules={[
            {required: true}
          ]}
          initialValue={groupName}
        >
          <Input disabled={true}/>
        </Form.Item>
        <Form.Item
          name="labelText"
          label='脚页名称'
          hasFeedback
          wrapperCol={{span: 6}}
          tooltip={<Tooltip title=''>
            脚页名称
          </Tooltip>}
          rules={[
            {required: true}
          ]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          name="labelTitle"
          label='文字描述'
          wrapperCol={{span: 8}}
          tooltip={<Tooltip title=''>
            文字描述
          </Tooltip>}
        >
          <Input/>
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
          name="sortNo"
          label='显示顺序'
          hasFeedback
          wrapperCol={{span: 4}}
          tooltip={<Tooltip title=''>
            显示顺序
          </Tooltip>}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label='图标'
          hasFeedback
          wrapperCol={{span: 4}}
          tooltip={<Tooltip title=''>
            选择图标
          </Tooltip>}
        >
          <Row>
            <Col md={7} xs={24}>
              <Form.Item
                name="icon"
              >
                <Input readOnly prefix={CustomIconMap[iconPrefix]} />
              </Form.Item>
            </Col>
            <Col md={6} xs={24}>
              <Button type='link' onClick={
                () => {setIconModalVisible(true)}
              }>点击选择图标</Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          name="remarkTips"
          label='备注提示'
          hasFeedback
          wrapperCol={{span: 7}}
          tooltip={<Tooltip title=''>
            备注提示
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
      <IconModal
        key='iconModal'
        showModal={iconModalVisible}
        modalWidth="50%"
        maskClosable={false}
        onCloseModal={() => {
          setIconModalVisible(false);
        }}
        onOkModal={() => {
          setIconModalVisible(false);
        }}
        onClickIcon={(iconObj) => {
          setIconModalVisible(false);
          setIconPrefix(iconObj);
          updateForm.setFieldsValue({ icon: iconObj});
        }}
      />
    </Modal>
  );
};

export default FooterNavDetail;
