import {useModel} from "@@/plugin-model/useModel";
import React, {useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {Alert, Button, Col, Divider, Form, Input, Modal, Result, Row, Space, Table, Tooltip} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {assign as _assign} from "lodash";
import {BannerGroupInfo, QueryBannerGroupInfo} from "@/pages/affiliated/banner/group/data";
import {FileAddOutlined} from "@ant-design/icons";
import styles from "./index.less";
import BannerGroupInfoDetail from "@/pages/affiliated/banner/group/components/BannerGroupInfoDetail";

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

const BannerGroup: React.FC<{}> = () => {
  const {
    bannerGroupInfoList, totalElements,
    loading, hasError, errorMessage, alertTipsShow, alertTipsType, alertTipsMessage, getBannerGroupInfoFromServer, deleteBannerGroupInfoToServer, alertTipsHandle
  } = useModel('affiliated.banner.group.BannerGroupInfoModel');
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<QueryBannerGroupInfo>({page: 1, pageSize: 20});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [checkBannerGroupInfo, setCheckBannerGroupInfo] = useState<BannerGroupInfo | undefined>(undefined);

  useEffect(() => {
    getBannerGroupInfoFromServer(queryParams);
  }, []);

  const columns: ColumnsType<BannerGroupInfo> = [
    {
      title: '分组名',
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
      title: '备注',
      dataIndex: 'remarkTips',
      align: 'center',
      ellipsis: true,
      render: (remarkTips: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={remarkTips}>
          {remarkTips}
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
            updateBannerGroup(row)
          }}>编辑</a>
          <a onClick={async () => {
            deleteBannerGroup(row.id)
          }}>删除</a>
        </Space>
      ),
    },
  ];

  // 查询表单提交
  const onFinish = (values: any) => {
    getBannerGroupInfoFromServer(_assign(queryParams, values));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setQueryParams(pageNowInfo);
    getBannerGroupInfoFromServer(_assign(pageNowInfo, queryForm.getFieldsValue()));
  };


  const updateBannerGroup = (bannerGroupInfo?: BannerGroupInfo) => {
    if (bannerGroupInfo) {
      setCheckBannerGroupInfo(bannerGroupInfo);
    } else {
      setCheckBannerGroupInfo(undefined);
    }
    setShowModal(true);
  };

  const deleteBannerGroup = async (id: number) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确定操作',
      content: '是否确认删除数据？',
      onOk: () => {
        deleteBannerGroupInfoToServer(id).then(res => {
          if (res) {
            getBannerGroupInfoFromServer(_assign(queryParams, queryForm.getFieldsValue()))
          }
        }).catch(e => {
          console.error('[delete bannerGroupInfo error!]', e)
        });
      },
    });
  };

  const closeModal = (result: boolean) => {
    setShowModal(false);
    if (result) {
      getBannerGroupInfoFromServer(_assign(queryParams, queryForm.getFieldsValue()))
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
                label="分组名称"
                name="groupName">
                <Input placeholder="请输入分组名称，支持模糊查询"/>
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
          updateBannerGroup()
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
            <Table<BannerGroupInfo>
              size="small"
              columns={columns}
              rowKey={record => record.id}
              dataSource={bannerGroupInfoList}
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
      <BannerGroupInfoDetail bannerGroupInfo={checkBannerGroupInfo} onCloseModal={closeModal} showModal={showModal}
                             maskClosable={false}/>
    </PageContainer>
  );
};

export default BannerGroup;
