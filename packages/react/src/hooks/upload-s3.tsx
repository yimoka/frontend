import { IAnyObject, isSuccess } from '@yimoka/shared';
import { IAPIExecutor, IStoreAPI, runAPI } from '@yimoka/store';
import { useCallback, useMemo } from 'react';

import { useAPIExecutor } from '../context/config';

interface UploadOptions {
  file: File;
  onSuccess?: (data: IAnyObject, fileOrXhr?: File | XMLHttpRequest) => void;
  onError?: (error: Error, file?: File) => void;
  onProgress?: (event: { percent: number }, file?: File) => void;
}

/**
 * 使用 S3 上传的自定义 Hook
 *
 * @summary 封装了 S3 预签名 URL 上传逻辑
 *
 * @param {IStoreAPI} api - 获取上传地址的 API
 * @param {IAPIExecutor} [apiExecutor] - 自定义 API 执行器
 * @returns {UploadProps['customRequest']} 上传请求处理函数
 */
export const useUploadS3 = (api: IStoreAPI, apiExecutor?: IAPIExecutor) => {
  const scopeAPIExecutor = useAPIExecutor();
  const curAPIExecutor = useMemo(() => apiExecutor ?? scopeAPIExecutor, [apiExecutor, scopeAPIExecutor]);

  return useCallback((opts: UploadOptions) => {
    const { file, onSuccess, onError, onProgress } = opts;

    // 检查文件类型
    if (!(file instanceof File)) {
      onError?.(new Error('无效的文件类型'), file);
      return;
    }

    // 获取预签名上传地址
    runAPI(api, curAPIExecutor, { type: file.type, filename: file.name })
      .then((res) => {
        if (isSuccess(res)) {
          const { data } = res;
          const { uploadURL, cdnHost } = data ?? {};

          // 检查上传地址是否有效
          if (!uploadURL) {
            onError?.(new Error('获取上传地址失败'), file);
            return;
          }

          // 创建 XMLHttpRequest 实例
          const xhr = new XMLHttpRequest();

          // 监听上传进度
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable && onProgress) {
              const percent = Math.round((event.loaded / event.total) * 100);
              onProgress({ percent }, file);
            }
          });

          // 监听上传完成
          xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
              // 构建最终的文件访问地址
              const url = xhr.responseURL;
              const urlObj = new URL(url);
              const { pathname, host, protocol } = urlObj;
              const fieldUrl = cdnHost ? cdnHost + pathname : `${protocol}://${host}${pathname}`;
              onSuccess?.({ url: fieldUrl });
            } else {
              onError?.(new Error(`上传失败: HTTP ${xhr.status}`), file);
            }
          });

          // 监听上传错误
          xhr.addEventListener('error', () => {
            onError?.(new Error('网络错误，上传失败'), file);
          });

          // 发送上传请求
          xhr.open('PUT', uploadURL);
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.send(file);
        } else {
          onError?.(new Error('获取上传地址失败'), file);
        }
      })
      .catch((error) => {
        onError?.(error instanceof Error ? error : new Error('上传失败'), file);
      });
  }, [api, curAPIExecutor]);
};
