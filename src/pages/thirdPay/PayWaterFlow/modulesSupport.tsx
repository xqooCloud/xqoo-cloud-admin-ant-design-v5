import {
  WechatOutlined,
  AlipayCircleOutlined,
  AppleOutlined,
  DesktopOutlined,
  MobileOutlined,
  MergeCellsOutlined,
  MessageOutlined,
  ContainerFilled,
  PayCircleOutlined
} from "@ant-design/icons";
import React from "react";
import {ColumnsType} from "antd/es/table";
import {Badge, Space, Statistic, Tooltip} from "antd";
import {PayWaterFlowEntity} from "@/pages/thirdPay/PayWaterFlow/data";

export const PayPlatName = {
  WxPay: {
    key: 'WxPay',
    name: '微信支付',
    icon: <WechatOutlined />
  },
  AliPay: {
    key: 'AliPay',
    name: '支付宝支付',
    icon: <AlipayCircleOutlined />
  },
  IOSApp: {
    key: 'IOSApp',
    name: '苹果内购',
    icon: <AppleOutlined />
  }
}

export const PayDeviceName = {
  PC: {
    key: 'PC',
    name: '浏览器',
    icon: <DesktopOutlined />
  },
  APP: {
    key: 'APP',
    name: 'APP支付',
    icon: <MobileOutlined />
  },
  MOBILE: {
    key: 'MOBILE',
    name: '移动端浏览器',
    icon: <MergeCellsOutlined />
  },
  JSAPI: {
    key: 'JSAPI',
    name: '微信公众号',
    icon: <WechatOutlined />
  },
  SMP: {
    key: 'SMP',
    name: '微信小程序',
    icon: <MessageOutlined />
  },
  POS: {
    key: 'POS',
    name: 'POS机',
    icon: <ContainerFilled />
  },
}

export const payWaterColumns: ColumnsType<PayWaterFlowEntity> = [
  {
    title: '支付单号',
    dataIndex: 'payTransactionId',
    width: 150,
    align: 'center',
    fixed: 'left',
    ellipsis: true,
    render: (payTransactionId: any) => (
      <Tooltip overlay={undefined} placement="topLeft" title={payTransactionId}>
        {payTransactionId}
      </Tooltip>
    ),
  },
  {
    title: '平台流水号',
    dataIndex: 'transactionId',
    width: 150,
    align: 'center',
    ellipsis: true,
    render: (transactionId: any) => (
      <Tooltip overlay={undefined} placement="topLeft" title={transactionId ? transactionId : 'none'}>
        {transactionId ? transactionId : 'none'}
      </Tooltip>
    ),
  },
  {
    title: '支付平台',
    dataIndex: 'payPlat',
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
    title: '支付状态',
    dataIndex: 'payStatus',
    align: 'center',
    ellipsis: true,
    width: 100,
    render: (text, row, index) => {
      if(row.payStatus === 1) {
        return <Badge color='green' text="已支付" />
      }else{
        return <Badge color='red' text="未支付" />
      }
    }
  },
  {
    title: '支付金额',
    dataIndex: 'payAmount',
    align: 'center',
    ellipsis: true,
    width: 100,
    render: (payAmount: any) => (
      <Tooltip overlay={undefined} placement="topLeft" title={payAmount.toFixed(2) + '元'}>
        <Statistic
          value={payAmount}
          precision={2}
          valueStyle={{ color: '#3f8600', fontSize: '15px' }}
          prefix={<PayCircleOutlined />}
        />
      </Tooltip>
    ),
  },
  {
    title: '支付人',
    dataIndex: 'payUserName',
    align: 'center',
    ellipsis: true,
    width: 180,
    render: (payUserName: any) => (
      <Tooltip overlay={undefined} placement="topLeft" title={payUserName}>
        {payUserName}
      </Tooltip>
    ),
  },
  {
    title: '支付设备',
    dataIndex: 'payDevice',
    align: 'center',
    ellipsis: true,
    width: 100,
    render: (text: any) => {
      return <Space>
        <>{PayDeviceName[text].icon}</>
        <>{PayDeviceName[text].name}</>
      </Space>
    }
  },
  {
    title: '付款时间',
    dataIndex: 'payTime',
    width: 200,
    align: 'center',
    ellipsis: true,
    render: (payTime: any) => (
      <Tooltip overlay={undefined} placement="topLeft" title={payTime ? payTime : '尚未付款'}>
        {payTime ? payTime : '尚未付款'}
      </Tooltip>
    ),
  },
  {
    title: '付款说明',
    dataIndex: 'payComment',
    width: 200,
    align: 'center',
    ellipsis: true,
    render: (payComment: any) => (
      <Tooltip overlay={undefined} placement="topLeft" title={payComment ? payComment : '平台支付'}>
        {payComment ? payComment : '平台支付'}
      </Tooltip>
    ),
  },
  {
    title: '支付人uid',
    dataIndex: 'payUserId',
    align: 'center',
    width: 160,
    ellipsis: true,
    render: (payUserId: any) => (
      <Tooltip overlay={undefined} placement="topLeft" title={payUserId ? payUserId : 'none'}>
        {payUserId ? payUserId : 'none'}
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
