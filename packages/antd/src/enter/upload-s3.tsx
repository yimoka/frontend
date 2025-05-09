/**
 * S3 文件上传组件
 *
 * 基于 Ant Design 的 Upload 组件封装，支持 S3 预签名 URL 上传
 *
 * @author 系统自动生成
 * @since 1.0.0
 * @category 组件
 * @group 上传
 *
 * @example
 * ```tsx
 * <UploadS3
 *   api={yourApi}
 *   maxSize={5 * 1024 * 1024}
 *   accept="image/*"
 *   beforeUpload={(file) => {
 *     return file.name.length < 100;
 *   }}
 * />
 * ```
 */

import { Trigger, TriggerProps, useUploadS3 } from '@yimoka/react';
import { IAPIExecutor, IStoreAPI } from '@yimoka/store';
import { Button, Upload, UploadProps } from 'antd';
import React from 'react';

/**
 * UploadS3 组件的属性定义
 *
 * @summary 继承自 Ant Design 的 Upload 组件属性，并添加了 S3 上传所需的特定属性
 */
export type UploadS3Props = Omit<UploadProps, 'customRequest' | 'data' | 'action' | 'method' | 'name'> & {
  /**
   * 获取上传地址的 API
   * @type {IStoreAPI}
   */
  api: IStoreAPI

  /**
   * 自定义 API 执行器
   * @type {IAPIExecutor}
   * @default useAPIExecutor()
   */
  apiExecutor?: IAPIExecutor

  /**
   * 自定义触发器属性
   * @type {TriggerProps}
   */
  trigger?: TriggerProps
}


/**
 * S3 文件上传组件
 *
 * @summary 封装了 S3 预签名 URL 上传逻辑，支持自定义 API 执行器和触发器
 *
 * @param {UploadS3Props} props - 组件属性
 * @returns {React.ReactElement} 上传组件
 */
export const UploadS3 = (props: UploadS3Props) => {
  const { api, trigger, apiExecutor, ...rest } = props;
  const customRequest = useUploadS3(api, apiExecutor) as UploadProps['customRequest'];

  return (
    <Upload {...rest} customRequest={customRequest}>
      <Trigger children="上传" component={Button} {...trigger} />
    </Upload>
  );
};
