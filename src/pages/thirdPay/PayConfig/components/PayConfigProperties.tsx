import {useModel} from "@@/plugin-model/useModel";
import React, {useEffect, useRef, useState} from "react";
import {Alert, Button, Divider, Result} from "antd";
import ProSkeleton from "@ant-design/pro-skeleton";
import {ActionType, EditableProTable, ProColumns} from '@ant-design/pro-table';
import {PayConfigProperties} from "@/pages/thirdPay/PayConfig/data";
import {find as _find, assign as _assign} from 'lodash';
import {CloudUploadOutlined} from "@ant-design/icons";
import styles from "@/pages/thirdPay/PayConfig/PayConfig.less";

export interface PayConfigPropertiesProps{
  parentPayGroupId: number;
  parentPayGroupVersion: number;
  parentPayGroupName: string;
  refreshCommand: string;
}

export default (props: PayConfigPropertiesProps) => {
  const actionRef = useRef<ActionType>();
  const {parentPayGroupId, parentPayGroupVersion, parentPayGroupName, refreshCommand} = props;
  const {payConfigProperties, loading, handleLoading, hasError, errorMessage, alertTipsShow, alertTipsMessage,
    alertTipsType, getPayConfigProperties, updateConfigPropertiesToServer, refreshConfigToServer, alertTipsHandle} = useModel('thirdPay.PayConfig.PayConfigPropertiesModel');
  const [localProperties, setLocalProperties] = useState<PayConfigProperties[]>([]);

  const getConfigProperties = () => {
    getPayConfigProperties({parentId: parentPayGroupId, parentVersion: parentPayGroupVersion});
  };

  useEffect(() => {
    if(parentPayGroupId && parentPayGroupVersion){
      getConfigProperties();
    }
  }, [parentPayGroupId]);

  useEffect(() => {
    if(payConfigProperties.length > 0){
      setLocalProperties(payConfigProperties);
    }else{
      setLocalProperties([]);
    }
  }, [payConfigProperties]);


  const getNewRecord = (): PayConfigProperties => {
    return {id: Math.ceil(Math.random() * 1000) * - 1 , parentId: parentPayGroupId, parentVersion: parentPayGroupVersion, propertiesLabel: "", propertiesRemark: "", propertiesValue: ""}
  }

  const columns: ProColumns<PayConfigProperties>[] = [
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

  return (
    <div className={styles.backGroundDiv}>
      <Divider orientation="left">
        {
          parentPayGroupName ?
            <span>【{parentPayGroupName}】参数</span>
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
        parentPayGroupId ?
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
                      <ProSkeleton type="list" />
                      :
                      <div>
                        <div style={{ padding: '20px'}}>
                          <Button
                            type="primary"
                            loading={handleLoading}
                            disabled={localProperties.length < 1}
                            icon={<CloudUploadOutlined />}
                            onClick={async () => {await refreshConfigToServer(refreshCommand)}}
                          >
                            发布参数
                          </Button>
                        </div>
                        <EditableProTable<PayConfigProperties>
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
                                  const values = (await config?.form?.validateFields()) as PayConfigProperties;
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
                              const rtnData: PayConfigProperties|undefined = await updateConfigPropertiesToServer(addValue);
                              return new Promise((resolve) => {
                                if(rtnData){
                                  const obj = _find(localProperties, (item) => {return item.id === rtnData.id});
                                  const arr: PayConfigProperties[] = [];
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
    </div>
  );
}
