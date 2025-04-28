import { Upload as AntUpload, GetProps } from 'antd';

export const Upload: typeof AntUpload = AntUpload;

export type UploadProps = GetProps<typeof AntUpload>
