import {AgreementInfo} from "@/pages/affiliated/agreement/data";
import {useModel} from "@@/plugin-model/useModel";
import {Button, Col, Form, Input, Modal, Row, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import ValidateMessages from "@/utils/forms/ValidateMessages";
import {SaveOutlined} from "@ant-design/icons";
import FormValueDiffOrigin from "@/utils/forms/FormValueDiffOrigin";
import {assign as _assign} from 'lodash';
import {RollbackOutlined} from "@ant-design/icons/lib";
import E from 'wangeditor';


export interface AgreementInfoDetailProps {
  agreementInfo?: AgreementInfo;
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
const AgreementInfoDetail: React.FC<AgreementInfoDetailProps> = (props) => {
  const {agreementInfo, titleText, showModal, modalWidth, footer, maskClosable, onCloseModal} = props;
  const {loading, updateAgreementToServer} = useModel('affiliated.agreement.AgreementInfoModel');
  const [updateForm] = Form.useForm();
  const [hasChange, setHasChange] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const tmpEditor = new E('.editorElem-menu', '.editorElem-body');
  const [editor, setEditor] = useState<E>(tmpEditor);
  const [hasCreate, setHasCreate] = useState<boolean>(false);
  tmpEditor.config.menus = [
    'head',  // 标题
    'bold',  // 粗体
    'fontSize',  // 字号
    'fontName',  // 字体
    'italic',  // 斜体
    'underline',  // 下划线
    'strikeThrough',  // 删除线
    'foreColor',  // 文字颜色
    'backColor',  // 背景颜色
    'link',  // 插入链接
    'list',  // 列表
    'justify',  // 对齐方式
    'quote',  // 引用
    'emoticon',  // 表情
    // 'image',  // 插入图片
    'table',  // 表格
    // 'video',  // 插入视频
    // 'code',  // 插入代码
    'undo',  // 撤销
    'redo'  // 重复
  ];
  tmpEditor.config.uploadImgShowBase64 = true;

  useEffect(() => {
    if (showModal) {
      if (!hasCreate) {
        tmpEditor.config.onchange = (html: any) => {
          console.log(tmpEditor.txt.html())
          if (agreementInfo && tmpEditor.txt.html() != agreementInfo.agreementContent) {
            setHasChange(true);
          }
        }
        tmpEditor.create();
        if (agreementInfo) {
          tmpEditor.txt.html("<p>" + agreementInfo.agreementContent + "</p>");
        }
        setHasCreate(true);
        setEditor(tmpEditor);
      }
      if (agreementInfo) {
        editor.txt.html("<p>" + agreementInfo.agreementContent + "</p>");
      } else {
        editor.txt.html("<p></p>");
      }
    }
  }, [showModal]);

  const initFormInfoValue = () => {
    if (agreementInfo) {
      editor.txt.html("<p>" + agreementInfo.agreementContent + "</p>");
      updateForm.setFieldsValue(agreementInfo);
      setIsAdd(false);
    } else {
      editor.txt.html("<p></p>");
      updateForm.resetFields();
      setIsAdd(true);
    }
  };

  useEffect(() => {
    initFormInfoValue();
  }, [agreementInfo]);


  // 表单字段变动
  const onValuesChange = (changedValues: any, allValues: any) => {
    if (!agreementInfo) {
      setHasChange(true);
      return;
    }
    if (FormValueDiffOrigin(changedValues, allValues, agreementInfo)) {
      setHasChange(false);
    } else {
      setHasChange(true);
    }
  };

  // 表单提交
  const onFinish = (values: AgreementInfo) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '是否确认提交数据？',
      onOk: async () => {
        const obj: AgreementInfo = _assign({}, agreementInfo, values);
        obj.agreementContent = editor.txt.html() + "";
        const success = await updateAgreementToServer(obj);
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
      title={titleText || (isAdd ? '新增协议' : '编辑数协议')}
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
          name="agreementDetail"
          validateMessages={ValidateMessages}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
        >
          <Form.Item
            name="agreementKey"
            label='协议key值'
            hasFeedback
            wrapperCol={{span: 8}}
            tooltip={<Tooltip title=''>
              协议key值，不可重复
            </Tooltip>}
            rules={[
              {required: true, min: 2, max: 64}]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            name="agreementContent"
            label='协议内容'
            hasFeedback
            wrapperCol={{span: 8}}
            tooltip={<Tooltip title=''>
              协议内容
            </Tooltip>}
          >
          </Form.Item>
          <div className="text-area">
            <div
              style={{backgroundColor: '#f1f1f1', border: "1px solid #ccc"}}
              className="editorElem-menu">
            </div>
            {/* <div style={{padding: '5px 0', color: '#ccc'}}>中间隔离带</div> */}
            <div
              style={{
                height: 300,
                border: "1px solid #ccc",
                borderTop: "none"
              }}
              className="editorElem-body">
            </div>
          </div>
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

export default AgreementInfoDetail;
