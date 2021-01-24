import {PageRequest} from "@/services/PublicInterface";

export interface FileRecordEntity{
  id: string;
  delFlag: 0|1;
  uploadPlat: 'ALI'|'TENCENT'|'QINIU'|'LOCAL';
  uploadType: 0|1|2;
  uploadStatus: 'INIT'|'UPLOADING'|'OFFLINE'|'CANCEL'|'FINISH';
  accessType: 'public'|'protected';
  platFileMd5: string;
  fileName: string;
  fileMimeType: string;
  fileMd5: string;
  fileRelativePath: string;
  fileUrlPath: string;
  fileInitTime: number;
  fileFinishTime: number
  fileUploadSpendTime: number
  fileBucket: string;
  fileSize: number
  createDate: string;
  createBy: string;
  updateDate: string;
  updateBy: string;
  remarkTips: string;
}

export interface QueryFileRecord extends PageRequest{
  accessType?: 'public'|'protected';
  fileRelativePath?: string;
  uploadPlat?: 'ALI'|'TENCENT'|'QINIU'|'LOCAL';
  uploadStatus?: string;
  uploadType?: number;
}
