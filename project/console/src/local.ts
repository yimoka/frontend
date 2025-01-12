import { isSuccess } from '@yimoka/shared';

import { httpPost } from './http';


export const localKey = {
  clientID: 'clientID',
  staffID: 'staffID',
  site: 'site',
  token: 'token', // 员工的 token
  tenantID: 'tenantID',
  userID: 'userID',
  userToken: 'userToken', // 统一用户的 token
};

let clientID = '';
export const getClientID = async () => {
  if (clientID) {
    return clientID;
  }

  const id = localStorage.getItem(localKey.clientID);

  if (id) {
    clientID = id;
    return id;
  }

  const res = await getFetchClientID();
  if (res) {
    clientID = res;
    localStorage.setItem(localKey.clientID, res);
  }
  return clientID;
};

// 同步获取 ClientID
export const getClientIDSync = () => {
  if (clientID) {
    return clientID;
  }
  const id = localStorage.getItem(localKey.clientID);
  if (id) {
    clientID = id;
    return id;
  }
  return '';
};

// 删除 ClientID
export const removeClientID = () => {
  localStorage.removeItem(localKey.clientID);
  clientID = '';
};


// 懒式单例远程获取 ClientID
let fetchClientID: Promise<string> | null = null;
const getFetchClientID = () => {
  if (!fetchClientID) {
    fetchClientID = new Promise<string>((resolve) => {
      httpPost('/admin/tenant/bff/id/create').then(res => resolve(isSuccess(res) ? res.data : ''));
    });
  }
  return fetchClientID;
};
