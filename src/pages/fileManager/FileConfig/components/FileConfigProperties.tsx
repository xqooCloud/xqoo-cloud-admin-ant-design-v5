import {useModel} from "@@/plugin-model/useModel";
import React, {useEffect, useRef, useState} from "react";
import {Alert, Button, Divider, Modal, Result, Space} from "antd";
import ProSkeleton from "@ant-design/pro-skeleton";
import {ActionType, EditableProTable, ProColumns} from '@ant-design/pro-table';
import {find as _find, assign as _assign} from 'lodash';
import {CloudServerOutlined, CloudUploadOutlined} from "@ant-design/icons";
import {FileConfigProperties} from "@/pages/fileManager/FileConfig/data";
import {Prism} from "react-syntax-highlighter";
import {duotoneDark} from "react-syntax-highlighter/dist/esm/styles/prism";
import {getNowServerConfigProperties} from "@/pages/fileManager/FileConfig/service";
import {ResultStatusType} from "antd/lib/result";
import styles from "@/pages/fileManager/FileConfig/FileConfig.less";

export interface FileConfigPropertiesProps {
  parentConfigId: number;
  parentConfigType: string;
  parentConfigName: string;
  refreshCommand: string;
}

export default (props: FileConfigPropertiesProps) => {
  const actionRef = useRef<ActionType>();
  const {parentConfigId, parentConfigType, parentConfigName, refreshCommand} = props;
  const {fileConfigProperties, loading, handleLoading, hasError, errorMessage, alertTipsShow, alertTipsMessage,
    alertTipsType, getAllPropertiesByParentIdFromServer, updateConfigPropertiesToServer, refreshConfigToServer, alertTipsHandle} = useModel('fileManager.FileConfig.FileConfigPropertiesModel');
  const [localProperties, setLocalProperties] = useState<FileConfigProperties[]>([]);
  const [showServerData, setShowServerData] = useState<boolean>(false);
  const [serverData, setServerData] = useState<string>('');
  const [viewPropertiesType, setViewPropertiesType] = useState<ResultStatusType>('info');
  const [viewPropertiesTitle, setViewPropertiesTitle] = useState<string>('无数据');
  const [viewPropertiesMessage, setViewPropertiesMessage] = useState<string>('没有找到相关的缓存数据');

  const getConfigProperties = () => {
    getAllPropertiesByParentIdFromServer(parentConfigId);
  };

  useEffect(() => {
    if(parentConfigId){
      getConfigProperties();
    }
  }, [parentConfigId]);

  useEffect(() => {
    if(fileConfigProperties.length > 0){
      setLocalProperties(fileConfigProperties);
    }else{
      setLocalProperties([]);
    }
  }, [fileConfigProperties]);

  const getNewRecord = (): FileConfigProperties => {
    return {id: Math.ceil(Math.random() * 1000) * - 1 , parentId: parentConfigId, propertiesLabel: "", propertiesRemark: "", propertiesValue: ""}
  };

  const columns: ProColumns<FileConfigProperties>[] = [
    {
      dataIndex: 'id',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '配置key',
      dataIndex: 'propertiesLabel',
      ellipsis: true,
      tip: '参数的key的名字',
      formItemProps: {
        rules: [
          {
            required: true,
            max: 32,
            min: 2,
            message: '此项为必填项',
          },
        ],
      }
    },
    {
      title: '配置值',
      dataIndex: 'propertiesValue',
      ellipsis: true,
      tip: '对应配置参数key所需要的值',
      formItemProps: {
        rules: [
          {
            required: true,
            max: 512,
            min: 2,
            message: '此项为必填项',
          },
        ],
      }
    },
    {
      title: '说明',
      dataIndex: 'propertiesRemark',
      ellipsis: true,
      tip: '参数说明文本',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      }
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action.startEditable?.(record.id);
          }}
        >
          编辑
        </a>
      ],
    },
  ];

  const showNowServerData = (configType: string) => {
    getNowServerConfigProperties(configType).then(res => {
      setShowServerData(true);
      if(res.code === 200){
        setServerData(JSON.stringify(res.data, undefined, 2));
        setViewPropertiesType('info');
        setViewPropertiesTitle('无数据');
        setViewPropertiesMessage(`没有【${parentConfigName}】配置相关的缓存数据，请先发布配置参数`);
      }else{
        setViewPropertiesType('warning');
        setViewPropertiesTitle('获取数据出错');
        setViewPropertiesMessage(res.message);
      }
    }).catch(e => {
      setViewPropertiesType('error');
      setViewPropertiesTitle('获取数据出错');
      setViewPropertiesMessage(`获取服务器中【${parentConfigName}】配置的缓存数据发生错误，请稍后再试`);
    });
  };

  return (
    <div className={styles.backGroundDiv}>
      <Divider orientation="left">
        {
          parentConfigName ?
            <span>【{parentConfigName}】参数</span>
            :
            '请先选择平台'
        }
      </Divider>
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
      {
        parentConfigId ?
          <>
            {
              hasError ?
                <Result
                  key='PayPropertiesErrorKey'
                  status="error"
                  title="查出出错"
                  subTitle={errorMessage}
                  extra={
                    <Button
                      type="primary"
                      shape="round"
                      loading={handleLoading}
                      onClick={getConfigProperties}>
                      重试
                    </Button>
                  }
                />
                :
                <div className={styles.payPropertiesDiv}>
                  {
                    loading ?
                      <ProSkeleton type="list" list={2} />
                      :
                      <div>
                        <div style={{ padding: '20px'}}>
                          <Space>
                            <Button
                              type="primary"
                              loading={handleLoading}
                              disabled={localProperties.length < 1}
                              icon={<CloudUploadOutlined />}
                              onClick={async () => {await refreshConfigToServer(refreshCommand)}}
                            >
                              发布参数
                            </Button>
                            <Button
                              type="primary"
                              danger
                              loading={handleLoading}
                              disabled={localProperties.length < 1}
                              icon={<CloudServerOutlined />}
                              onClick={() => {showNowServerData(parentConfigType)}}
                            >
                              查看缓存
                            </Button>
                          </Space>
                        </div>
                        <EditableProTable<FileConfigProperties>
                          columns={columns}
                          actionRef={actionRef}
                          loading={handleLoading}
                          search={false}
                          recordCreatorProps={{
                            position: 'top',
                            record: getNewRecord(),
                            title: '增加一个参数'
                          }}
                          editable={{
                            actionRender: (row, config) => [
                              <Button
                                type="link"
                                size="small"
                                key="save"
                                loading={handleLoading}
                                onClick={async () => {
                                  const values = (await config?.form?.validateFields()) as FileConfigPropertiesProps;
                                  const obj = _assign({}, row, values[row.id]);
                                  await config?.onSave?.(config.recordKey, obj);
                                }}
                              >
                                保存
                              </Button>,
                              <Button
                                type="link"
                                size="small"
                                key="save"
                                onClick={async () => {
                                  await config?.onCancel?.(config.recordKey, row);
                                }}
                              >
                                取消
                              </Button>,
                            ],
                            onSave: async (addId, addValue) => {
                              const rtnData: FileConfigProperties|undefined = await updateConfigPropertiesToServer(addValue);
                              return new Promise((resolve) => {
                                if(rtnData){
                                  const obj = _find(localProperties, (item) => {return item.id === rtnData.id});
                                  const arr: FileConfigProperties[] = [];
                                  if(!obj){
                                    arr.push(rtnData);
                                    setLocalProperties(arr.concat(localProperties));
                                  }else{
                                    localProperties.forEach(item => {
                                      if(item.id === rtnData.id){
                                        arr.push(rtnData);
                                      }else{
                                        arr.push(item);
                                      }
                                    })
                                    setLocalProperties(arr);
                                  }
                                  resolve(true);
                                }
                                resolve(false);
                              });
                            },
                            onCancel: async (rowKey, value) => {
                              return new Promise((resolve) => {
                                actionRef.current?.cancelEditable(rowKey);
                                resolve(true);
                              });
                            },
                          }}
                          options={{
                            reload: false,
                            search: false,
                            density: true,
                            fullScreen: true,
                            setting: true,
                          }}
                          value={localProperties}
                          rowKey="id"
                          dateFormatter="string"
                          scroll={{ y: 380 }}
                        />
                      </div>
                  }
                </div>
            }
          </>
          :
          <div className={styles.payGroupDiv}>
            <Result
              key='PayPropertiesHasNotQueryKey'
              status="info"
              title="请先选择一个平台"
              subTitle="请先选择右侧的支付平台查看详细配置参数"
            />
          </div>
      }

      <Modal
        width={800}
        bodyStyle={{ padding: '32px 40px 48px'}}
        destroyOnClose
        title="当前服务器缓存数据"
        visible={showServerData}
        footer={null}
        maskClosable={false}
        onCancel={() => {
          setShowServerData(false);
        }}
      >
        <div className={[`${styles.jsonDiv}`, `${styles.divYScroll}`, `${styles.divOverFlowYScroll}`].join(' ')}>
          {
            (serverData && serverData !== '{}') ?
              <Prism
                showLineNumbers
                startingLineNumber={1}
                language="json"
                wrapLines
                style={duotoneDark}
              >
                {serverData}
              </Prism>
              :
              <Result
                status={viewPropertiesType}
                title={viewPropertiesTitle}
                subTitle={viewPropertiesMessage}
              />
          }

        </div>
      </Modal>
    </div>
  );
}
