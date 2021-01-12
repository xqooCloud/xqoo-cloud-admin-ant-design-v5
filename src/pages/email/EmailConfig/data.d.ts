import {PageRequest} from "@/services/PublicInterface";

export interface EmailConfigInfo {
  id: number;
  configKey: string;
  configValue: string;
  emailGroup: string;
}

export interface QueryEmailConfigInfo extends PageRequest{
  configKey?: string;
  emailGroup?: string;
}

