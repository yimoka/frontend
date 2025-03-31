import { isSuccess } from '@yimoka/shared';

import { httpGet } from '@/http';

// 获取服务器的时间戳 秒
export const getServerTime = async () => {
  const res = await httpGet('/base/iam/portal/timestamp');
  if (isSuccess(res)) {
    return Number(res.data);
  }
  return 0;
};

// 获取本地时间与服务器时间的差值
export const getDiffTime = async () => {
  const serverTime = await getServerTime();
  if (!serverTime) {
    return 0;
  }
  const localTime = new Date().getTime() / 1000;
  return serverTime - localTime;
};
