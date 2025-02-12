import { localKey } from './local';

let userToken = '';
export const getUserToken = () => {
  if (userToken) {
    return userToken;
  }
  const tokenStr = localStorage.getItem(localKey.userToken);
  if (tokenStr) {
    userToken = tokenStr;
    return tokenStr;
  }
  return '';
};

export const setUserToken = (tokenStr: string) => {
  userToken = tokenStr;
  localStorage.setItem(localKey.userToken, userToken ?? '');
};

let staffToken = '';
export const getStaffToken = () => {
  if (staffToken) {
    return staffToken;
  }
  const tokenStr = localStorage.getItem(localKey.staffToken);
  if (tokenStr) {
    staffToken = tokenStr;
    return tokenStr;
  }
  return '';
};

export const setStaffToken = (tokenStr: string) => {
  staffToken = tokenStr;
  localStorage.setItem(localKey.staffToken, staffToken ?? '');
};
