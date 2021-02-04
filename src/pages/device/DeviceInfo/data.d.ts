import {PageRequest} from "@/services/PublicInterface";


export interface DeviceInfoEntity{
  id: string;
  delFlag: number;
  screenStatus?: number;
  hasSaleInfo?: boolean;
  screenPositionLong?: number;
  screenPositionLati?: number;
  screenSize?: number;
  screenMaxSourceCount?: number;
  screenName?: string;
  screenAddress?: string;
  screenLabel?: string[];
  screenInstaller?: string;
  screenInstallerPhone?: string;
  screenTips?: string;
  createDate?: string;
  createBy?: string;
  updateDate?: string;
  updateBy?: string;
  remarkTips?: string;
}

export interface DeviceDetailEntity extends DeviceInfoEntity{
  propertiesList: ScreenProperties[];
  pictureList: ScreenPictureVo[];
}

export interface DeviceConfigProperties{
  minPropertiesCount: number;
  maxPropertiesCount: number;
  maxImageCount: number;
  maxImageSize: number;
  screenMaxSourceCount: number;
  labelList: {value: string, key: string}[];
}

export interface ScreenProperties{
  id?: number;
  parentId: number;
  propertiesLabel: string;
  propertiesValue: string;
  sortNo?: number;
}

export interface ScreenPictureVo extends ScreenPicture{
  url: string;
  status: string;
  percent: number;
  uid: string;
  key: string
}

export interface ScreenPicture{
  fileId: string;
  fileName: string;
  filePath: string;
  id?: number;
  parentId: number;
  sortNo?: number;
}

export interface DeviceInfoQuery extends PageRequest{
  screenStatus?: number;
  screenSize?: number;
  screenName?: string;
}
