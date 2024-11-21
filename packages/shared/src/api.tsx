/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjKey } from './type';

/**
 * 判断响应是否成功。
 *
 * @param {Partial<IHTTPResponse>} [Response] - HTTP响应的部分对象。
 * @returns {boolean} 如果响应码为成功码，则返回true，否则返回false。
 */
export const isSuccess = (Response?: Partial<IHTTPResponse>) => Response?.code === IHTTPCode.success;

/**
 * 判断是否为错误请求 (Bad Request)。
 *
 * @param {Partial<IHTTPResponse>} [Response] - HTTP 响应对象的部分属性。
 * @returns {boolean} 如果响应码为 `badRequest`，则返回 `true`，否则返回 `false`。
 */
export const isBadRequest = (Response?: Partial<IHTTPResponse>) => Response?.code === IHTTPCode.badRequest;

/**
 * 检查响应是否为未授权状态。
 *
 * @param {Partial<IHTTPResponse>} [Response] - 部分 HTTP 响应对象。
 * @returns {boolean} 如果响应代码为未授权，则返回 true。
 */
export const isUnauthorized = (Response?: Partial<IHTTPResponse>) => Response?.code === IHTTPCode.unauthorized;

/**
 * 检查响应是否为禁止访问状态。
 *
 * @param {Partial<IHTTPResponse>} [Response] - 部分 HTTP 响应对象。
 * @returns {boolean} 如果响应代码为禁止访问状态，则返回 true。
 */
export const isForbidden = (Response?: Partial<IHTTPResponse>) => Response?.code === IHTTPCode.forbidden;

/**
 * 判断响应是否为禁止访问状态
 *
 * @param {Partial<IHTTPResponse>} [Response] - HTTP响应的部分对象
 * @returns {boolean} 如果响应代码为禁止访问状态，则返回true
 */
export const isNetworkError = (Response?: Partial<IHTTPResponse>) => Response?.code === IHTTPCode.networkError;

/**
 * 根据状态码返回对应的 HTTP 代码。
 *
 * @param {number} status - HTTP 状态码。
 * @returns {number} 如果状态码在 200 到 299 之间，返回 IHTTPCode.success，否则返回原始状态码。
 */
export const getCodeByStatus = (status: number) => ((status >= 200 && status < 300) ? IHTTPCode.success : status);

/**
 * HTTP响应接口
 *
 * @template R 响应数据类型，默认为 `any`
 * @template P 请求配置参数类型，默认为 `any`
 *
 * @property {IHTTPCode | number} code 响应状态码，可以是自定义的 `IHTTPCode` 或数字
 * @property {string} msg 响应信息
 * @property {R} data 响应数据
 * @property {IAPIRequestConfig<P>} [config] 请求配置，可选
 * @property {number} [status] HTTP状态码，可选
 * @property {string} [statusText] HTTP状态文本，可选
 * @property {Record<ObjKey, any>} [headers] 响应头信息，可选
 * @property {any} [key: string] 其他任意附加属性
 */
export interface IHTTPResponse<R = any, P = any> {
  code: IHTTPCode | number
  msg: string,
  data: R
  config?: IAPIRequestConfig<P>
  status?: number;
  statusText?: string;
  headers?: Record<ObjKey, any>;
  [key: string]: any
}

/**
 * API 请求的配置对象。
 *
 * @template V - 请求参数和数据的类型。
 *
 * @property {string} [url] - API 端点的 URL。
 * @property {IMethod | string} [method] - 请求使用的 HTTP 方法。
 * @property {V | any} [params] - 要随请求发送的 URL 参数。
 * @property {V} [data] - 要随请求发送的数据。
 * @property {any} [key: string] - 任何其他附加属性。
 */
export type IAPIRequestConfig<V = any> = {
  url?: string,
  method?: IMethod | string,
  params?: V | any,
  data?: V,
  [key: string]: any
};


/**
 * 表示分页数据的接口。
 *
 * @template T - 页中数据项的类型。默认为键为 `ObjKey` 类型，值为任意类型的记录。
 *
 * @property {number} page - 当前页码。
 * @property {number} pageSize - 每页的项目数。
 * @property {number} total - 项目总数。
 * @property {number} totalPages - 总页数。
 * @property {T[]} data - 当前页的数据项数组。
 * @property {any} [key: string] - 可以动态添加的其他属性。
 */
export interface IPageData<T extends object = Record<ObjKey, any>> {
  page: number,
  pageSize: number,
  total: number,
  totalPages: number,
  data: T[],
  [key: string]: any
}

/**
 * HTTP状态码枚举。
 *
 * @enum {number}
 * @readonly
 * @property {number} success - 请求成功，状态码为0。
 * @property {number} badRequest - 错误请求，状态码为400。
 * @property {number} unauthorized - 未授权，状态码为401。
 * @property {number} forbidden - 禁止访问，状态码为403。
 * @property {number} networkError - 网络错误，状态码为600。
 */
export enum IHTTPCode {
  success = 0,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  networkError = 600,
}

/**
 * HTTP 请求方法类型。
 *
 * 该类型定义了常见的 HTTP 请求方法，包括：
 * - 'GET': 获取资源
 * - 'DELETE': 删除资源
 * - 'HEAD': 获取资源的头部信息
 * - 'OPTIONS': 获取资源的可用选项
 * - 'POST': 创建资源
 * - 'PUT': 更新资源
 * - 'PATCH': 部分更新资源
 * - 'PURGE': 清除缓存
 * - 'LINK': 建立资源之间的关系
 * - 'UNLINK': 解除资源之间的关系
 *
 * 还可以是任意字符串，以支持自定义方法。
 */
export type IMethod = 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'PURGE' | 'LINK' | 'UNLINK' | string;
