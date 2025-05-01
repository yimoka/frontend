/**
 * 图片上传和预览组件
 *
 * @created 2024-04-12
 * @lastModified 2024-04-12
 *
 * @summary 该组件提供了图片上传、预览、URL输入等功能，支持以下特性：
 * 1. 支持直接上传图片文件
 * 2. 支持手动输入图片URL
 * 3. 支持查看和复制图片URL
 * 4. 支持删除已上传的图片
 * 5. 提供图片预览功能
 *
 * @remarks
 * 该组件基于Ant Design的Upload组件实现，提供了更丰富的图片管理功能。
 * 主要用于表单中的图片上传和预览场景。
 *
 * @example
 * ```tsx
 * <InImage
 *   api={uploadApi}
 *   value={imageUrl}
 *   onChange={(url) => setImageUrl(url)}
 * />
 * ```
 *
 * @category 表单组件
 * @group 输入组件
 * @version 1.0.0
 */
import { MenuOutlined, PlusOutlined } from '@ant-design/icons';
import { Trigger, TriggerProps, useAPIExecutor, useUploadS3 } from '@yimoka/react';
import { IAPIExecutor, IStoreAPI } from '@yimoka/store';
import { Button, Dropdown, Image, Input, Modal, Progress, ProgressProps, Typography, Upload, UploadFile, UploadProps } from 'antd';
import React, { useMemo, useState } from 'react';

/**
 * InImage组件的属性定义
 *
 * @type {Object}
 * @property {IStoreAPI} api - 文件上传API配置，用于处理文件上传请求
 * @property {IAPIExecutor} [apiExecutor] - 可选的API执行器，用于自定义API请求
 * @property {string} [value] - 当前显示的图片URL，用于显示已上传的图片
 * @property {TriggerProps} [trigger] - 上传按钮的触发配置，用于自定义上传按钮的样式和行为
 * @property {(value?: string) => void} [onChange] - 图片URL变化时的回调函数，用于处理图片URL的更新
 *
 */
export type InImageProps = Omit<UploadProps, 'customRequest' | 'data' | 'action' | 'method' | 'name' | 'showUploadList' | 'fileList' | 'defaultFileList'> & {
  api: IStoreAPI
  apiExecutor?: IAPIExecutor
  value?: string
  trigger?: TriggerProps
  progress?: Omit<ProgressProps, 'percent'>
  onChange?: (value?: string) => void
}

/**
 * 图片上传和预览组件
 *
 * @summary 基于Ant Design的Upload组件实现的图片上传和预览组件
 *
 * @param {InImageProps} props - 组件属性
 * @returns {React.ReactElement} 组件实例
 *
 * @see {@link https://ant-design.antgroup.com/components/upload-cn} Ant Design Upload组件文档
 *
 */
export const InImage = (props: InImageProps) => {
  const { api, apiExecutor, value, trigger, onChange, progress, ...rest } = props;
  // 使用API执行器，优先使用传入的executor，否则使用上下文中的executor
  const scopeAPIExecutor = useAPIExecutor();
  const curAPIExecutor = useMemo(() => apiExecutor ?? scopeAPIExecutor, [apiExecutor, scopeAPIExecutor]);
  // 获取S3上传请求处理函数
  const customRequest = useUploadS3(api, curAPIExecutor) as UploadProps['customRequest'];

  // 控制URL输入模态框的显示状态
  const [inOpen, setInOpen] = useState(false);
  // 控制URL查看模态框的显示状态
  const [viewOpen, setViewOpen] = useState(false);
  // 存储用户输入的URL
  const [inputUrl, setInputUrl] = useState('');

  // 实现进度条
  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    if (value) {
      return [{
        uid: value,
        name: value,
        status: 'done',
        url: value,
      }];
    }
    return [];
  });

  // 是否上传中
  const isUploading = useMemo(() => fileList.some(item => item.status === 'uploading'), [fileList]);

  /**
   * 验证URL是否有效
   *
   * @summary 检查URL字符串是否符合URL格式规范
   *
   * @param {string} url - 待验证的URL字符串
   * @returns {boolean} URL是否有效
   *
   */
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * 处理URL输入确认
   * @summary 验证URL有效性并更新组件状态
   */
  const handleInputUrl = () => {
    if (!inputUrl) {
      setInOpen(true);
      return;
    }
    if (!isValidUrl(inputUrl)) {
      setInOpen(true);
      return;
    }
    onChange?.(inputUrl);
    setInOpen(false);
    setInputUrl('');
  };

  return (
    <>
      <Upload
        listType="picture-card"
        {...rest}
        action={undefined}
        customRequest={customRequest}
        disabled={!!value || isUploading}
        fileList={fileList}
        showUploadList={false}
        onChange={(info) => {
          setFileList(info.fileList);
          if (info?.file?.status === 'done') {
            const { url } = info.file.response ?? {};
            onChange?.(url);
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: 'relative' }} >
          {isUploading
            ? <Progress size="small"
              type="circle"
              {...progress}
              percent={fileList.find(item => item.status === 'uploading')?.percent ?? 0} />
            : <>
              {value
                ? <Image src={value} style={{ width: '100%' }} />
                : <Trigger
                  component={Button}
                  icon={<PlusOutlined />}
                  type="text"
                  {...trigger}
                />
              }
              {/* 操作菜单：包含删除、输入地址、查看地址等功能 */}
              <div onClick={e => e.stopPropagation()}>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'delete',
                        label: '删除',
                        disabled: !value,
                        onClick: () => onChange?.(undefined),
                      },
                      {
                        key: 'input',
                        label: '输入地址',
                        onClick: () => setInOpen(true),
                      },
                      {
                        disabled: !value,
                        key: 'view',
                        label: '查看地址',
                        onClick: () => setViewOpen(true),
                      },
                    ],
                  }}
                  placement="bottomRight">
                  <div style={{ position: 'absolute', right: 0, top: 0 }}>
                    <Button
                      color="primary"
                      icon={<MenuOutlined />}
                      size='small'
                      variant="text"
                    />
                  </div>
                </Dropdown>
              </div>
            </>
          }
        </div>
      </Upload>
      {/* URL输入模态框：用于手动输入图片URL */}
      <Modal
        destroyOnClose
        okButtonProps={{ disabled: !inputUrl || !isValidUrl(inputUrl) }}
        open={inOpen}
        title="输入图片地址"
        onCancel={() => setInOpen(false)}
        onOk={handleInputUrl}
      >
        <Input.TextArea
          placeholder="请输入图片地址"
          value={inputUrl}
          onChange={e => setInputUrl(e.target.value)}
        />
      </Modal>

      {/* URL查看模态框：用于查看和复制图片URL */}
      <Modal
        destroyOnClose
        footer={null}
        open={viewOpen}
        title="查看图片地址"
        onCancel={() => setViewOpen(false)}
      >
        <Typography.Link copyable={{ text: value }} href={value} target="_blank">{value}</Typography.Link>
      </Modal>
    </>
  );
};
