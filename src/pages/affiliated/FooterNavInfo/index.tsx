import {useModel} from "@@/plugin-model/useModel";
import React, {useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {Alert, Button, Col, Divider, Form, Input, Modal, Result, Row, Space, Table, Tooltip} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {assign as _assign} from "lodash";
import {QueryFooterNavDetailInfo, FooterNavDetailInfo} from "@/pages/affiliated/FooterNavInfo/data";
import {FileAddOutlined} from "@ant-design/icons";
import styles from "./index.less";
import {history} from 'umi';
import FooterNavDetail from "@/pages/affiliated/FooterNavInfo/components/FooterNavDetail";

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



const FooterNavDetailInfos: React.FC<{}> = () => {
  const {
    footerNavDetailInfoList,
    totalElements,
    loading,
    hasError,
    errorMessage,
    alertTipsShow,
    alertTipsMessage,
    alertTipsType,
    getFooterNavDetailInfoFromServer,
    deleteFooterNavDetailInfoToServer,
    alertTipsHandle
  } = useModel('affiliated.FooterNavInfo.FooterNavDetailInfoModel');
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<QueryFooterNavDetailInfo>({page: 1,groupId:1, pageSize: 20});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [groupIdParam, setGroupIdParam] = useState<number>(1);
  const [groupNameParam, setGroupNameParam] = useState<string>("");
  const [checkFooterNavDetailInfo, setCheckFooterNavDetailInfo] = useState<FooterNavDetailInfo | undefined>(undefined);


  // 查询数据
  useEffect(() => {
    const pathHash = history.location;
    const { query } = pathHash;
    var groupId= query?.groupId
    var groupName= query?.groupName
    debugger
    if (groupId) {
      setGroupIdParam(Number(groupId))
      setGroupNameParam(String(groupName))
      queryParams.groupId=Number(groupId)
    }
  }, []);


  useEffect(() => {
      queryParams.groupId=groupIdParam
      getFooterNavDetailInfoFromServer(queryParams);
  }, [groupIdParam]);

  const columns: ColumnsType<FooterNavDetailInfo> = [
    {
      title: '记录id',
      dataIndex: 'id',
      width: 100,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '展示文字',
      dataIndex: 'labelText',
      align: 'center',
      ellipsis: true,
      render: (labelText: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={labelText}>
          {labelText}
        </Tooltip>
      ),
    },
    {
      title: '辅助说明',
      dataIndex: 'labelTitle',
      align: 'center',
      ellipsis: true,
      render: (labelTitle: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={labelTitle}>
          {labelTitle}
        </Tooltip>
      ),
      /*render: (text, row, index) => {
        if (row.needRedirect) {
          return <Badge color='green' text='是'/>
        } else {
          return <Badge color='orange' text="否"/>
        }
      }*/
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
      title: '显示顺序',
      dataIndex: 'sortNo',
      align: 'center',
      ellipsis: true,
      render: (sortNo: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={sortNo}>
          {sortNo}
        </Tooltip>
      ),
    },
    {
      title: '图标名称',
      dataIndex: 'iconName',
      align: 'center',
      ellipsis: true,
      render: (iconName: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={iconName}>
          {iconName}
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
            updateFooterNavDetail(row)
          }}>编辑</a>
          <a onClick={async () => {
            deleteFooterNavDetail(row.id)
          }}>删除</a>
        </Space>
      ),
    },
  ];

  // 查询表单提交
  const onFinish = (values: any) => {
    getFooterNavDetailInfoFromServer(_assign(queryParams, values));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setQueryParams(pageNowInfo);
    getFooterNavDetailInfoFromServer(_assign(pageNowInfo, queryForm.getFieldsValue()));
  };

  const updateFooterNavDetail = (footerNavDetailInfo?: FooterNavDetailInfo) => {
    if (footerNavDetailInfo) {
      footerNavDetailInfo.groupId=groupIdParam
      footerNavDetailInfo.groupName=groupNameParam
      setCheckFooterNavDetailInfo(footerNavDetailInfo);
    } else {
      setCheckFooterNavDetailInfo(undefined);
    }
    setShowModal(true);
  };

  const deleteFooterNavDetail= async (id: number) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确定操作',
      content: '是否确认删除数据？',
      onOk: () => {
        deleteFooterNavDetailInfoToServer(id).then(res => {
          if (res) {
            getFooterNavDetailInfoFromServer(_assign(queryParams, queryForm.getFieldsValue()))
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
      getFooterNavDetailInfoFromServer(_assign(queryParams, queryForm.getFieldsValue()))
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
                label="脚页名称"
                name="labelTitle">

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
          updateFooterNavDetail()
        }}>新增脚页 </Button>
        <Divider/>
        {
          hasError ?
            <Result
              status="error"
              title="查询发生了错误"
              subTitle={errorMessage}
            />
            :
            <Table<FooterNavDetailInfo>
              size="small"
              columns={columns}
              rowKey={record => record.id}
              dataSource={footerNavDetailInfoList}
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
      <FooterNavDetail footerNavDetailInfo={checkFooterNavDetailInfo} groupId={groupIdParam} groupName={groupNameParam} onCloseModal={closeModal} showModal={showModal}
                       maskClosable={false}/>
    </PageContainer>
  );
};

export default FooterNavDetailInfos;
