/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCodeByStatus, IAnyObject, IHTTPCode, IHTTPResponse, isVacuous } from '@yimoka/shared';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { getClientIDSync } from './local';
import { getLanguage, setAuthErr } from './root';
import { getStaffToken } from './token';

export const TENANT_ID = '1000';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'x-md-global-channel': 'web',
    'x-md-global-use-type': 'platform',
    'x-md-global-platform': navigator.platform,
    // 平台固定租户 ID
    'x-md-global-tenantID': TENANT_ID,
  },
});

// 请求拦截器 处理凭证以及请求头
http.interceptors.request.use((config) => {
  const newConfig = config;
  if (isVacuous(newConfig.headers.Authorization)) {
    // 除了用户相关接口，其他接口都默认带上员工 token
    newConfig.headers.Authorization = getStaffToken();
  }
  if (isVacuous(newConfig.headers['x-md-global-client-id'])) {
    newConfig.headers['x-md-global-client-id'] = getClientIDSync();
  }
  // 通过 headers accept-language 传递的语言在无法在微服务内部 RPC 中传递，需要通过 headers x-md-global-language 传递
  if (isVacuous(newConfig.headers['x-md-global-language'])) {
    newConfig.headers['x-md-global-language'] = getLanguage();
  }
  return newConfig;
});

// 响应拦截器 处理错误 未登录等
http.interceptors.response.use(response => response, (err) => {
  const { response } = err;
  const code = response?.code;
  if (code === IHTTPCode.unauthorized || code === IHTTPCode.forbidden) {
    setAuthErr({ code, url: err?.config?.url, metadata: response?.data?.metadata });
  }
  return Promise.reject(err);
});

// 将 response 处理为统一的 { code, data, msg } 格式 并且不会抛出异常
export const httpRequest: IHTTPRequest = async (config) => {
  try {
    const { method, data, ...rest } = config;
    let curData = data as Record<string | number | symbol, any>;
    // post data 为空时 会导致 content-type 为 null
    if (method?.toLowerCase() === 'post') {
      curData = data ?? {};
    }
    const response = await http({ method, data: curData, ...rest });
    return handleResponse(response);
  } catch (e: any) {
    const { response, ...args } = e;
    if (!response) {
      return handleResponse({
        ...args,
        status: IHTTPCode.networkError,
        statusText: e?.message ?? '网络出错',
      });
    }
    return handleResponse(response);
  }
};

export const httpGet: IHTTPGet = (url, config) => httpRequest({ ...config, url, method: 'get' });
export const httpDelete: IHTTPGet = (url, config) => httpRequest({ ...config, url, method: 'delete' });
export const httpHead: IHTTPGet = (url, config) => httpRequest({ ...config, url, method: 'head' });
export const httpOptions: IHTTPGet = (url, config) => httpRequest({ ...config, url, method: 'options' });

export const httpPost: IHTTPPost = (url, data, config) => httpRequest({ ...config, url, data, method: 'post' });
export const httpPut: IHTTPPost = (url, data, config) => httpRequest({ ...config, url, data, method: 'put' });
export const httpPatch: IHTTPPost = (url, data, config) => httpRequest({ ...config, url, data, method: 'patch' });

// 处理请求返回的数据

// eslint-disable-next-line complexity
export const handleResponse = <T = Record<string | number | symbol, any>>(response: AxiosResponse<T>): IHTTPResponse<T> => {
  const { status, statusText } = response;
  const resData = getResponseData(response);
  const res = {
    ...response,
    ...resData,
    code: typeof resData?.code === 'number' ? resData?.code : getCodeByStatus(status),
    msg: resData?.msg ?? resData?.message ?? statusText,
  };

  // 在 rpc 中返回的数据必须是一个对象 约定包多一层 value 或 data 在这里统一处理
  const { data } = res;
  if (data && typeof data === 'object') {
    const objData = data as IAnyObject;
    const keys = Object.keys(objData);
    if (keys.length === 1) {
      // pb 会将 value 包一层
      if (keys[0] === 'value') {
        res.data = objData.value;
      }
      if (keys[0] === 'data') {
        res.data = objData.data;
      }
    }
  }
  return res;
};

// 获取 response data 适配 { code, msg, data } 格式 或者直接返回 response
export const getResponseData = (response: AxiosResponse): Record<string | number | symbol, any> => {
  const { data } = response;
  return (typeof data?.code !== 'undefined'
    && (typeof data?.msg !== 'undefined' || typeof data?.message !== 'undefined' || typeof data?.data !== 'undefined')) ? { data: null, ...data } : response;
};

export type IHTTPRequest = <R = any, P = any>(config: AxiosRequestConfig<P>) => Promise<IHTTPResponse<R, P>>;

export type IHTTPGet = <R = any, P = any>(url: string, config?: AxiosRequestConfig<P>) => Promise<IHTTPResponse<R, P>>;

export type IHTTPPost = <R = any, P = Record<string | number | symbol, any>> (url: string, data?: P, config?: AxiosRequestConfig<P>) => Promise<IHTTPResponse<R, P>>;
