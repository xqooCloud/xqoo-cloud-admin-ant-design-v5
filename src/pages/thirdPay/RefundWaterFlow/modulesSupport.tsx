import {PayCircleOutlined} from "@ant-design/icons";
import React from "react";
import {ColumnsType} from "antd/es/table";
import {Badge, Space, Statistic, Tooltip} from "antd";
import {RefundWaterFlowEntity} from "@/pages/thirdPay/RefundWaterFlow/data";
import {PayPlatName} from "@/pages/thirdPay/PayWaterFlow/modulesSupport";

export const refundWaterColumns: ColumnsType<RefundWaterFlowEntity> = [
  {
    title: '退款单号',
    dataIndex: 'refundCode',
    width: 150,
    align: 'center',
    fixed: 'left',
    ellipsis: true,
    render: (refundCode: any) => (
      <Tooltip overlay={undefined} placement="topLeft" title={refundCode}>
        {refundCode}
      </Tooltip>
    ),
  },
  {
    title: '支付单号',
    dataIndex: 'payTransactionId',
    width: 150,
    align: 'center',
    ellipsis: true,
    render: (payTransactionId: any) => (
      <Tooltip overlay={undefined} placement="topLeft" title={payTransactionId ? payTransactionId : 'none'}>
        {payTransactionId ? payTransactionId : 'none'}
      </Tooltip>
    ),
  },
  {
    title: '支付平台',
    dataIndex: 'refundPlat',
    align: 'center',
    ellipsis: true,
    width: 130,
    render: (text: any) => {
      return <Space>
        <>{PayPlatName[text].icon}</>
        <>{PayPlatName[text].name}</>
      </Space>
    }
  },
  {
    title: '退款状态',
    dataIndex: 'refundStatus',
    align: 'center',
    ellipsis: true,
    width: 100,
    render: (text, row, index) => {
      if(row.refundStatus === 1) {
        return <Badge color='green' text="退款成功" />
      }else{
        return <Badge color='red' text="退款失败" />
      }
    }
  },
  {
    title: '退款金额',
    dataIndex: 'refundAmount',
    align: 'center',
    ellipsis: true,
    width: 100,
    render: (refundAmount: any) => (
      <Tooltip overlay={undefined} placement="topLeft" title={refundAmount.toFixed(2) + '元'}>
        <Statistic
          value={refundAmount}
          precision={2}
          valueStyle={{ color: '#c1065c', fontSize: '15px' }}
          prefix={<PayCircleOutlined />}
        />
      </Tooltip>
    ),
  },
  {
    title: '退款发起方',
    dataIndex: 'refundLaunch',
    align: 'center',
    ellipsis: true,
    width: 180,
    render: (refundLaunch: any) => (
      <Tooltip overlay={undefined} placement="topLeft" title={refundLaunch}>
        {refundLaunch}
      </Tooltip>
    ),
  },
  {
    title: '平台流水号',
    dataIndex: 'tradeId',
    width: 200,
    align: 'center',
    ellipsis: true,
    render: (tradeId: any) => (
      <Tooltip overlay={undefined} placement="topLeft" title={tradeId ? tradeId : '丢失'}>
        {tradeId ? tradeId : '丢失'}
      </Tooltip>
    ),
  },
  {
    title: '退款时间',
    dataIndex: 'refundTime',
    width: 200,
    align: 'center',
    ellipsis: true,
    render: (refundTime: any) => (
      <Tooltip overlay={undefined} placement="topLeft" title={refundTime ? refundTime : '丢失'}>
        {refundTime ? refundTime : '丢失'}
      </Tooltip>
    ),
  },
  {
    title: '退款说明',
    dataIndex: 'refundReason',
    width: 200,
    align: 'center',
    ellipsis: true,
    render: (refundReason: any) => (
      <Tooltip overlay={undefined} placement="topLeft" title={refundReason ? refundReason : '系统退款'}>
        {refundReason ? refundReason : '系统退款'}
      </Tooltip>
    ),
  },
  {
    title: '退款人uid',
    dataIndex: 'refundUserId',
    align: 'center',
    width: 160,
    ellipsis: true,
    render: (refundUserId: any) => (
      <Tooltip overlay={undefined} placement="topLeft" title={refundUserId ? refundUserId : 'none'}>
        {refundUserId ? refundUserId : 'none'}
      </Tooltip>
    ),
  },
  {
    title: '记录创建时间',
    dataIndex: 'createDate',
    align: 'center',
    width: 200,
    ellipsis: true,
    render: (createDate: any) => (
      <Tooltip overlay={undefined} placement="topLeft" title={createDate ? createDate : 'none'}>
        {createDate ? createDate : 'none'}
      </Tooltip>
    ),
  },
];
