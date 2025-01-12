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
