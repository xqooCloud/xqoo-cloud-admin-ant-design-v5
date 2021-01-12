import {useModel} from "@@/plugin-model/useModel";
import React, {useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {Alert, Button, Col, Divider, Form, Input, Modal, Result, Row, Space, Table, Tooltip} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {assign as _assign} from "lodash";
import {EmailConfigInfo, QueryEmailConfigInfo} from "@/pages/email/EmailConfig/data";
import {FileAddOutlined} from "@ant-design/icons";
import styles from "./index.less";
import EmailConfigInfoDetail from "@/pages/email/EmailConfig/components/EmailConfigInfoDetail";

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

const EmailConfig: React.FC<{}> = () => {
  const { emailConfigList, totalElements,
    loading, hasError, errorMessage, alertTipsShow, alertTipsMessage, alertTipsType, getEmailConfigFromServer, deleteEmailConfigByKey, alertTipsHandle} = useModel('email.EmailConfig.EmailConfigModel');
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<QueryEmailConfigInfo>({page: 1, pageSize: 20});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [checkEmailConfig, setcheckEmailConfig] = useState<EmailConfigInfo|undefined>(undefined);

  useEffect(() => {
    getEmailConfigFromServer(queryParams);
  }, []);

  const columns: ColumnsType<EmailConfigInfo> = [
    {
      title: '记录id',
      dataIndex: 'id',
      width: 100,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '邮件配置key',
      dataIndex: 'configKey',
      align: 'center',
      ellipsis: true,
      render: (configKey: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={configKey}>
          {configKey}
        </Tooltip>
      ),
    },
    {
      title: '邮件配置值',
      dataIndex: 'configValue',
      align: 'center',
      ellipsis: true,
      render: (configValue: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={configValue}>
          {configValue}
        </Tooltip>
      ),
    },
    {
      title: '邮件配置组',
      dataIndex: 'emailGroup',
      align: 'center',
      ellipsis: true,
      render: (emailGroup: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={emailGroup}>
          {emailGroup}
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
          <a onClick={ () => {updateEmailConfig(row)}}>编辑</a>
          <a onClick={ async () => {deleteEmailConfig(row.id)}}>删除</a>
        </Space>
      ),
    },
  ];

  // 查询表单提交
  const onFinish = (values: any) => {
    getEmailConfigFromServer(_assign(queryParams, values));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setQueryParams(pageNowInfo);
    getEmailConfigFromServer(_assign(pageNowInfo, queryForm.getFieldsValue()));
  };


  const updateEmailConfig = (emailConfig?: EmailConfigInfo) => {
    if(emailConfig){
      setcheckEmailConfig(emailConfig);
    }else{
      setcheckEmailConfig(undefined);
    }
    setShowModal(true);
  };

  const deleteEmailConfig = async (id: number) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确定操作',
      content: '是否确认删除数据？',
      onOk: () => {
        deleteEmailConfigByKey(id).then(res => {
          if(res){
            getEmailConfigFromServer(_assign(queryParams, queryForm.getFieldsValue()))
          }
        }).catch(e => {
          console.error('[delete emailConfig error!]', e)
        });
      },
    });
  };

  const closeModal = (result: boolean) => {
    setShowModal(false);
    if(result){
      getEmailConfigFromServer(_assign(queryParams, queryForm.getFieldsValue()))
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
                label="邮件配置key"
                name="configKey">
                <Input placeholder="请输入邮件配置key，支持模糊查询" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="邮件配置组"
                name="emailGroup">
                <Input placeholder="请输入配置组，支持模糊查询" />
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
        <Button type="primary" loading={loading} icon={<FileAddOutlined />} onClick={() => {updateEmailConfig()}}>新增配置</Button>
        <Divider />
        {
          hasError ?
            <Result
              status="error"
              title="查询发生了错误"
              subTitle={errorMessage}
            />
            :
            <Table<EmailConfigInfo>
              size="small"
              columns={columns}
              rowKey={record => record.id}
              dataSource={emailConfigList}
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
      <EmailConfigInfoDetail emailConfigInfo={checkEmailConfig} onCloseModal={closeModal} showModal={showModal} maskClosable={false}/>
    </PageContainer>
  );
};

export default EmailConfig;
