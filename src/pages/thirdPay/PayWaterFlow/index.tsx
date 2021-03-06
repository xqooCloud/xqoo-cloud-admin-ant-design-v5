import React, {ReactNodeArray, useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-layout";
import {useModel} from "@@/plugin-model/useModel";
import {Button, Col, Divider, Form, Input, Result, Row, Select, Space, Table} from "antd";
import {DatePicker} from '@/components';
import {PayWaterFlowEntity, QueryPayWaterFlow} from "@/pages/thirdPay/PayWaterFlow/data";
import {assign as _assign, forIn as _forIn} from "lodash";
import {PayPlatEnum} from "@/pages/thirdPay/PayConfig/enums";
import {PayPlatName, payWaterColumns} from "@/pages/thirdPay/PayWaterFlow/modulesSupport";
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn' // import locale
import styles from '@/pages/thirdPay/PayWaterFlow/PayWaterFlow.less';

const { RangePicker } = DatePicker;
// 这里需要单独设置下dayjs的语言环境
dayjs.locale('zh-cn');
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

const PayWaterFlow:React.FC<{}> = () => {
  const {payWaterFlowList, totalElements, loading, hasError, errorMessage,
    getPayWaterFlowFromServer} = useModel('thirdPay.PayWaterFlow.PayWaterFlowModel');
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<QueryPayWaterFlow>({page: 1, pageSize: 20});

  useEffect(() => {
    getPayWaterFlowFromServer(queryParams);
  }, []);

  // 查询表单提交
  const onFinish = (values: any) => {
    getPayWaterFlowFromServer(_assign(queryParams, values));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setQueryParams(pageNowInfo);
    getPayWaterFlowFromServer(_assign(pageNowInfo, queryForm.getFieldsValue()));
  };

  const generatorPayPlatOption = (): ReactNodeArray => {
    const arr: ReactNodeArray = [];
    _forIn(PayPlatEnum, (value, key) => {
      arr.push(<Select.Option key={value} value={value}>{PayPlatName[value].name}</Select.Option>);
    });
    return arr;
  };

  const dateChange = (dates: any, dateStrings: any) => {
    if (dates) {
      const obj = {
        startDate: dateStrings[0],
        endDate: dateStrings[1]
      }
      setQueryParams(_assign({}, queryParams, obj));
    } else {
      setQueryParams(_assign({}, queryParams, {
        startDate: undefined,
        endDate: undefined
      }));
    }
  };

  return (
    <PageContainer fixedHeader>
      <div className={styles.operationDiv}>
        <Form
          {...formItemLayout}
          form={queryForm}
          name="payWaterFlowQueryForm"
          onFinish={onFinish}
        >
          <Row justify="space-around" align="middle">
            <Col md={5} xs={24}>
              <Form.Item
                label="支付单号"
                name="payTransactionId">
                <Input placeholder="请输入支付单号" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="平台流水"
                name="transactionId">
                <Input placeholder="支付平台的流水号" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="支付平台"
                name="payPlat">
                <Select allowClear placeholder="请选择支付平台">
                  {
                    generatorPayPlatOption()
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="支付状态"
                name="payStatus">
                <Select allowClear placeholder="请选择支付状态">
                  <Select.Option value={0}>未支付</Select.Option>
                  <Select.Option value={1}>已支付</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={4} xs={0}/>
            <Col md={5} xs={24}>
              <Form.Item
                label="创建时间"
                name="rangePicker"
                wrapperCol={{
                  xs: { span: 18 },
                  sm: { span: 18 },
                  md: { span: 18 }
                }}
              >
                <RangePicker
                  showTime
                  ranges={{
                    '月初至今': [dayjs().startOf('month').startOf('day'), dayjs().endOf('day')],
                    '最近三周': [dayjs().subtract(3,'week').startOf('day'), dayjs().endOf('day')],
                    '最近三月': [dayjs().subtract(3,'month').startOf('day'), dayjs().endOf('day')],
                    '最近半年': [dayjs().subtract(6,'month').startOf('day'), dayjs().endOf('day')],
                    '今天': [dayjs().startOf('day'), dayjs().endOf('day')]
                  }}
                  onChange={dateChange}
                />
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
      <div className={styles.tableDiv}>
        <Divider />
        {
          hasError ?
            <Result
              status="error"
              title="查询发生了错误"
              subTitle={errorMessage}
            />
            :
            <Table<PayWaterFlowEntity>
              size="small"
              columns={payWaterColumns}
              rowKey={record => record.payTransactionId}
              dataSource={payWaterFlowList}
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
              scroll={{ x: 900, y: 450, scrollToFirstRowOnChange: true }}
              onChange={handleTableChange}
            />
        }
      </div>
    </PageContainer>
  );
};

export default PayWaterFlow;
