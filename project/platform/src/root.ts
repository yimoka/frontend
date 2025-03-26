// root 私有数据管理

import { useRoot } from '@yimoka/react';
import { IHTTPCode } from '@yimoka/shared';
import { rootStore } from '@yimoka/store';

import { getLocalLanguage, setLocalLanguage } from './local';


const dataKey = {
  authErr: 'authErr',
  // 员工
  staff: 'staff',
  // 语言
  language: 'language',
};


export type IAuthErrData = {
  code: IHTTPCode,
  url: string,
  metadata?: { isChangePassword?: boolean }
  processing?: boolean
}

export const setAuthErr = (data: IAuthErrData) => {
  if (rootStore.getDataItem(dataKey.authErr)?.processing) {
    return;
  }
  rootStore.setDataItem(dataKey.authErr, data);
};

export const useAuthErr = () => {
  const root = useRoot();
  return root.getDataItem(dataKey.authErr) as IAuthErrData | null;
};

export const clearAuthErr = () => {
  rootStore.setDataItem(dataKey.authErr, null);
};

export const setStaff = (data: IStaff) => {
  rootStore.setDataItem(dataKey.staff, data);
};

export const useStaff = () => rootStore.getDataItem(dataKey.staff) as IStaff | null;

export const clearStaff = () => {
  rootStore.setDataItem(dataKey.staff, null);
};

export const setLanguage = (lang: string) => {
  rootStore.setDataItem(dataKey.language, lang);
  setLocalLanguage(lang);
};

export const getLanguage = () => {
  const rLang = rootStore.getDataItem(dataKey.language);
  if (rLang) {
    return rLang;
  }

  const localLang = getLocalLanguage();
  if (localLang) {
    rootStore.setDataItem(dataKey.language, localLang);
    return localLang;
  }

  return navigator.language;
};

export const useLanguage = () => getLanguage();

export interface IStaff {
  id: string
  name: string
  realName: string
  avatar: string
  isChangePassword: boolean
  userID: string
  createTime: string
  updateTime: string
  tenantID: number
  phonePrefix: string
  phone: string
  mail: string
  switch: boolean
  creatorByStaff: string
  updaterByStaff: string
}
