import {useModel} from "@@/plugin-model/useModel";
import React, {ReactNode, useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {Alert, Button, Col, Divider, Form,  Modal, Result, Row, Select, Space, Table, Tooltip} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import {assign as _assign} from "lodash";
import {BannerDetailInfo, QueryBannerDetailInfo} from "@/pages/affiliated/banner/detail/data";
import {FileAddOutlined} from "@ant-design/icons";
import styles from "./index.less";
import BannerDetailInfoDetail from "@/pages/affiliated/banner/detail/components/BannerDetailInfoDetail";

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

const BannerDetail: React.FC<{}> = () => {
  const { bannerDetailInfoList, bannerGroup, totalElements,
    loading, hasError, errorMessage, alertTipsShow, alertTipsMessage, alertTipsType, getGroupListFromServer, getBannerDetailInfoFromServer, deleteBannerDetailInfoToServer, alertTipsHandle} = useModel('affiliated.banner.detail.BannerDetailInfoModel');
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<QueryBannerDetailInfo>({page: 1, pageSize: 20});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [checkBannerDetailInfo, setcheckBannerDetailInfo] = useState<BannerDetailInfo|undefined>(undefined);

  useEffect(() => {
    getBannerDetailInfoFromServer(queryParams);
    getGroupListFromServer();
  }, []);

  const columns: ColumnsType<BannerDetailInfo> = [
    {
      title: '记录id',
      dataIndex: 'id',
      width: 100,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '数据源类型',
      dataIndex: 'groupId',
      align: 'center',
      ellipsis: true,
      render: (groupId: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={groupId}>
          {groupId}
        </Tooltip>
      ),
    },
    {
      title: '图片地址',
      dataIndex: 'mediaUrl',
      align: 'center',
      ellipsis: true,
      render: (dataBaseShowName: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={dataBaseShowName}>
          {dataBaseShowName}
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
          <a onClick={ () => {updateBannerDetailInfo(row)}}>编辑</a>
          <a onClick={ async () => {deleteBannerDetailInfo(row.id)}}>删除</a>
        </Space>
      ),
    },
  ];

  // 查询表单提交
  const onFinish = (values: any) => {
    getBannerDetailInfoFromServer(_assign(queryParams, values));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setQueryParams(pageNowInfo);
    getBannerDetailInfoFromServer(_assign(pageNowInfo, queryForm.getFieldsValue()));
  };

  const bannerGroupGen = (): ReactNode[] => {
    const arr: ReactNode[] = [];
    bannerGroup.forEach(item => {
      arr.push(
        <Select.Option key={item.id} value={item.id}>{item.groupName}</Select.Option>
      );
    })
    return arr;
  };

  const updateBannerDetailInfo = (bd?: BannerDetailInfo) => {
    if(bd){
      setcheckBannerDetailInfo(bd);
    }else{
      setcheckBannerDetailInfo(undefined);
    }
    setShowModal(true);
  };

  const deleteBannerDetailInfo = async (id: number) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确定操作',
      content: '是否确认删除数据？',
      onOk: () => {
        deleteBannerDetailInfoToServer(id).then(res => {
          if(res){
            getBannerDetailInfoFromServer(_assign(queryParams, queryForm.getFieldsValue()))
          }
        }).catch(e => {
          console.error('[delete BannerDetail error!]', e)
        });
      },
    });
  };

  const closeModal = (result: boolean) => {
    setShowModal(false);
    if(result){
      getBannerDetailInfoFromServer(_assign(queryParams, queryForm.getFieldsValue()))
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
                label="轮播图类型"
                name="dataBaseType">
                <Select allowClear placeholder="请选择类型">
                  { bannerGroupGen() }
                </Select>
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
        <Button type="primary" loading={loading} icon={<FileAddOutlined />} onClick={() => {updateBannerDetailInfo()}}>新增轮播图</Button>
        <Divider />
        {
          hasError ?
            <Result
              status="error"
              title="查询发生了错误"
              subTitle={errorMessage}
            />
            :
            <Table<BannerDetailInfo>
              size="small"
              columns={columns}
              rowKey={record => record.id}
              dataSource={bannerDetailInfoList}
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
      <BannerDetailInfoDetail bannerDetailInfo={checkBannerDetailInfo} onCloseModal={closeModal} showModal={showModal} maskClosable={false}/>
    </PageContainer>
  );
};

export default BannerDetail;
