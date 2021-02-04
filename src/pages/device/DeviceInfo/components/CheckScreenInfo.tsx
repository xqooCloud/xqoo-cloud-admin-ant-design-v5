import React, {useEffect, useState} from "react";
import {useModel} from "@@/plugin-model/useModel";
import {
  Alert,
  Badge,
  Button,
  Col,
  Divider,
  Form,
  Input,
  Result,
  Row,
  Space,
  Table,
  Tooltip
} from "antd";
import {DeviceInfoEntity, DeviceInfoQuery} from "@/pages/device/DeviceInfo/data";
import {ColumnsType} from "antd/es/table";
import {assign as _assign} from "lodash";
import QueueAnim from "rc-queue-anim";
import {PlusOutlined} from "@ant-design/icons";
import styles from "@/pages/device/DeviceInfo/DeviceInfo.less";

export interface CheckScreenInfoProps {
  backData: (data: any) => void;
}

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

const CheckScreenInfo: React.FC<CheckScreenInfoProps> = (props) => {
  const {backData} = props;
  const {deviceInfoList, totalElements, loading, hasError, errorMessage, alertTipsShow,
    getDeviceInfoListFromServer, alertTipsType, alertTipsMessage, alertTipsHandle, getDeviceInfoForPublicFromServer
    } = useModel("device.DeviceInfo.DeviceInfoModel");
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<DeviceInfoQuery>({page: 1, pageSize: 20, screenStatus: 2});
  const [checkedScreenId, setCheckedScreenId] = useState<any>(undefined);

  useEffect(() => {
    getDeviceInfoListFromServer(queryParams);
  }, []);

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
      title: '是否关联商品',
      dataIndex: 'hasSaleInfo',
      align: 'center',
      ellipsis: true,
      width: 140,
      render: (text: any) => {
        if(text) {
          return <Badge color='blue' text="已关联商品" />
        }else{
          return <Badge color='red' text="未关联商品" />
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
        return <span>{screenSize} 寸</span>
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
    }
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

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DeviceInfoEntity[]) => {
      setCheckedScreenId(`${selectedRowKeys}`);
    },
  };

  const confirmCheck = async (): Promise<void> => {
    const obj = await getDeviceInfoForPublicFromServer(checkedScreenId);
    if(obj){
      backData(_assign({}, obj, {screenId: checkedScreenId}));
    }
  };

  return (
    <>
      <div style={{ marginTop: '10px'}}>
        <Form
          {...formItemLayout}
          form={queryForm}
          name="checkScreenQueryForm"
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
            <Col md={19} xs={0}/>
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
      <div className={styles.checkComponentsTable}>
        {
          checkedScreenId ?
            <Space size="middle">
              <Button size="small" danger type="primary" loading={loading} icon={<PlusOutlined />} onClick={async () => {await confirmCheck()}}>确定选择</Button>
            </Space>
            :
            null
        }
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
              rowSelection={{
                type: 'radio',
                ...rowSelection,
              }}
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
              scroll={{ x: 900, y: 300, scrollToFirstRowOnChange: true }}
              onChange={handleTableChange}
            />
        }
      </div>
    </>
  );

};
export default CheckScreenInfo;
