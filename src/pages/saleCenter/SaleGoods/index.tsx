import React, {ReactNode, useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {
  Alert,
  Badge,
  Button,
  Col,
  Divider,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Popconfirm, Popover,
  Result,
  Row,
  Select,
  Space,
  Table,
  Tooltip
} from "antd";
import {QuerySaleGoods, SaleGoodsInfoEntity} from "@/pages/saleCenter/SaleGoods/data";
import {useModel} from "@@/plugin-model/useModel";
import {ColumnsType} from "antd/es/table";
import {
  DownOutlined,
  NodeCollapseOutlined,
  NodeExpandOutlined,
  PlusOutlined
} from "@ant-design/icons";
import {assign as _assign} from "lodash";
import QueueAnim from "rc-queue-anim";
import AmapComponments from "@/components/amap/AmapComponments";
import styles from "@/pages/device/DeviceInfo/DeviceInfo.less";
import {history} from "@@/core/history";

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

const SaleGoods: React.FC<{}> = () => {
  const {saleGoodsInfo, totalElements, loading, hasError, errorMessage, alertTipsShow,
    alertTipsType, alertTipsMessage, alertTipsHandle, getSaleInfoPageGetList,sendAuditToServer,
    auditPassToServer, aboardGoodsToServer, publishGoodsToServer, undercarriageGoodsToServer} = useModel("saleCenter.SaleGoods.SaleGoodsInfoModel");
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<QuerySaleGoods>({page: 1, pageSize: 20});
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<SaleGoodsInfoEntity[]>([]);

  useEffect(() => {
    getSaleInfoPageGetList(queryParams);
  }, []);

  useEffect(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, [saleGoodsInfo]);

  const sendAuditGoods = (goodsId: string) => {
    sendAuditToServer(goodsId).then(res => {
      if(res){
        getSaleInfoPageGetList(_assign(queryParams, queryForm.getFieldsValue()))
      }
    }).catch(e => {
      console.error('[update goods to auditing error!]', e)
    });
  };

  const auditPassGoods = (goodsId: string) => {
    auditPassToServer(goodsId).then(res => {
      if(res){
        getSaleInfoPageGetList(_assign(queryParams, queryForm.getFieldsValue()))
      }
    }).catch(e => {
      console.error('[update goods to auditPass error!]', e)
    });
  };
  const aboardGoodsTo = (goodsId: string) => {
    aboardGoodsToServer(goodsId).then(res => {
      if(res){
        getSaleInfoPageGetList(_assign(queryParams, queryForm.getFieldsValue()))
      }
    }).catch(e => {
      console.error('[update goods to aboard error!]', e)
    });
  };

  const publishGoodsTo = (goodsIds: string[]) => {
    publishGoodsToServer(goodsIds).then(res => {
      if(res){
        getSaleInfoPageGetList(_assign(queryParams, queryForm.getFieldsValue()))
      }
    }).catch(e => {
      console.error('[update goods to publish error!]', e)
    });
  };

  const undercarriageGoodsTo = (goodsIds: string[]) => {
    undercarriageGoodsToServer(goodsIds).then(res => {
      if(res){
        getSaleInfoPageGetList(_assign(queryParams, queryForm.getFieldsValue()))
      }
    }).catch(e => {
      console.error('[update goods to publish error!]', e)
    });
  };

  const generatorDropMenu = (row: SaleGoodsInfoEntity) => {
    return <Menu>
      <Menu.Item disabled={row.status !== 0}>
        <Popconfirm
          disabled={row.status !== 0}
          title="确定提交审核？"
          onConfirm={() => {
            sendAuditGoods(row.goodsId);
          }}
          okText="确定"
          cancelText="取消"
        >
          <a>提交审核</a>
        </Popconfirm>
      </Menu.Item>
      <Menu.Item disabled={row.status !== 1}>
        <Popconfirm
          disabled={row.status !== 1}
          title="确定审核通过？"
          onConfirm={() => {
            auditPassGoods(row.goodsId);
          }}
          okText="确定"
          cancelText="取消"
        >
          <a>审核通过</a>
        </Popconfirm>
      </Menu.Item>
      <Menu.Item disabled={row.status !== 2}>
        <Popconfirm
          disabled={row.status !== 2}
          title="确定上架此商品？"
          onConfirm={() => {
            publishGoodsTo([row.goodsId]);
          }}
          okText="确定"
          cancelText="取消"
        >
          <a>上架商品</a>
        </Popconfirm>
      </Menu.Item>
      <Menu.Item disabled={row.status !== 3}>
        <Popconfirm
          disabled={row.status !== 3}
          title="确定下架此商品？"
          onConfirm={() => {
            undercarriageGoodsTo([row.goodsId]);
          }}
          okText="确定"
          cancelText="取消"
        >
          <a>下架商品</a>
        </Popconfirm>
      </Menu.Item>
      <Menu.Item disabled={row.status !== 0}>
        <Popconfirm
          disabled={row.status !== 0}
          title="确定废弃此商品？"
          onConfirm={() => {
            aboardGoodsTo(row.goodsId);
          }}
          okText="确定"
          cancelText="取消"
        >
          <a>废弃商品</a>
        </Popconfirm>
      </Menu.Item>
    </Menu>
      ;
  };

  const mapContent = (row: SaleGoodsInfoEntity): ReactNode => {
    return <div key="mapDiv" style={{ width: '800px', height: '400px'}}>
      <AmapComponments zoom={15} lng={row.screenPositionLong || 0} lat={row.screenPositionLati || 0} readonly />
    </div>;
  };

  const jumpToUpdatePage = (id: string) => {
    history.push(`/saleCenter/updateSaleInfo?goodsId=${id}`);
  };

  const columns: ColumnsType<SaleGoodsInfoEntity> = [
    {
      title: '商品id',
      dataIndex: 'goodsId',
      width: 150,
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      render: (goodsId: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={goodsId}>
          {goodsId}
        </Tooltip>
      ),
    },
    {
      title: '屏幕id',
      dataIndex: 'screenId',
      width: 150,
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      render: (screenId: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={screenId}>
          {screenId}
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      ellipsis: true,
      width: 80,
      render: (text: any) => {
        if(text === 0) {
          return <Badge color='yellow' text="草稿" />
        }else if(text === 1){
          return <Badge color='blue' text="审核中" />
        }else if(text === 2){
          return <Badge color='orange' text="已审核" />
        }else if(text === 3){
          return <Badge color='green' text="已上架" />
        }else{
          return <Badge color='black' text="已废弃" />
        }
      }
    },
    {
      title: '标题',
      dataIndex: 'saleTitle',
      align: 'center',
      ellipsis: true,
      width: 400,
      render: (saleTitle: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={saleTitle}>
          {saleTitle}
        </Tooltip>
      ),
    },
    {
      title: '屏幕所处位置',
      dataIndex: 'screenPositionLong',
      align: 'center',
      ellipsis: true,
      width: 130,
      render: (text, row, index) => {
        return <span>
          <Popover destroyTooltipOnHide={true} placement="top" title="位置展示" content={mapContent(row)} trigger="click">
            <a>查看地图</a>
          </Popover>
        </span>;
      }
    },
    {
      title: '单价',
      dataIndex: 'salePrice',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (salePrice: any) => {
        return <span>￥{salePrice}</span>
      }
    },
    {
      title: '记录创建时间',
      dataIndex: 'createDate',
      align: 'center',
      ellipsis: true,
      width: 200,
      render: (createDate: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={createDate}>
          {createDate}
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      fixed: 'right',
      width: 200,
      render: (text, row, index) => (
        <>
        {
          row.status !== 4 ?
            <Space size="small">
              <Button type="link" disabled={row.status !== 0} onClick={() => { jumpToUpdatePage(row.goodsId); }}>编辑</Button>
              <Dropdown overlay={generatorDropMenu(row)} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                  更多...<DownOutlined />
                </a>
              </Dropdown>
            </Space>
            : null
        }
        </>
      ),
    },
  ];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setQueryParams(pageNowInfo);
    getSaleInfoPageGetList(_assign(pageNowInfo, queryForm.getFieldsValue()));
  };

  // 查询表单提交
  const onFinish = (values: any) => {
    getSaleInfoPageGetList(_assign(queryParams, values));
  };

  const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const batchPublish = () => {
    if(selectedRowKeys.length < 1){
      message.warning('未选择任何记录，无法执行操作');
      return;
    }
    const obj = selectedRows.find(item => item.status !== 2);
    if(obj){
      message.warning('所需记录中包含状态不为【审核通过】的记录，无法批量上架：' + obj.goodsId);
      return;
    }
    publishGoodsTo(selectedRowKeys);
  };

  const batchUndercarriage = () => {
    if(selectedRowKeys.length < 1){
      message.warning('未选择任何记录，无法执行操作');
      return;
    }
    const obj = selectedRows.find(item => item.status !== 3);
    if(obj){
      message.warning('所需记录中包含状态不为【已上架】的记录，无法批量下架：' + obj.goodsId);
      return;
    }
    undercarriageGoodsTo(selectedRowKeys);
  };

  return (
    <PageContainer fixedHeader>
      <div className={styles.operationDiv}>
        <Form
          {...formItemLayout}
          form={queryForm}
          name="saleGoodsQueryForm"
          onFinish={onFinish}
        >
          <Row justify="space-around" align="middle">
            <Col md={5} xs={24}>
              <Form.Item
                label="商品id"
                name="goodsId">
                <Input placeholder="请输入部分商品标题" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="屏幕id"
                name="screenId">
                <Input placeholder="请输入部分商品标题" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="商品标题"
                name="saleTitle">
                <Input placeholder="请输入部分商品标题" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="状态"
                name="status">
                <Select allowClear placeholder="请选择设备状态">
                  <Select.Option value={0}>草稿</Select.Option>
                  <Select.Option value={1}>正在审核</Select.Option>
                  <Select.Option value={2}>已审核</Select.Option>
                  <Select.Option value={3}>已上架</Select.Option>
                  <Select.Option value={4}>废弃版本</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={4} xs={0}/>
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
      <QueueAnim style={{ marginTop: '20px'}}
                 animConfig={[
                   { opacity: [1, 0], translateY: [0, 50] },
                   { opacity: [1, 0], translateY: [0, -50] }
                 ]}>
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
      </QueueAnim>
      <div className={styles.tableDiv}>
        <div>
          <Space size="large">
            <Button type="primary" loading={loading} icon={<PlusOutlined />} onClick={() => { jumpToUpdatePage('') }}>新增商品</Button>
          </Space>
        </div>
        <Divider />
        {
          hasError ?
            <Result
              status="error"
              title="查询发生了错误"
              subTitle={errorMessage}
            />
            :
            <>
              <Space>
                <Button
                  type="default"
                  size="small"
                  onClick={batchPublish}
                  loading={loading}
                  disabled={selectedRowKeys.length < 1}
                  icon={<NodeCollapseOutlined />}
                >
                  批量上架
                </Button>
                <Button
                  type="default"
                  size="small"
                  onClick={batchUndercarriage}
                  danger
                  loading={loading}
                  disabled={selectedRowKeys.length < 1}
                  icon={<NodeExpandOutlined />}
                >
                  批量下架
                </Button>
                {
                  selectedRowKeys.length > 0 ?
                    <span>已勾选 {selectedRowKeys.length} 条</span>
                    : null
                }
              </Space>
              <Table<SaleGoodsInfoEntity>
                size="small"
                rowSelection={{
                  selectedRowKeys,
                  onChange: onSelectChange,
                }}
                columns={columns}
                rowKey={record => record.goodsId}
                dataSource={saleGoodsInfo}
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
            </>
        }
      </div>
    </PageContainer>
  );
};

export default SaleGoods;
