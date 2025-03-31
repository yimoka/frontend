// root 私有数据管理

import { Link } from '@yimoka/antd';
import { useRoot } from '@yimoka/react';
import { IAny, IHTTPCode, isBlank } from '@yimoka/shared';
import { rootStore } from '@yimoka/store';

import React from 'react';

import { getLocalLanguage, setLocalLanguage } from './local';


const dataKey = {
  authErr: 'authErr',
  // 员工
  staff: 'staff',
  // 语言
  language: 'language',
  // apiMap
  apiMap: 'apiMap',
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

export const setApiMap = (data: IApiMap) => {
  rootStore.setDataItem(dataKey.apiMap, data);
};

export const useApiMap = () => rootStore.getDataItem(dataKey.apiMap) as IApiMap | undefined;

export type IApiMap = Map<string, boolean>;

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

// 处理权限的数据
export const handlePermission = (data: IPermissionTreeItem[]) => {
  const apiMap = new Map<string, boolean>();
  const handleTree = (tree?: IPermissionTreeItem[], level = 0): IAny => tree?.filter((item) => {
    const { isAPI, isMenu, isPage, path } = item;
    isAPI && apiMap.set(path, true);
    return isMenu || isPage;
  }).map((item) => {
    const { path, name, icon, children } = item;
    const child = handleTree(children, level + 1);
    return {
      title: name,
      key: path,
      label: level === 0 || isBlank(child) ? <Link style={{ color: 'inherit' }} to={path}>{name}</Link> : name,
      icon: icon ? icon : undefined,
      children: isBlank(child) ? undefined : child,
    };
  });
  rootStore.setMenus(handleTree(data));
  setApiMap(apiMap);
};

export type IPermissionTreeItem = {
  key: string;
  id: string
  updateTime: string
  createTime: string
  parentID: string
  name: string
  path: string
  icon: string
  sort: number
  desc: string
  isMenu: string
  isPage: string
  isAPI: string
  children: IPermissionTreeItem[];
};
