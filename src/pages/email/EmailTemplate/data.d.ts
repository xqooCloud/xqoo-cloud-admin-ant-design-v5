import {PageRequest} from "@/services/PublicInterface";

export interface EmailTemplateInfo {
  id: number;
  templateName: string;
  templateType: number;
  emailSubject: string;
  emailText: string;
  emailFilePath: string;
  emailFileName: string;
  delFlag: number;
  createBy: string;
  createDate: string;
  updateBy: string;
  updateDate: string;
}

export interface QueryEmailTemplateInfo extends PageRequest{
  templateName?: string;
  emailSubject?: string;
}

