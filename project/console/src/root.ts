// root 私有数据管理

import { useRoot } from '@yimoka/react';
import { IHTTPCode } from '@yimoka/shared';
import { rootStore } from '@yimoka/store';

const dataKey = {
  authErr: 'authErr',
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
