import {useModel} from "@@/plugin-model/useModel";
import React, {useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {Alert, Badge, Button, Col, Divider, Form, Input, Modal, Result, Row, Space, Table, Tooltip} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {assign as _assign} from "lodash";
import {QueryFooterNavGroupInfo, FooterNavGroupInfo} from "@/pages/affiliated/FooterNav/data";
import {FileAddOutlined} from "@ant-design/icons";
import styles from "./index.less";
import FooterNavGroup from "@/pages/affiliated/FooterNav/components/FooterNavGroup";

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

const FooterNavGroups: React.FC<{}> = () => {
  const {
    footerNavGroupInfoList,
    totalElements,
    loading,
    hasError,
    errorMessage,
    alertTipsShow,
    alertTipsMessage,
    alertTipsType,
    getFooterNavGroupInfoFromServer,
    deleteFooterNavGroupInfoToServer,
    alertTipsHandle
  } = useModel('affiliated.FooterNav.FooterNavGroupInfoModel');
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<QueryFooterNavGroupInfo>({page: 1, pageSize: 20});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [checkFooterNavGroupInfo, setCheckFooterNavGroupInfo] = useState<FooterNavGroupInfo | undefined>(undefined);

  useEffect(() => {
    getFooterNavGroupInfoFromServer(queryParams);
  }, []);

  const columns: ColumnsType<FooterNavGroupInfo> = [
    {
      title: '记录id',
      dataIndex: 'id',
      width: 100,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '是否可以跳转',
      dataIndex: 'needRedirect',
      align: 'center',
      ellipsis: true,
      render: (text, row, index) => {
        if (row.needRedirect) {
          return <Badge color='green' text='是'/>
        } else {
          return <Badge color='orange' text="否"/>
        }
      }
    },
    {
      title: '名称',
      dataIndex: 'groupName',
      align: 'center',
      ellipsis: true,
      render: (groupName: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={groupName}>
          {groupName}
        </Tooltip>
      ),
    },
    {
      title: '调转URL',
      dataIndex: 'redirectUrl',
      align: 'center',
      ellipsis: true,
      render: (redirectUrl: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={redirectUrl}>
          {redirectUrl}
        </Tooltip>
      ),
    },
    {
      title: '脚页提示',
      dataIndex: 'groupTips',
      align: 'center',
      ellipsis: true,
      render: (groupTips: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={groupTips}>
          {groupTips}
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
            updateFooterNavGroup(row)
          }}>编辑</a>
          <a onClick={async () => {
            deleteFooterNavGroup(row.id)
          }}>删除</a>
        </Space>
      ),
    },
  ];

  // 查询表单提交
  const onFinish = (values: any) => {
    getFooterNavGroupInfoFromServer(_assign(queryParams, values));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setQueryParams(pageNowInfo);
    getFooterNavGroupInfoFromServer(_assign(pageNowInfo, queryForm.getFieldsValue()));
  };

  const updateFooterNavGroup = (footerNavGroupInfo?: FooterNavGroupInfo) => {
    if (footerNavGroupInfo) {
      setCheckFooterNavGroupInfo(footerNavGroupInfo);
    } else {
      setCheckFooterNavGroupInfo(undefined);
    }
    setShowModal(true);
  };

  const deleteFooterNavGroup = async (id: number) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确定操作',
      content: '是否确认删除数据？',
      onOk: () => {
        deleteFooterNavGroupInfoToServer(id).then(res => {
          if (res) {
            getFooterNavGroupInfoFromServer(_assign(queryParams, queryForm.getFieldsValue()))
          }
        }).catch(e => {
          console.error('[delete dataSource error!]', e)
        });
      },
    });
  };

  const closeModal = (result: boolean) => {
    setShowModal(false);
    if (result) {
      getFooterNavGroupInfoFromServer(_assign(queryParams, queryForm.getFieldsValue()))
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
                label="脚页分组名称"
                name="groupName">

                <Input placeholder="请输入脚页分组名称，支持右模糊查询"/>
              </Form.Item>
            </Col>
            {/*<Col md={5} xs={24}>
              <Form.Item0
                label="数据源地址"
                name="dataBaseHost">
                <Input placeholder="请输入数据源地址，支持右模糊查询" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="数据源名字"
                name="dataBaseShowName">
                <Input placeholder="请输入数据源名字，支持模糊查询" />
              </Form.Item>
            </Col>*/}
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
          updateFooterNavGroup()
        }}>新增分组 </Button>
        <Divider/>
        {
          hasError ?
            <Result
              status="error"
              title="查询发生了错误"
              subTitle={errorMessage}
            />
            :
            <Table<FooterNavGroupInfo>
              size="small"
              columns={columns}
              rowKey={record => record.id}
              dataSource={footerNavGroupInfoList}
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
      <FooterNavGroup footerNavGroupInfo={checkFooterNavGroupInfo} onCloseModal={closeModal} showModal={showModal}
                      maskClosable={false}/>
    </PageContainer>
  );
};

export default FooterNavGroups;
