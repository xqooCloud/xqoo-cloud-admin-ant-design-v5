import React, {useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {useModel} from "@@/plugin-model/useModel";
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
  Popconfirm,
  Result,
  Row,
  Select,
  Space,
  Table,
  Tooltip
} from "antd";
import {DeviceInfoEntity, DeviceInfoQuery} from "@/pages/device/DeviceInfo/data";
import {ColumnsType} from "antd/es/table";
import {assign as _assign} from "lodash";
import QueueAnim from "rc-queue-anim";
import styles from "@/pages/device/DeviceInfo/DeviceInfo.less";
import {DownOutlined, PlusOutlined} from "@ant-design/icons";
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

const DeviceInfo: React.FC<{}> = () => {
  const {deviceInfoList, totalElements, loading, hasError, errorMessage, alertTipsShow,
    getDeviceInfoListFromServer, alertTipsType, alertTipsMessage, alertTipsHandle, delRecord,
    updateToDeployToServer,
    deviceToFinishToServer,
    deviceToRemoveToServer,
    deviceToStopToServer,} = useModel("device.DeviceInfo.DeviceInfoModel");
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<DeviceInfoQuery>({page: 1, pageSize: 20});

  const jumpToUpdatePage = (id: string) => {
    history.push(`/device/DeviceInfo/updateDeviceInfo?deviceId=${id}`);
  };

  useEffect(() => {
    getDeviceInfoListFromServer(queryParams);
  }, []);

  const delRecordToServer = (deviceId: string) => {
    delRecord(deviceId).then(res => {
      if(res){
        getDeviceInfoListFromServer(_assign(queryParams, queryForm.getFieldsValue()))
      }
    }).catch(e => {
      console.error('[delete device record error!]', e)
    });
  };

  const updateToDeploy = (deviceId: string) => {
    updateToDeployToServer(deviceId).then(res => {
      if(res){
        getDeviceInfoListFromServer(_assign(queryParams, queryForm.getFieldsValue()))
      }
    }).catch(e => {
      console.error('[update device to deploy error!]', e)
    });
  };

  const deviceToFinish = (deviceId: string) => {
    deviceToFinishToServer(deviceId).then(res => {
      if(res){
        getDeviceInfoListFromServer(_assign(queryParams, queryForm.getFieldsValue()))
      }
    }).catch(e => {
      console.error('[update device to finish error!]', e)
    });
  };

  const deviceToRemove = (deviceId: string) => {
    deviceToRemoveToServer(deviceId).then(res => {
      if(res){
        getDeviceInfoListFromServer(_assign(queryParams, queryForm.getFieldsValue()))
      }
    }).catch(e => {
      console.error('[update device to remove error!]', e)
    });
  };

  const deviceToStop = (deviceId: string) => {
    deviceToStopToServer(deviceId).then(res => {
      if(res){
        getDeviceInfoListFromServer(_assign(queryParams, queryForm.getFieldsValue()))
      }
    }).catch(e => {
      console.error('[update device to stop error!]', e)
    });
  };

  const generatorDropMenu = (row: DeviceInfoEntity) => {
    return <Menu>
      <Menu.Item disabled={!(row.screenStatus === 0 || row.screenStatus === 3)}>
        <Popconfirm
          disabled={!(row.screenStatus === 0 || row.screenStatus === 3)}
          title="确定要开始部署设备？"
          onConfirm={() => {
            updateToDeploy(row.id);
          }}
          okText="确定"
          cancelText="取消"
        >
          <a>部署设备</a>
        </Popconfirm>
      </Menu.Item>
      <Menu.Item disabled={!(row.screenStatus === 0 || row.screenStatus === 1 || row.screenStatus === 3)}>
        <Popconfirm
          disabled={!(row.screenStatus === 0 || row.screenStatus === 1 || row.screenStatus === 3)}
          title="确定设备已经部署完成？"
          onConfirm={() => {
            deviceToFinish(row.id);
          }}
          okText="确定"
          cancelText="取消"
        >
          <a>部署完成</a>
        </Popconfirm>
      </Menu.Item>
      <Menu.Item disabled={row.screenStatus !== 2}>
        <Popconfirm
          disabled={row.screenStatus !== 2}
          title="确定要停机设备？"
          onConfirm={() => {
            deviceToStop(row.id);
          }}
          okText="确定"
          cancelText="取消"
        >
          <a>停机设备</a>
        </Popconfirm>
      </Menu.Item>
      <Menu.Item disabled={!(row.screenStatus === 0 || row.screenStatus === 3)}>
        <Popconfirm
          disabled={!(row.screenStatus === 0 || row.screenStatus === 3)}
          title="确定要拆除设备？"
          onConfirm={() => {
            deviceToRemove(row.id);
          }}
          okText="确定"
          cancelText="取消"
        >
          <a>拆除设备</a>
        </Popconfirm>
      </Menu.Item>
      <Menu.Item disabled={!(row.screenStatus === 0 || row.screenStatus === 4)}>
        <Popconfirm
          disabled={!(row.screenStatus === 0 || row.screenStatus === 4)}
          title="确定要删除此记录吗"
          onConfirm={() => {
            delRecordToServer(row.id);
          }}
          okText="确定"
          cancelText="取消"
        >
          <a>删除</a>
        </Popconfirm>
      </Menu.Item>
      </Menu>
    ;
  };

  const columns: ColumnsType<DeviceInfoEntity> = [
    {
      title: '记录id',
      dataIndex: 'id',
      width: 80,
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      render: (id: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={id}>
          {id}
        </Tooltip>
      ),
    },
    {
      title: '屏幕状态',
      dataIndex: 'screenStatus',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text: any) => {
        if(text === 0) {
          return <Badge color='yellow' text="计划部署" />
        }else if(text === 1){
          return <Badge color='blue' text="正在部署" />
        }else if(text === 2){
          return <Badge color='green' text="已部署使用" />
        }else if(text === 3){
          return <Badge color='red' text="故障停机" />
        }else{
          return <Badge color='black' text="拆机移除" />
        }
      }
    },
    {
      title: '屏幕所在经度',
      dataIndex: 'screenPositionLong',
      align: 'center',
      ellipsis: true,
      width: 130,
      render: (screenPositionLong: any) => {
        return <span>{screenPositionLong}</span>;
      }
    },
    {
      title: '屏幕所在纬度',
      dataIndex: 'screenPositionLati',
      align: 'center',
      ellipsis: true,
      width: 150,
      render: (screenPositionLati: any) => {
        return <span>{screenPositionLati}</span>;
      }
    },
    {
      title: '屏幕尺寸',
      dataIndex: 'screenSize',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (screenSize: any) => {
        return <span>{screenSize} 存</span>
      }
    },
    {
      title: '屏幕名称',
      dataIndex: 'screenName',
      align: 'center',
      ellipsis: true,
      width: 200,
      render: (screenName: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={screenName}>
          {screenName}
        </Tooltip>
      ),
    },
    {
      title: '屏幕地址',
      dataIndex: 'screenAddress',
      align: 'center',
      ellipsis: true,
      width: 200,
      render: (screenAddress: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={screenAddress}>
          {screenAddress}
        </Tooltip>
      ),
    },
    {
      title: '屏幕标签',
      dataIndex: 'screenLabel',
      align: 'center',
      ellipsis: true,
      width: 200,
      render: (screenLabel: any[]) => (
        <Tooltip overlay={undefined} placement="topLeft" title={screenLabel.join(',')}>
          {screenLabel.join(',')}
        </Tooltip>
      ),
    },
    {
      title: '安装人员',
      dataIndex: 'screenInstaller',
      align: 'center',
      ellipsis: true,
      width: 180,
      render: (screenInstaller: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={screenInstaller}>
          {screenInstaller}
        </Tooltip>
      ),
    },
    {
      title: '安装人员电话',
      dataIndex: 'screenInstallerPhone',
      align: 'center',
      ellipsis: true,
      width: 130,
      render: (screenInstallerPhone: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={screenInstallerPhone}>
          {screenInstallerPhone}
        </Tooltip>
      ),
    },
    {
      title: '补充说明',
      dataIndex: 'screenTips',
      align: 'center',
      ellipsis: true,
      width: 120,
      render: (screenTips: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={screenTips}>
          {screenTips}
        </Tooltip>
      ),
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
        <Space size="small">
          <Button type="link" disabled={row.screenStatus === 4} onClick={() => { jumpToUpdatePage(row.id); }}>编辑</Button>
          <Dropdown overlay={generatorDropMenu(row)} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              更多...<DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  // 查询表单提交
  const onFinish = (values: any) => {
    getDeviceInfoListFromServer(_assign(queryParams, values));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setQueryParams(pageNowInfo);
    getDeviceInfoListFromServer(_assign(pageNowInfo, queryForm.getFieldsValue()));
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
                label="屏幕名字"
                name="screenName">
                <Input placeholder="请输入屏幕名字" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="设备状态"
                name="screenStatus">
                <Select allowClear placeholder="请选择设备状态">
                  <Select.Option value={0}>计划部署</Select.Option>
                  <Select.Option value={1}>正在部署</Select.Option>
                  <Select.Option value={2}>已投入使用</Select.Option>
                  <Select.Option value={3}>故障停机</Select.Option>
                  <Select.Option value={4}>拆机移除</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={14} xs={0}/>
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
        <Space size="large">
          <Button type="primary" loading={loading} icon={<PlusOutlined />} onClick={() => { jumpToUpdatePage('') }}>新增设备</Button>
        </Space>
        <Divider />
        {
          hasError ?
            <Result
              status="error"
              title="查询发生了错误"
              subTitle={errorMessage}
            />
            :
            <Table<DeviceInfoEntity>
              size="small"
              columns={columns}
              rowKey={record => record.id}
              dataSource={deviceInfoList}
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
    </PageContainer>
  );
};

export default DeviceInfo;
