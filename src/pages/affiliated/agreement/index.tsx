import {useModel} from "@@/plugin-model/useModel";
import React, { useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {Alert, Button, Col, Divider, Form, Input, Modal, Result, Row, Space, Table, Tooltip} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {assign as _assign} from "lodash";
import {AgreementInfo, QueryAgreementInfo} from "@/pages/affiliated/agreement/data";
import {FileAddOutlined} from "@ant-design/icons";
import styles from "./index.less";
import AgreementInfoDetail from "@/pages/affiliated/agreement/components/AgreementInfoDetail";

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

const Agreement: React.FC<{}> = () => {
  const {
    agreementList, totalElements,
    loading, hasError, errorMessage, alertTipsShow, alertTipsType, alertTipsMessage, getAgreementFromServer, deleteAgreementToServer, alertTipsHandle
  } = useModel('affiliated.agreement.AgreementInfoModel');
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<QueryAgreementInfo>({page: 1, pageSize: 20});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [checkAgreementInfo, setCheckAgreementInfo] = useState<AgreementInfo | undefined>(undefined);

  useEffect(() => {
    getAgreementFromServer(queryParams);
  }, []);

  const columns: ColumnsType<AgreementInfo> = [
    {
      title: '协议key值',
      dataIndex: 'agreementKey',
      align: 'center',
      ellipsis: true,
      render: (agreementKey: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={agreementKey}>
          {agreementKey}
        </Tooltip>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      align: 'center',
      ellipsis: true,
      render: (createDate: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={createDate}>
          {createDate}
        </Tooltip>
      ),
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      align: 'center',
      ellipsis: true,
      render: (createBy: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={createBy}>
          {createBy}
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
          <a onClick={() => {
            updateAgreement(row)
          }}>编辑</a>
          <a onClick={async () => {
            deleteAgreement(row.agreementKey)
          }}>删除</a>
        </Space>
      ),
    },
  ];

  // 查询表单提交
  const onFinish = (values: any) => {
    getAgreementFromServer(_assign(queryParams, values));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setQueryParams(pageNowInfo);
    getAgreementFromServer(_assign(pageNowInfo, queryForm.getFieldsValue()));
  };


  const updateAgreement = (agreementInfo?: AgreementInfo) => {
    if (agreementInfo) {
      setCheckAgreementInfo(agreementInfo);
    } else {
      setCheckAgreementInfo(undefined);
    }
    setShowModal(true);
  };

  const deleteAgreement = async (key: string) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确定操作',
      content: '是否确认删除数据？',
      onOk: () => {
        deleteAgreementToServer(key).then(res => {
          if (res) {
            getAgreementFromServer(_assign(queryParams, queryForm.getFieldsValue()))
          }
        }).catch(e => {
          console.error('[delete Agreement error!]', e)
        });
      },
    });
  };

  const closeModal = (result: boolean) => {
    setShowModal(false);
    if (result) {
      getAgreementFromServer(_assign(queryParams, queryForm.getFieldsValue()))
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
                label="协议key值"
                name="agreementKey">
                <Input placeholder="请输入协议key值，支持模糊查询"/>
              </Form.Item>
            </Col>
            <Col md={9} xs={0}/>
            <Col md={2} xs={8} style={{textAlign: 'left'}}>
              <Space size="large">
                <Button type='primary' htmlType="submit" loading={loading}>查询</Button>
                <Button type='default' loading={loading} onClick={() => {
                  queryForm.resetFields()
                }}>重置</Button>
              </Space>
            </Col>
            <Col md={17} xs={0}/>
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
              onClick={() => {
                alertTipsHandle('info', '', false)
              }}>
              我知道了
            </div>
            }
          /> : null
        }
      </div>
      <div className={styles.tableDiv}>
        <Button type="primary" loading={loading} icon={<FileAddOutlined/>} onClick={() => {
          updateAgreement()
        }}>新增协议</Button>
        <Divider/>
        {
          hasError ?
            <Result
              status="error"
              title="查询发生了错误"
              subTitle={errorMessage}
            />
            :
            <Table<AgreementInfo>
              size="small"
              columns={columns}
              rowKey={record => record.agreementKey}
              dataSource={agreementList}
              pagination={{
                size: 'small',
                total: totalElements,
                current: queryParams.page,
                pageSize: queryParams.pageSize,
                pageSizeOptions: ['20', '40'],
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => {
                  return `总条数${total}条`
                },
              }}
              loading={loading}
              scroll={{x: 900, scrollToFirstRowOnChange: true}}
              onChange={handleTableChange}
            />
        }
      </div>
      <AgreementInfoDetail agreementInfo={checkAgreementInfo} onCloseModal={closeModal} showModal={showModal}
                           maskClosable={false}/>
    </PageContainer>
  );
};

export default Agreement;
