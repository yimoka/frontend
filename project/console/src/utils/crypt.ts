// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { encrypt as sEncrypt } from '@yimoko/safe';

import { getClientID } from '@/local';

import { getServerTime } from './time';

let diff: number | null = null;

export const encrypt = async (value: string, action: string, preventReplay = true) => {
  let timestamp = Math.floor(new Date().getTime() / 1000);
  if (diff === null) {
    const serverTime = await getServerTime();
    if (serverTime) {
      diff = serverTime - timestamp;
      timestamp = serverTime;
    }
  } else if (Math.abs(diff) > 120) {
    const serverTime = await getServerTime();
    if (serverTime) {
      diff = serverTime - timestamp;
      timestamp = serverTime;
    }
  }
  const id = await getClientID();
  return sEncrypt(value, { id, timestamp, action, preventReplay });
};


