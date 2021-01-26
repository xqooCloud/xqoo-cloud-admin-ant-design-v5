import {PageContainer} from "@ant-design/pro-layout";
import React, {ReactNode, useEffect, useState} from "react";
import {Alert, Badge, Button, Col, Divider, Form, Input, Modal, Result, Row, Select, Space, Table, Tooltip} from "antd";
import {useModel} from "@@/plugin-model/useModel";
import {ColumnsType} from "antd/es/table";
import {assign as _assign} from "lodash";
import {FileRecordEntity, QueryFileRecord} from "@/pages/fileManager/FileRecord/data";
import {UploadPlatEnum} from "@/pages/fileManager/FileConfig/enums";
import {
  AliyunOutlined,
  CloudUploadOutlined,
  HddFilled,
  QqOutlined,
  TeamOutlined,
  UsergroupDeleteOutlined
} from "@ant-design/icons";
import styles from "@/pages/fileManager/FileRecord/FileRecord.less";
import QueueAnim from "rc-queue-anim";

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

const FileRecord: React.FC<{}> = () => {
  const { fileRecordList, totalElements, loading, hasError, errorMessage, getFileRecord, alertTipsShow, alertTipsType, alertTipsMessage, alertTipsHandle, delFile} = useModel('fileManager.FileRecord.FileRecordModel');
  const [queryForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<QueryFileRecord>({page: 1, pageSize: 20});

  useEffect(() => {
    getFileRecord(queryParams);
  }, []);

  // 渲染图标
  const renderUploadPlatIconAndText = (plat: string): ReactNode => {
    let node: ReactNode = <></>;
    switch (plat) {
      case UploadPlatEnum.ALI:
        node = <span className={styles.payGroupIcon}><AliyunOutlined /> 阿里云</span>;
        break;
      case UploadPlatEnum.TENCENT:
        node = <span className={styles.payGroupIcon}><QqOutlined /> 腾讯云</span>;
        break;
      case UploadPlatEnum.QINIU:
        node = <span className={styles.payGroupIcon}><CloudUploadOutlined /> 七牛云</span>;
        break;
      case UploadPlatEnum.LOCAL:
        node = <span className={styles.payGroupIcon}><HddFilled /> 本地服务器</span>;
        break;
      default:
        node = <span className={styles.payGroupIcon}><CloudUploadOutlined /> 云端服务器</span>;
    }
    return node;
  };

  const removeFileToServer = (fileId: string) => {
    Modal.confirm({
      okText: '确认',
      cancelText: '取消',
      title: '确认信息',
      content: '是否确认删除文件？',
      onOk: () => {
        delFile(fileId).then(res => {
          if(res){
            getFileRecord(_assign(queryParams, queryForm.getFieldsValue()))
          }
        }).catch(e => {
          console.error('[delete user error!]', e)
        });
      },
    });
  };

  const columns: ColumnsType<FileRecordEntity> = [
    {
      title: '记录id',
      dataIndex: 'id',
      width: 100,
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
      title: '上传平台',
      dataIndex: 'uploadPlat',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text, row, index) => {
        return renderUploadPlatIconAndText(text);
      }
    },
    {
      title: '上传方式',
      dataIndex: 'uploadType',
      align: 'center',
      ellipsis: true,
      width: 130,
      render: (uploadType: any) => {
        if(uploadType === 0) {
          return <Badge color='green' text="前端上传" />
        }else if(uploadType === 1){
          return <Badge color='red' text="后端上传" />
        }else{
          return <Badge color='yellow' text="后端签名" />
        }
      }
    },
    {
      title: '状态',
      dataIndex: 'uploadStatus',
      align: 'center',
      ellipsis: true,
      width: 150,
      render: (uploadStatus: any) => {
        if(uploadStatus === 'INIT') {
          return <Badge color='#404040' text="初始化未上传" />
        }else if(uploadStatus === 'UPLOADING'){
          return <Badge color='yellow' text="上传中" />
        }else if(uploadStatus === 'OFFLINE'){
          return <Badge color='red' text="上传中断" />
        }else if(uploadStatus === 'CANCEL'){
          return <Badge color='black' text="取消上传" />
        }else{
          return <Badge color='green' text="上传完成" />
        }
      }
    },
    {
      title: '权限',
      dataIndex: 'accessType',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (accessType: any) => {
        if(accessType === 'public') {
          return <span><TeamOutlined />公共读取</span>
        }else{
          return <span><UsergroupDeleteOutlined />私有存储</span>
        }
      }
    },
    {
      title: '文件MD5',
      dataIndex: 'platFileMd5',
      align: 'center',
      ellipsis: true,
      width: 200,
      render: (platFileMd5: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={platFileMd5}>
          {platFileMd5}
        </Tooltip>
      ),
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
      align: 'center',
      ellipsis: true,
      width: 200,
      render: (fileName: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={fileName}>
          {fileName}
        </Tooltip>
      ),
    },
    {
      title: '文件类型',
      dataIndex: 'fileMimeType',
      align: 'center',
      ellipsis: true,
      width: 200,
      render: (fileMimeType: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={fileMimeType}>
          {fileMimeType}
        </Tooltip>
      ),
    },
    {
      title: '文件相对路径',
      dataIndex: 'fileRelativePath',
      align: 'center',
      ellipsis: true,
      width: 180,
      render: (fileRelativePath: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={fileRelativePath}>
          {fileRelativePath}
        </Tooltip>
      ),
    },
    {
      title: '文件路径',
      dataIndex: 'fileUrlPath',
      align: 'center',
      ellipsis: true,
      width: 130,
      render: (fileUrl: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={fileUrl}>
          {fileUrl}
        </Tooltip>
      ),
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      align: 'center',
      ellipsis: true,
      width: 140,
      render: (fileSize: any) => {
        let showTip = '小于1Kb';
        if(fileSize < 1024){
          showTip = '小于1Kb';
        }
        if(fileSize< 1024 * 1024 && fileSize > 1024){
          showTip = `约${(fileSize / 1024).toFixed(1)}Kb`;
        }
        if(fileSize < 1024 * 1024 * 1024 && fileSize > 1024 * 1024){
          showTip = `约${(fileSize / 1024 / 1024).toFixed(1)}Mb`;
        }
        if(fileSize < 1024 * 1024 * 1024 * 1024 && fileSize > 1024 * 1024 * 1024){
          showTip = `约${(fileSize / 1024 / 1024 / 1024).toFixed(1)}Gb`;
        }
        if(fileSize < 1024 * 1024 * 1024 * 1024 * 1024 && fileSize > 1024 * 1024 * 1024 * 1024){
          showTip = `约${(fileSize / 1024 / 1024 / 1024 / 1024).toFixed(1)}Gb`;
        }
        return <Tooltip overlay={undefined} placement="topLeft" title={showTip}>
          {showTip}
        </Tooltip>
      },
    },
    {
      title: '文件所在bucket',
      dataIndex: 'fileBucket',
      align: 'center',
      ellipsis: true,
      width: 120,
      render: (fileBucket: any) => (
        <Tooltip overlay={undefined} placement="topLeft" title={fileBucket}>
          {fileBucket}
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
      width: 180,
      render: (text, row, index) => (
        <Space size="small">
          <a onClick={ async () => {removeFileToServer(row.id)}}>删除文件</a>
        </Space>
      ),
    },
  ];

  // 查询表单提交
  const onFinish = (values: any) => {
    getFileRecord(_assign(queryParams, values));
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const pageNowInfo = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };
    setQueryParams(pageNowInfo);
    getFileRecord(_assign(pageNowInfo, queryForm.getFieldsValue()));
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
                label="文件前缀"
                name="fileRelativePath">
                <Input placeholder="请输入文件前缀，可以此来筛选文件夹" />
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="文件权限"
                name="accessType">
                <Select allowClear placeholder="请选择文件权限">
                  <Select.Option value="public">公开读</Select.Option>
                  <Select.Option value="protected">私有读</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="上传平台"
                name="uploadPlat">
                <Select allowClear placeholder="请选择上传平台">
                  <Select.Option value="ALI">阿里云</Select.Option>
                  <Select.Option value="TENCENT">腾讯云</Select.Option>
                  <Select.Option value="QINIU">七牛云</Select.Option>
                  <Select.Option value="LOCAL">本地服务器</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={5} xs={24}>
              <Form.Item
                label="上传状态"
                name="uploadStatus">
                <Select allowClear placeholder="请选择上传状态">
                  <Select.Option value="INIT">初始化</Select.Option>
                  <Select.Option value="UPLOADING">上传中</Select.Option>
                  <Select.Option value="OFFLINE">上传中断</Select.Option>
                  <Select.Option value="CANCEL">取消上传</Select.Option>
                  <Select.Option value="FINISH">上传完成</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={4} xs={0}/>
            <Col md={5} xs={24}>
              <Form.Item
                label="上传类型"
                name="uploadType">
                <Select allowClear placeholder="请选择上传类型">
                  <Select.Option value={0}>前端上传</Select.Option>
                  <Select.Option value={1}>后端上传</Select.Option>
                  <Select.Option value={2}>后端签名</Select.Option>
                </Select>
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
            <Table<FileRecordEntity>
              size="small"
              columns={columns}
              rowKey={record => record.id}
              dataSource={fileRecordList}
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

export default FileRecord;
