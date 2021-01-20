import {useModel} from "@@/plugin-model/useModel";
import React, {useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {Alert, Button, Col, Divider, Form, Input, Modal, Result, Row, Space, Table, Tooltip} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {assign as _assign} from "lodash";
import {EmailTemplateInfo, QueryEmailTemplateInfo} from "@/pages/email/EmailTemplate/data";
import {FileAddOutlined} from "@ant-design/icons";
import styles from "./index.less";
import EmailTemplateInfoDetail from "@/pages/email/EmailTemplate/components/EmailTemplateInfoDetail";

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

const EmailTemplate: React.FC<{}> = () => {
  const { emailTemplateList, totalElements,
    loading, hasError, errorMessage, alertTipsShow, alertTipsMessage, alertTipsType, getEmailTemplateFromServer, deleteEmailTemplateByKey, alertTipsHandle} = useModel('email.EmailTemplate.EmailTemplateModel');
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<QueryEmailTemplateInfo>({page: 1, pageSize: 20});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [checkEmailTemplate, setcheckEmailTemplate] = useState<EmailTemplateInfo|undefined>(undefined);

  useEffect(() => {
    getEmailTemplateFromServer(queryParams);
  }, []);

  const columns: ColumnsType<EmailTemplateInfo> = [
    {
      title: '记录id',
      dataIndex: 'id',
      width: 100,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '邮件模板名称',
      dataIndex: 'templateName',
      align: 'center',
      ellipsis: true,
      render: (templateName: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={templateName}>
          {templateName}
        </Tooltip>
      ),
    },
    {
      title: '邮件标题',
      dataIndex: 'emailSubject',
      align: 'center',
      ellipsis: true,
      render: (emailSubject: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={emailSubject}>
          {emailSubject}
        </Tooltip>
      ),
    },
    {
      title: '邮件内容',
      dataIndex: 'emailText',
      align: 'center',
      ellipsis: true,
      render: (emailText: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={emailText}>
          {emailText}
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      fixed: 'right',
      width: 180,
      render: (text, row, index) => (
        <Space size="small">
          <a onClick={ () => {updateEmailTemplate(row)}}>编辑</a>
          <a onClick={ async () => {deleteEmailTemplate(row.id)}}>删除</a>
        </Space>
      ),
    },
  ];

  // 查询表单提交
  const onFinish = (values: any) => {
    getEmailTemplateFromServer(_assign(queryParams, values));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setQueryParams(pageNowInfo);
    getEmailTemplateFromServer(_assign(pageNowInfo, queryForm.getFieldsValue()));
  };


  const updateEmailTemplate = (emailTemplate?: EmailTemplateInfo) => {
    if(emailTemplate){
      setcheckEmailTemplate(emailTemplate);
    }else{
      setcheckEmailTemplate(undefined);
    }
    setShowModal(true);
  };

  const deleteEmailTemplate = async (id: number) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确定操作',
      content: '是否确认删除数据？',
      onOk: () => {
        deleteEmailTemplateByKey(id).then(res => {
          if(res){
            getEmailTemplateFromServer(_assign(queryParams, queryForm.getFieldsValue()))
          }
        }).catch(e => {
          console.error('[delete EmailTemplate error!]', e)
        });
      },
    });
  };

  const closeModal = (result: boolean) => {
    setShowModal(false);
    if(result){
      getEmailTemplateFromServer(_assign(queryParams, queryForm.getFieldsValue()))
    }
  };

  return (
    <PageContainer fixedHeader>
      <div className={styles.operationDiv}>
        <Form
          {...formItemLayout}
          form={queryForm}
          name="loginHistoryQueryForm"
          onFinish={onFinish}
        >
          <Row justify="space-around" align="middle">
            <Col md={5} xs={24}>
              <Form.Item
                label="模板名称"
                name="templateName">
                <Input placeholder="请输入邮件模板名称，支持模糊查询" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="邮件标题"
                name="emailSubject">
                <Input placeholder="请输入邮件标题，支持模糊查询" />
              </Form.Item>
            </Col>
            <Col md={9} xs={0}/>
            <Col md={2} xs={8} style={{textAlign: 'left'}}>
              <Space size="large">
                <Button type='primary' htmlType="submit" loading={loading}>查询</Button>
                <Button type='default' loading={loading} onClick={() => { queryForm.resetFields()}}>重置</Button>
              </Space>
            </Col>
            <Col md={17} xs={0} />
          </Row>
        </Form>
      </div>
      <div style={{marginTop: '15px'}}>
        {
          alertTipsShow ? <Alert
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
      </div>
      <div className={styles.tableDiv}>
        <Button type="primary" loading={loading} icon={<FileAddOutlined />} onClick={() => {updateEmailTemplate()}}>新增模板</Button>
        <Divider />
        {
          hasError ?
            <Result
              status="error"
              title="查询发生了错误"
              subTitle={errorMessage}
            />
            :
            <Table<EmailTemplateInfo>
              size="small"
              columns={columns}
              rowKey={record => record.id}
              dataSource={emailTemplateList}
              pagination={{
                size: 'small',
                total: totalElements,
                current: queryParams.page,
                pageSize: queryParams.pageSize,
                pageSizeOptions: ['20','40'],
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => {return `总条数${total}条`},
              }}
              loading={loading}
              scroll={{ x: 900, scrollToFirstRowOnChange: true }}
              onChange={handleTableChange}
            />
        }
      </div>
      <EmailTemplateInfoDetail emailTemplateInfo={checkEmailTemplate} onCloseModal={closeModal} showModal={showModal} maskClosable={false}/>
    </PageContainer>
  );
};

export default EmailTemplate;
