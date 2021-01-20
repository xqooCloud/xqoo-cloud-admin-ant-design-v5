export interface FileManagerConfig{
  id: number;
  uploadPlat: string;
  configStatus: number;
  uploadPlatName: string;
  refreshCommand: string;
  checked: boolean;
  createBy: string;
  createDate: string;
  updateBy: string;
  updateDate: string;
  remarkTips: string;
}

export interface FileConfigProperties{
  id: number;
  parentId: number;
  propertiesLabel: string;
  propertiesValue: string;
  propertiesRemark: string;
  createBy?: string;
  createDate?: string;
  updateBy?: string;
  updateDate?: string;
  remarkTips?: string;
}
