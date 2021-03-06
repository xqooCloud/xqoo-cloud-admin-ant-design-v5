import {SysUserStatusEnum, SysUserTypeEnum} from "@/pages/system/UserManager/enums";

export interface SysUserDetail {
  userId: string;
  loginId: string;
  userStatus?: SysUserStatusEnum;
  userStatusName?: string;
  userType?: SysUserTypeEnum;
  userTypeName?: string;
  userName?: string;
  userPhone?: string;
  userEmail?: string;
  lastLoginTime?: string;
  roleCount: number;
  checked: boolean;
  profileUrl?: string;
  createBy?: string;
  createDate?: string;
  updateBy?: string;
  updateDate?: string;
  remarkTips?: null
}

export interface QueryListParam {
  userId?: string;
  loginId?: string;
  page: number;
  pageSize: number;
  userName?: string;
  userStatus?: number;
  userType?: number;
  userPhone?: string;
}

export interface AddUserInfoParam {
  loginId: string;
  userName: string;
  userType: number;
  userPhone?: string;
  userEmail?: string;
  password: string;
  confirmPassword: string;
}
